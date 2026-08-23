import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getAllRetailers,
  saveAllRetailers,
  generateUniqueStoreName,
  isStoreNameAvailable,
  slugify,
  generateTemporaryPassword,
  hashPassword,
  generateQrCode,
  StoredRetailer,
} from './server/db';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Check unique store name availability
  app.get('/api/stores/check-name', (req: Request, res: Response) => {
    const rawName = (req.query.name as string) || '';
    const clean = slugify(rawName);
    if (!clean) {
      res.json({ available: false, slug: '' });
      return;
    }
    const retailers = getAllRetailers();
    const available = isStoreNameAvailable(clean, retailers);
    const suggested = available ? clean : generateUniqueStoreName(clean, retailers);
    res.json({ available, slug: clean, suggested });
  });

  // Get specific store public details
  app.get('/api/stores/:uniqueStoreName', (req: Request, res: Response) => {
    const { uniqueStoreName } = req.params;
    const retailers = getAllRetailers();
    const clean = slugify(uniqueStoreName);
    const found = retailers.find(
      (r) => (r.uniqueStoreName || '').toLowerCase() === clean.toLowerCase()
    );

    if (!found) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }

    // Exclude security details
    const { passwordHash, passwordSalt, ...publicData } = found;
    res.json(publicData);
  });

  // Register a new retailer store
  app.post('/api/retailers/register', async (req: Request, res: Response) => {
    try {
      const {
        storeName,
        uniqueStoreName,
        storePhoto,
        storeAddress,
        ownerName,
        countryCode = '+91',
        mobileNumber,
        email,
      } = req.body;

      // 1. Validation
      if (!storeName || typeof storeName !== 'string' || !storeName.trim()) {
        res.status(400).json({ error: 'Store Name is required' });
        return;
      }
      if (!storeAddress || typeof storeAddress !== 'string' || !storeAddress.trim()) {
        res.status(400).json({ error: 'Store Address is required' });
        return;
      }
      if (!ownerName || typeof ownerName !== 'string' || !ownerName.trim()) {
        res.status(400).json({ error: 'Owner Name is required' });
        return;
      }
      if (!mobileNumber || typeof mobileNumber !== 'string' || !mobileNumber.trim()) {
        res.status(400).json({ error: 'Mobile Number is required' });
        return;
      }
      if (!email || typeof email !== 'string' || !email.trim()) {
        res.status(400).json({ error: 'Email Address is required' });
        return;
      }

      const cleanMobile = mobileNumber.trim().replace(/\D/g, '');
      if (cleanMobile.length < 7 || cleanMobile.length > 15) {
        res.status(400).json({
          error: 'Please enter a valid mobile number (typically 10 digits).',
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        res.status(400).json({ error: 'Please enter a valid email address.' });
        return;
      }

      const retailers = getAllRetailers();

      // Check duplicates for phone/email
      const duplicate = retailers.find(
        (r) =>
          r.mobileNumber.replace(/\D/g, '') === cleanMobile ||
          r.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (duplicate) {
        res.status(409).json({
          error: `A store is already registered with this mobile number or email (Store: ${duplicate.uniqueStoreName || duplicate.storeName}). If you need help, please contact support.`,
          existingStoreName: duplicate.uniqueStoreName,
        });
        return;
      }

      // 2. Generate or Validate Unique Store Name
      let finalUniqueStoreName = '';
      if (uniqueStoreName && typeof uniqueStoreName === 'string' && uniqueStoreName.trim()) {
        const customSlug = slugify(uniqueStoreName);
        if (customSlug.length < 3) {
          res.status(400).json({ error: 'Unique Store Name must be at least 3 characters.' });
          return;
        }
        if (!isStoreNameAvailable(customSlug, retailers)) {
          res.status(409).json({
            error: `The unique store name "${customSlug}" is already taken. Please choose another one.`,
            suggested: generateUniqueStoreName(customSlug, retailers),
          });
          return;
        }
        finalUniqueStoreName = customSlug;
      } else {
        finalUniqueStoreName = generateUniqueStoreName(storeName.trim(), retailers);
      }

      // 3. Temporary Password & Hashing
      const temporaryPassword = generateTemporaryPassword();
      const { hash, salt } = hashPassword(temporaryPassword);

      // 4. Store Link & QR code
      const storeLink = `xyz.com/store/${finalUniqueStoreName}`;
      const fullStoreUrl = `https://${storeLink}`;
      const qrDataUrl = await generateQrCode(fullStoreUrl);

      const now = new Date().toISOString();
      const newRetailer: StoredRetailer = {
        id: `ret_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        uniqueStoreName: finalUniqueStoreName,
        storeName: storeName.trim(),
        storeLogo: storePhoto || null,
        storeAddress: storeAddress.trim(),
        ownerName: ownerName.trim(),
        countryCode: countryCode.trim(),
        mobileNumber: cleanMobile,
        email: email.trim().toLowerCase(),
        passwordHash: hash,
        passwordSalt: salt,
        storeLink,
        qrDataUrl,
        createdAt: now,
        updatedAt: now,
        status: 'ACTIVE',
      };

      // 5. Persistence
      retailers.push(newRetailer);
      saveAllRetailers(retailers);

      console.log(`[xyz.com] New retailer registered: ${storeName} (Unique Store Name: ${finalUniqueStoreName})`);

      // 6. Response
      res.status(201).json({
        success: true,
        message: 'Store registration successful',
        uniqueStoreName: finalUniqueStoreName,
        storeName: newRetailer.storeName,
        storeAddress: newRetailer.storeAddress,
        ownerName: newRetailer.ownerName,
        mobileNumber: `${countryCode} ${cleanMobile}`,
        email: newRetailer.email,
        temporaryPassword,
        storeLink,
        qrDataUrl,
        createdAt: now,
        status: 'ACTIVE',
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      res.status(500).json({
        error: 'Failed to complete store registration. Please try again.',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`xyz.com server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
