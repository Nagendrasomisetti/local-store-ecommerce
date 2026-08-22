import { Router, Request, Response } from 'express';
import { db } from './db';

export const apiRouter = Router();

// Helper to authenticate user header
function getAuthUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  return db.findConsumerById(token);
}

// ----------------- HEALTH -----------------
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ----------------- AUTHENTICATION -----------------
apiRouter.post('/auth/signup', (req: Request, res: Response) => {
  try {
    const { name, mobile, email, password, confirmPassword } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your full name' });
    }
    if (!mobile || !/^\d{10}$/.test(mobile.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const consumer = db.createConsumer({
      name,
      mobile,
      email: email || undefined,
      password,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: consumer.id,
      user: consumer,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create account',
    });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !identifier.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your mobile number or email' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Please enter your password' });
    }

    const consumer = db.authenticateConsumer(identifier, password);
    if (!consumer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid mobile/email or password. Please check your credentials.',
      });
    }

    return res.json({
      success: true,
      message: 'Login successful',
      token: consumer.id,
      user: consumer,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Login error occurred',
    });
  }
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized or session expired' });
  }
  return res.json({ success: true, user });
});

// ----------------- ADDRESSES -----------------
apiRouter.post('/addresses', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Please log in to manage addresses' });
  }

  const { fullName, mobile, houseFlat, streetArea, city, pincode, tag, isDefault } = req.body;
  if (!fullName || !mobile || !houseFlat || !streetArea || !city || !pincode) {
    return res.status(400).json({ success: false, message: 'All address fields are required' });
  }

  try {
    const updatedUser = db.addAddress(user.id, {
      fullName,
      mobile,
      houseFlat,
      streetArea,
      city,
      pincode,
      tag: tag || 'Home',
      isDefault: !!isDefault,
    });
    return res.json({ success: true, user: updatedUser, message: 'Address saved successfully' });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

apiRouter.delete('/addresses/:addressId', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Please log in to manage addresses' });
  }

  try {
    const updatedUser = db.deleteAddress(user.id, req.params.addressId);
    return res.json({ success: true, user: updatedUser, message: 'Address deleted' });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

// ----------------- SHOPS -----------------
apiRouter.get('/shops', (req: Request, res: Response) => {
  const search = typeof req.query.search === 'string' ? req.query.search : '';
  const shops = db.searchShops(search);
  return res.json({ success: true, data: shops });
});

apiRouter.get('/shops/:shopId', (req: Request, res: Response) => {
  const shop = db.findShopByIdOrCode(req.params.shopId);
  if (!shop) {
    return res.status(404).json({ success: false, message: 'Shop not found' });
  }
  const products = db.getShopProducts(shop.id);
  return res.json({ success: true, data: { shop, products } });
});

apiRouter.get('/shops/qr/:qrPayload', (req: Request, res: Response) => {
  const rawPayload = decodeURIComponent(req.params.qrPayload).trim();
  // Decode possible formats: "SUN123", "https://xyz.com/shop/SUN123", "xyz:shop:SUN123", "shop_sun123"
  let shopCode = rawPayload;
  if (rawPayload.includes('/shop/')) {
    shopCode = rawPayload.split('/shop/')[1].split('?')[0].split('/')[0];
  } else if (rawPayload.includes(':shop:')) {
    shopCode = rawPayload.split(':shop:')[1];
  }

  const shop = db.findShopByIdOrCode(shopCode);
  if (!shop) {
    return res.status(404).json({
      success: false,
      message: 'Invalid xyz Shop QR Code. No matching retailer found.',
    });
  }
  return res.json({ success: true, data: shop });
});

// ----------------- ORDERS -----------------
apiRouter.post('/orders', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Please log in to place an order' });
  }

  try {
    const { shopId, items, deliveryAddress, deliveryTimeSlot, paymentMethod } = req.body;

    if (!shopId) {
      return res.status(400).json({ success: false, message: 'Shop information is required' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }
    if (!deliveryAddress || !deliveryAddress.houseFlat || !deliveryAddress.city) {
      return res.status(400).json({ success: false, message: 'Valid delivery address is required' });
    }

    const order = db.createOrder({
      consumerId: user.id,
      shopId,
      items,
      deliveryAddress,
      deliveryTimeSlot: deliveryTimeSlot || 'Deliver Now (30-45 min)',
      paymentMethod: paymentMethod || 'Cash on Delivery',
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Failed to place order',
    });
  }
});

apiRouter.get('/orders', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Please log in to view your orders' });
  }

  const orders = db.getOrdersForConsumer(user.id);
  return res.json({ success: true, data: orders });
});

apiRouter.get('/orders/:orderId', (req: Request, res: Response) => {
  const order = db.getOrderByIdOrCode(req.params.orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Security: verify user owns this order
  const user = getAuthUser(req);
  if (user && user.id !== order.consumer_id) {
    return res.status(403).json({ success: false, message: 'Access denied to this order' });
  }

  return res.json({ success: true, data: order });
});

// Demo/Testing helper: Advance order status to next stage
apiRouter.post('/orders/:orderId/advance-status', (req: Request, res: Response) => {
  const updatedOrder = db.advanceOrderStatus(req.params.orderId);
  if (!updatedOrder) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  return res.json({
    success: true,
    message: `Order status moved to ${updatedOrder.status}`,
    data: updatedOrder,
  });
});
