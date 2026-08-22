import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import QRCode from 'qrcode';

export interface StoredRetailer {
  id: string;
  uniqueStoreName: string; // e.g. "sunchicken" or "metro-supermarket"
  storeName: string;
  storeLogo: string | null;
  storeAddress: string;
  ownerName: string;
  countryCode: string;
  mobileNumber: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  storeLink: string;
  qrDataUrl: string;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'PENDING';
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'retailers.json');

// Ensure data directory and file exist
function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function getAllRetailers(): StoredRetailer[] {
  initDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as StoredRetailer[];
  } catch (err) {
    console.error('Error reading database file:', err);
    return [];
  }
}

export function saveAllRetailers(retailers: StoredRetailer[]): void {
  initDb();
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(retailers, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Convert string to clean URL-safe slug e.g. "Sun Chicken & Store" -> "sun-chicken-store"
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

// Generate or validate unique store name
export function generateUniqueStoreName(baseName: string, existingRetailers: StoredRetailer[]): string {
  const existingNames = new Set(
    existingRetailers.map((r) => (r.uniqueStoreName || '').toLowerCase())
  );

  let clean = slugify(baseName) || 'my-store';
  if (!existingNames.has(clean)) {
    return clean;
  }

  // If already taken, append a number
  let counter = 1;
  let candidate = `${clean}-${counter}`;
  while (existingNames.has(candidate)) {
    counter++;
    candidate = `${clean}-${counter}`;
  }
  return candidate;
}

// Check if a unique store name is available
export function isStoreNameAvailable(uniqueName: string, existingRetailers: StoredRetailer[]): boolean {
  const clean = slugify(uniqueName);
  return !existingRetailers.some((r) => (r.uniqueStoreName || '').toLowerCase() === clean.toLowerCase());
}

// Generate a secure, readable temporary password e.g. "Xyz@4829" or "Xyz@7291"
export function generateTemporaryPassword(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `Xyz@${num}`;
}

// Hash password with salt using PBKDF2
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

// Generate QR Code data URL
export async function generateQrCode(url: string): Promise<string> {
  return await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#2E1065', // Dark deep purple
      light: '#FFFFFF',
    },
    width: 320,
  });
}
