import express from 'express';
import cors from 'cors';
import { query, get, run } from './db';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const clients: { id: string; res: express.Response; role: string; userId: string; storeId?: string }[] = [];

function notifyClients() {
  const data = JSON.stringify({ type: 'UPDATE' });
  clients.forEach(client => client.res.write(`data: ${data}\n\n`));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/orders', async (req, res) => {
  const { userId, role, storeId } = req.query;
  try {
    let orders: any[] = [];
    if (role === 'CONSUMER') {
      orders = await query(`SELECT * FROM orders WHERE consumer_id = ? ORDER BY created_at DESC`, [userId]);
    } else if (role === 'RETAILER') {
      orders = await query(`SELECT * FROM orders WHERE store_id = ? ORDER BY created_at DESC`, [storeId]);
    } else if (role === 'DRIVER') {
      orders = await query(`SELECT * FROM orders WHERE (status = 'READY_FOR_PICKUP' AND driver_id IS NULL) OR driver_id = ? ORDER BY created_at DESC`, [userId]);
    } else {
      orders = await query(`SELECT * FROM orders ORDER BY created_at DESC`);
    }

    for (const order of orders) {
      order.items = await query(`SELECT * FROM order_items WHERE order_id = ?`, [order.id]);
      const consumer = await get(`SELECT name, mobile FROM users WHERE id = ?`, [order.consumer_id]);
      order.consumer_name = consumer?.name;
      order.consumer_mobile = consumer?.mobile;
      const store = await get(`SELECT name, address FROM stores WHERE id = ?`, [order.store_id]);
      order.shop_name = store?.name;
      order.shop_address = store?.address;
    }
    res.json({ success: true, data: orders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await get(`SELECT * FROM orders WHERE id = ? OR order_code = ?`, [req.params.id, req.params.id]);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.items = await query(`SELECT * FROM order_items WHERE order_id = ?`, [order.id]);
    const consumer = await get(`SELECT name, mobile FROM users WHERE id = ?`, [order.consumer_id]);
    order.consumer_name = consumer?.name;
    order.consumer_mobile = consumer?.mobile;
    const store = await get(`SELECT name, address FROM stores WHERE id = ?`, [order.store_id]);
    order.shop_name = store?.name;
    order.shop_address = store?.address;
    res.json({ success: true, data: order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  const { status, driver_id } = req.body;
  try {
    if (driver_id) {
      const result = await run(`UPDATE orders SET status = ?, driver_id = ? WHERE id = ? AND driver_id IS NULL`, [status, driver_id, req.params.id]);
      if (!result.changes) return res.status(409).json({ success: false, message: 'This delivery has already been accepted by another driver.' });
    } else {
      await run(`UPDATE orders SET status = ? WHERE id = ?`, [status, req.params.id]);
    }
    notifyClients();
    const order = await get(`SELECT * FROM orders WHERE id = ?`, [req.params.id]);
    res.json({ success: true, data: order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  const { userId, role, storeId } = req.query;
  const clientId = Date.now().toString();
  clients.push({ id: clientId, res, userId: String(userId), role: String(role), storeId: String(storeId) });
  req.on('close', () => {
    const index = clients.findIndex(client => client.id === clientId);
    if (index !== -1) clients.splice(index, 1);
  });
});

app.get('/api/stores/check-name', async (req, res) => {
  const rawName = (req.query.name as string) || '';
  const clean = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existing = await get(`SELECT id FROM stores WHERE unique_name = ?`, [clean]);
  res.json(existing
    ? { available: false, slug: clean, suggested: clean + '-' + Math.floor(Math.random() * 1000) }
    : { available: true, slug: clean, suggested: clean });
});

app.post('/api/retailers/register', async (req, res) => {
  const { storeName, uniqueStoreName, storeAddress, ownerName, countryCode, mobileNumber, email } = req.body;
  try {
    const temporaryPassword = 'Xyz@' + Math.floor(1000 + Math.random() * 9000);
    const userId = `ret_${Date.now()}`;
    const storeId = `shop_${Date.now()}`;
    await run(`INSERT INTO users (id, name, mobile, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, ownerName, String(mobileNumber).replace(/\D/g, ''), email, temporaryPassword, 'RETAILER']);
    await run(`INSERT INTO stores (id, owner_id, name, unique_name, address) VALUES (?, ?, ?, ?, ?)`,
      [storeId, userId, storeName, uniqueStoreName, storeAddress]);
    res.status(201).json({ success: true, message: 'Store registration successful', storeId, username: uniqueStoreName, uniqueStoreName,
      storeName, storeAddress, ownerName, mobileNumber: `${countryCode} ${String(mobileNumber).replace(/\D/g, '')}`,
      email, temporaryPassword, storeLink: `xyz.com/store/${uniqueStoreName}`, qrDataUrl: '', status: 'ACTIVE' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, mobile, email, password, role } = req.body;
  if (!name || !mobile || !password || !role) return res.status(400).json({ success: false, message: 'Missing required fields' });
  try {
    const id = `${role.toLowerCase().substring(0, 3)}_${Date.now()}`;
    await run(`INSERT INTO users (id, name, mobile, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, mobile, email, password, role]);
    const user = await get(`SELECT id, name, mobile, email, role FROM users WHERE id = ?`, [id]);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await get(`SELECT u.id, u.name, u.mobile, u.email, u.role, s.id as storeId, s.unique_name as username
      FROM users u LEFT JOIN stores s ON s.owner_id = u.id
      WHERE (u.mobile = ? OR u.email = ? OR s.unique_name = ?) AND u.password_hash = ?`, [identifier, identifier, identifier, password]);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/stores', async (req, res) => {
  const { owner_id, name, unique_name, address } = req.body;
  const id = `shop_${Date.now()}`;
  try {
    await run(`INSERT INTO stores (id, owner_id, name, unique_name, address) VALUES (?, ?, ?, ?, ?)`, [id, owner_id, name, unique_name, address]);
    res.json({ success: true, store: await get(`SELECT * FROM stores WHERE id = ?`, [id]) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/stores', async (req, res) => {
  try { res.json({ success: true, data: await query(`SELECT * FROM stores`) }); }
  catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/stores/:id', async (req, res) => {
  try {
    const store = await get(`SELECT * FROM stores WHERE id = ? OR unique_name = ? OR owner_id = ?`, [req.params.id, req.params.id, req.params.id]);
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
    const products = await query(`SELECT * FROM products WHERE store_id = ?`, [store.id]);
    res.json({ success: true, data: { shop: store, products } });
  } catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/stores/:id/products', async (req, res) => {
  try { res.json({ success: true, data: await query(`SELECT * FROM products WHERE store_id = ?`, [req.params.id]) }); }
  catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/products', async (req, res) => {
  const { store_id, name, price, description, image, category, unit, stock_status, status } = req.body;
  const id = `prod_${Date.now()}`;
  try {
    await run(`INSERT INTO products (id, store_id, name, price, description, image, category, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, store_id, name, price, description, image, category, unit]);
    const product = await get(`SELECT * FROM products WHERE id = ?`, [id]);
    res.json({ success: true, product: { ...product, stock_status: stock_status || 'In Stock', status: status || 'Active' } });
  } catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  const { name, price, description, image, category, unit, stock_status, status } = req.body;
  try {
    await run(`UPDATE products SET name = ?, price = ?, description = ?, image = ?, category = ?, unit = ? WHERE id = ?`,
      [name, price, description, image, category, unit, req.params.id]);
    notifyClients();
    const product = await get(`SELECT * FROM products WHERE id = ?`, [req.params.id]);
    res.json({ success: true, product: { ...product, stock_status: stock_status || product.stock_status || 'In Stock', status: status || product.status || 'Active' } });
  } catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try { await run(`DELETE FROM products WHERE id = ?`, [req.params.id]); notifyClients(); res.json({ success: true }); }
  catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    console.log('========== CREATE ORDER ==========');
    console.log('REQUEST BODY:', JSON.stringify(req.body, null, 2));

    const {
      consumer_id,
      shop_id,
      store_id,
      items,
      delivery_address
    } = req.body;

    // Consumer app may send either shop_id or store_id
    const resolvedStoreId = shop_id || store_id;

    console.log('consumer_id:', consumer_id);
    console.log('shop_id:', shop_id);
    console.log('store_id:', store_id);
    console.log('resolvedStoreId:', resolvedStoreId);
    console.log('items:', JSON.stringify(items, null, 2));

    if (!consumer_id) {
      return res.status(400).json({
        success: false,
        message: 'consumer_id is required'
      });
    }

    if (!resolvedStoreId) {
      return res.status(400).json({
        success: false,
        message: 'store_id/shop_id is required'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one order item is required'
      });
    }

    // Verify store exists
    const store = await get(
      `SELECT * FROM stores
       WHERE id = ? OR unique_name = ?`,
      [resolvedStoreId, resolvedStoreId]
    );

    if (!store) {
      return res.status(404).json({
        success: false,
        message: `Store not found: ${resolvedStoreId}`
      });
    }

    const actualStoreId = store.id;

    console.log('STORE FOUND:', JSON.stringify(store));

    const orderId = `ord_${Date.now()}`;
    const orderCode = `#XYZ${Math.floor(1000 + Math.random() * 9000)}`;

    let subtotal = 0;
    const orderItems: any[] = [];

    // Resolve every product from the shared database
    for (const item of items) {
      const productId = item.productId || item.product_id;
      const quantity = Number(item.quantity) || 1;

      console.log('Looking for product:', productId);

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID missing from order item'
        });
      }

      const product = await get(
        `SELECT * FROM products WHERE id = ? AND store_id = ?`,
        [productId, actualStoreId]
      );

      console.log(
        'PRODUCT FOUND:',
        product ? JSON.stringify(product) : 'NO PRODUCT'
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${productId}`
        });
      }

      const itemTotal = Number(product.price) * quantity;

      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity,
        price: Number(product.price)
      });
    }

    const deliveryFee = 40;
    const total = subtotal + deliveryFee;

    // First create the order
    await run(
      `INSERT INTO orders
      (id, order_code, consumer_id, store_id, status, total, delivery_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        orderCode,
        consumer_id,
        actualStoreId,
        'NEW',
        total,
        JSON.stringify(delivery_address || {})
      ]
    );

    // Then create order items
    for (const item of orderItems) {
      await run(
        `INSERT INTO order_items
        (id, order_id, product_id, product_name, quantity, price)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          `item_${Date.now()}_${Math.random()}`,
          orderId,
          item.productId,
          item.productName,
          item.quantity,
          item.price
        ]
      );
    }

    notifyClients();

    // Return the complete order
    const order = await get(
      `SELECT * FROM orders WHERE id = ?`,
      [orderId]
    );

    order.items = await query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    order.shop_name = store.name;
    order.shop_address = store.address;

    console.log('FINAL ORDER:', JSON.stringify(order, null, 2));
    console.log('=================================');

    res.json({
      success: true,
      data: order
    });

  } catch (err: any) {
    console.error('CREATE ORDER ERROR:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Shared Backend running on http://localhost:${PORT}`);
});