import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Users table (Roles: CONSUMER, RETAILER, DRIVER)
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      mobile TEXT,
      email TEXT,
      password_hash TEXT,
      role TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Stores table
    db.run(`CREATE TABLE IF NOT EXISTS stores (
      id TEXT PRIMARY KEY,
      owner_id TEXT,
      name TEXT,
      unique_name TEXT,
      address TEXT,
      status TEXT DEFAULT 'ACTIVE'
    )`);

    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      store_id TEXT,
      name TEXT,
      price REAL,
      description TEXT,
      image TEXT,
      category TEXT,
      unit TEXT,
      available INTEGER DEFAULT 1
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_code TEXT,
      consumer_id TEXT,
      store_id TEXT,
      driver_id TEXT,
      status TEXT,
      total REAL,
      delivery_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Order Items table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT,
      product_id TEXT,
      product_name TEXT,
      quantity INTEGER,
      price REAL
    )`);

    // Seed Data
    seedData();
  });
}

function seedData() {
  db.get('SELECT count(*) as count FROM users', (err, row: any) => {
    if (row && row.count === 0) {
      console.log('Seeding initial data...');
      // Insert default Retailer
      db.run(`INSERT INTO users (id, name, mobile, email, password_hash, role) VALUES 
        ('ret_1', 'Sun Shop Owner', '9876543211', 'sun@shop.com', 'hash123', 'RETAILER')`);
      
      // Insert default Store
      db.run(`INSERT INTO stores (id, owner_id, name, unique_name, address) VALUES 
        ('shop_sun123', 'ret_1', 'Sun Chicken & Meat Center', 'sun-chicken', '12 Main Street')`);

      // Insert default Products
      db.run(`INSERT INTO products (id, store_id, name, price, description, image, category, unit) VALUES 
        ('prod_1', 'shop_sun123', 'Chicken Breast (Boneless)', 320, 'Fresh, tender', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&q=80', 'Breast', 'kg')`);
      db.run(`INSERT INTO products (id, store_id, name, price, description, image, category, unit) VALUES 
        ('prod_2', 'shop_sun123', 'Boneless Chicken Cubes', 350, 'Tender bite-sized pieces', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80', 'Boneless', 'kg')`);

      // Insert default Consumer
      db.run(`INSERT INTO users (id, name, mobile, email, password_hash, role) VALUES 
        ('con_1', 'Ravi Teja', '9876543210', 'ravi@xyz.com', 'hash123', 'CONSUMER')`);
      
      // Insert default Driver
      db.run(`INSERT INTO users (id, name, mobile, email, password_hash, role) VALUES 
        ('drv_1', 'Rajesh Driver', '9876543212', 'rajesh@xyz.com', 'hash123', 'DRIVER')`);
    }
  });
}

// Helper functions for DB queries using Promises
export const query = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const get = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export default db;
