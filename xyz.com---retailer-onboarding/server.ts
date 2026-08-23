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
  const sharedBackendUrl = process.env.SHARED_BACKEND_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://xyz-shared-backend.onrender.com'
      : 'http://localhost:4000');

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
      const sharedResponse = await fetch(`${sharedBackendUrl}/api/retailers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName,
          uniqueStoreName,
          storePhoto,
          storeAddress,
          ownerName,
          countryCode,
          mobileNumber,
          email,
        }),
      });
      const sharedData = await sharedResponse.json();

      if (!sharedResponse.ok) {
        res.status(sharedResponse.status).json({
          error: sharedData.message || sharedData.error || 'Failed to register store.',
          suggested: sharedData.suggested,
          existingStoreName: sharedData.existingStoreName,
        });
        return;
      }

      const finalUniqueStoreName = sharedData.username || sharedData.uniqueStoreName;
      const storeLink = sharedData.storeLink || `xyz.com/store/${finalUniqueStoreName}`;
      const qrDataUrl = await generateQrCode(`https://${storeLink}`);

      res.status(201).json({
        success: true,
        message: 'Store registration successful',
        storeId: sharedData.storeId,
        username: finalUniqueStoreName,
        uniqueStoreName: finalUniqueStoreName,
        storeName: sharedData.storeName || storeName,
        storeAddress: sharedData.storeAddress || storeAddress,
        ownerName: sharedData.ownerName || ownerName,
        mobileNumber: sharedData.mobileNumber || `${countryCode} ${mobileNumber}`,
        email: sharedData.email || email,
        temporaryPassword: sharedData.temporaryPassword,
        storeLink,
        qrDataUrl,
        createdAt: sharedData.createdAt || new Date().toISOString(),
        status: sharedData.status || 'ACTIVE',
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
