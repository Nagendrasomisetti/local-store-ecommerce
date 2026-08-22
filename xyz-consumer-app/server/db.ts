import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Consumer, Address, Shop, Product, Order, OrderItem, OrderStatus } from '../src/types';

interface DatabaseSchema {
  consumers: Array<Consumer & { password_hash: string; salt: string }>;
  shops: Shop[];
  products: Product[];
  orders: Order[];
  nextOrderSequence: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'xyz_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

const SEED_SHOPS: Shop[] = [
  {
    id: 'shop_sun123',
    shop_id: 'SUN123',
    shop_name: 'Sun Chicken & Meat Center',
    logo: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    address: '12 Main Street, Rajahmundry, AP 533101',
    rating: 4.8,
    rating_count: 342,
    distance: '1.2 km away',
    status: 'OPEN',
    delivery_time: '25-35 min',
    delivery_fee: 40,
    min_order: 150,
    phone: '+91 98765 43210',
    categories: ['Chicken', 'Boneless', 'Breast', 'Wings', 'Bone-in', 'Curry Cut', 'Special Cuts'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'shop_royal456',
    shop_id: 'ROYAL456',
    shop_name: 'Royal Fresh Poultry & Cuts',
    logo: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&auto=format&fit=crop&q=80',
    address: '45 Gandhi Nagar, Commercial Hub, Rajahmundry',
    rating: 4.9,
    rating_count: 512,
    distance: '2.5 km away',
    status: 'OPEN',
    delivery_time: '30-40 min',
    delivery_fee: 40,
    min_order: 150,
    phone: '+91 98765 11223',
    categories: ['Chicken', 'Boneless', 'Breast', 'Wings', 'Bone-in', 'Special Cuts'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'shop_green789',
    shop_id: 'GREEN789',
    shop_name: 'Green Valley Farm Fresh Meats',
    logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&auto=format&fit=crop&q=80',
    address: '88 Ring Road Bypass, Rajahmundry',
    rating: 4.7,
    rating_count: 189,
    distance: '3.8 km away',
    status: 'OPEN',
    delivery_time: '35-50 min',
    delivery_fee: 45,
    min_order: 200,
    phone: '+91 98765 99887',
    categories: ['Chicken', 'Boneless', 'Breast', 'Wings', 'Bone-in'],
    created_at: new Date().toISOString(),
  },
];

const SEED_PRODUCTS: Product[] = [
  // Products for Sun Chicken Shop (SUN123)
  {
    id: 'prod_sun_1',
    shop_id: 'shop_sun123',
    name: 'Chicken Breast (Boneless)',
    description: 'Fresh, tender and 100% antibiotic-free lean chicken breast fillets. High in protein, cleanly trimmed and hygienically vacuum-packed.',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80',
    price: 320,
    unit: 'kg',
    category: 'Breast',
    availability: true,
    popular: true,
    weight_options: ['500 g', '1 kg', '1.5 kg', '2 kg'],
    servings: '3-4 persons / kg',
    pieces: '4-5 pieces / kg',
  },
  {
    id: 'prod_sun_2',
    shop_id: 'shop_sun123',
    name: 'Boneless Chicken Cubes',
    description: 'Tender bite-sized pieces cut from thigh and breast meat. Perfect for butter chicken, tikka, and stir fry.',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80',
    price: 350,
    unit: 'kg',
    category: 'Boneless',
    availability: true,
    popular: true,
    weight_options: ['500 g', '1 kg', '1.5 kg', '2 kg'],
    servings: '3-4 persons / kg',
    pieces: '20-25 cubes / kg',
  },
  {
    id: 'prod_sun_3',
    shop_id: 'shop_sun123',
    name: 'Chicken Curry Cut (Bone-in)',
    description: 'Evenly cut fresh chicken pieces with skinless bone-in meat for rich, flavourful curries and gravies.',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80',
    price: 240,
    unit: 'kg',
    category: 'Bone-in',
    availability: true,
    popular: true,
    weight_options: ['500 g', '1 kg', '1.5 kg', '2 kg'],
    servings: '3-4 persons / kg',
    pieces: '14-16 pieces / kg',
  },
  {
    id: 'prod_sun_4',
    shop_id: 'shop_sun123',
    name: 'Chicken Wings (Skinless/Skin-on)',
    description: 'Juicy, succulent wings ideal for grilling, air frying, barbecue glazes and crispy spicy fry.',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&auto=format&fit=crop&q=80',
    price: 260,
    unit: 'kg',
    category: 'Wings',
    availability: true,
    popular: false,
    weight_options: ['500 g', '1 kg', '1.5 kg'],
    servings: '2-3 persons / kg',
    pieces: '8-10 wings / kg',
  },
  {
    id: 'prod_sun_5',
    shop_id: 'shop_sun123',
    name: 'Chicken Drumsticks',
    description: 'Plump, fleshy chicken legs cleaned with precision. Juicy on the inside and perfect for tandoori & roast.',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80',
    price: 290,
    unit: 'kg',
    category: 'Bone-in',
    availability: true,
    popular: true,
    weight_options: ['500 g', '1 kg', '1.5 kg', '2 kg'],
    servings: '3-4 persons / kg',
    pieces: '5-6 drumsticks / kg',
  },
  {
    id: 'prod_sun_6',
    shop_id: 'shop_sun123',
    name: 'Whole Chicken (Cleaned & Dressed)',
    description: 'Whole chicken gutted, skinless, washed and ready for whole roasting, biryani prep, or broth.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    price: 220,
    unit: 'kg',
    category: 'Special Cuts',
    availability: true,
    popular: false,
    weight_options: ['1 kg', '1.5 kg', '2 kg'],
    servings: '4-5 persons',
    pieces: '1 whole bird',
  },
  {
    id: 'prod_sun_7',
    shop_id: 'shop_sun123',
    name: 'Chicken Keema (Minced Meat)',
    description: 'Finely grounded boneless chicken breast and thigh meat, clean and lean for patties, kheema rolls and cutlets.',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80',
    price: 360,
    unit: 'kg',
    category: 'Boneless',
    availability: true,
    popular: false,
    weight_options: ['500 g', '1 kg'],
    servings: '3-4 persons',
    pieces: 'Minced',
  },

  // Products for Royal Fresh Poultry (ROYAL456)
  {
    id: 'prod_roy_1',
    shop_id: 'shop_royal456',
    name: 'Farm Fresh Chicken Breast',
    description: 'Super-lean high protein chicken breast cuts, freshly prepared every morning.',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80',
    price: 310,
    unit: 'kg',
    category: 'Breast',
    availability: true,
    popular: true,
    weight_options: ['500 g', '1 kg', '2 kg'],
  },
  {
    id: 'prod_roy_2',
    shop_id: 'shop_royal456',
    name: 'Tender Boneless Thigh Cut',
    description: 'Juicy dark meat chicken thighs, boneless and trimmed of excess fat.',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80',
    price: 340,
    unit: 'kg',
    category: 'Boneless',
    availability: true,
    popular: true,
    weight_options: ['500 g', '1 kg', '2 kg'],
  },
  {
    id: 'prod_roy_3',
    shop_id: 'shop_royal456',
    name: 'Special Biryani Cut',
    description: 'Large sized tender bone-in cuts specially crafted for Dum Biryani layers.',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80',
    price: 250,
    unit: 'kg',
    category: 'Bone-in',
    availability: true,
    popular: true,
    weight_options: ['1 kg', '1.5 kg', '2 kg'],
  },
  {
    id: 'prod_roy_4',
    shop_id: 'shop_royal456',
    name: 'Spicy BBQ Chicken Wings',
    description: 'Fresh clean wings trimmed and ready for frying or barbecue skewers.',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&auto=format&fit=crop&q=80',
    price: 250,
    unit: 'kg',
    category: 'Wings',
    availability: true,
    popular: false,
    weight_options: ['500 g', '1 kg'],
  },

  // Products for Green Valley (GREEN789)
  {
    id: 'prod_grn_1',
    shop_id: 'shop_green789',
    name: 'Organic Country Chicken (Natu Kodi)',
    description: 'Free-range desi country chicken, robust flavour and firm texture for traditional spicy curry.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    price: 450,
    unit: 'kg',
    category: 'Special Cuts',
    availability: true,
    popular: true,
    weight_options: ['1 kg', '1.5 kg'],
  },
  {
    id: 'prod_grn_2',
    shop_id: 'shop_green789',
    name: 'Premium Boneless Chicken Fillet',
    description: 'Prime quality antibiotic-residue-free chicken fillet cuts.',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80',
    price: 360,
    unit: 'kg',
    category: 'Boneless',
    availability: true,
    popular: true,
    weight_options: ['500 g', '1 kg', '2 kg'],
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure default structures exist
        if (!parsed.shops || parsed.shops.length === 0) parsed.shops = SEED_SHOPS;
        if (!parsed.products || parsed.products.length === 0) parsed.products = SEED_PRODUCTS;
        if (!parsed.consumers) parsed.consumers = [];
        if (!parsed.orders) parsed.orders = [];
        if (typeof parsed.nextOrderSequence !== 'number') parsed.nextOrderSequence = 1025;
        return parsed;
      } catch (err) {
        console.error('Error reading db file, re-seeding:', err);
      }
    }

    // Default Seed Data
    const defaultUserHash = hashPassword('password123');
    const defaultConsumer: Consumer & { password_hash: string; salt: string } = {
      id: 'usr_demo_1',
      name: 'Ravi Teja',
      mobile: '9876543210',
      email: 'ravi.consumer@xyz.com',
      password_hash: defaultUserHash.hash,
      salt: defaultUserHash.salt,
      created_at: new Date().toISOString(),
      saved_addresses: [
        {
          id: 'addr_1',
          fullName: 'Ravi Teja',
          mobile: '9876543210',
          houseFlat: 'Flat 402, Sri Rama Nilayam',
          streetArea: '12 Main Street, Danavaipeta',
          city: 'Rajahmundry',
          pincode: '533101',
          tag: 'Home',
          isDefault: true,
        },
        {
          id: 'addr_2',
          fullName: 'Ravi Teja',
          mobile: '9876543210',
          houseFlat: 'Plot 15, 2nd Floor, IT Tower',
          streetArea: 'Morampudi Junction',
          city: 'Rajahmundry',
          pincode: '533107',
          tag: 'Work',
          isDefault: false,
        }
      ]
    };

    const initialData: DatabaseSchema = {
      consumers: [defaultConsumer],
      shops: SEED_SHOPS,
      products: SEED_PRODUCTS,
      orders: [],
      nextOrderSequence: 1025,
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      this.data = data;
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- Consumer Authentication ---
  public findConsumerByMobileOrEmail(identifier: string) {
    const clean = identifier.trim().toLowerCase();
    return this.data.consumers.find(
      c => c.mobile.toLowerCase() === clean || (c.email && c.email.toLowerCase() === clean)
    );
  }

  public findConsumerById(id: string): Consumer | undefined {
    const consumer = this.data.consumers.find(c => c.id === id);
    if (!consumer) return undefined;
    const { password_hash, salt, ...safeConsumer } = consumer;
    return safeConsumer;
  }

  public createConsumer(data: { name: string; mobile: string; email?: string; password: string }): Consumer {
    const existing = this.findConsumerByMobileOrEmail(data.mobile);
    if (existing) {
      throw new Error('A user with this mobile number already exists.');
    }
    if (data.email) {
      const existingEmail = this.findConsumerByMobileOrEmail(data.email);
      if (existingEmail) {
        throw new Error('A user with this email already exists.');
      }
    }

    const { hash, salt } = hashPassword(data.password);
    const newConsumer = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      mobile: data.mobile.trim(),
      email: data.email?.trim() || undefined,
      password_hash: hash,
      salt: salt,
      saved_addresses: [],
      created_at: new Date().toISOString(),
    };

    this.data.consumers.push(newConsumer);
    this.saveData(this.data);

    const { password_hash: _, salt: __, ...safe } = newConsumer;
    return safe;
  }

  public authenticateConsumer(identifier: string, password: string): Consumer | null {
    const record = this.findConsumerByMobileOrEmail(identifier);
    if (!record) return null;

    const { hash } = hashPassword(password, record.salt);
    if (hash !== record.password_hash) return null;

    const { password_hash: _, salt: __, ...safe } = record;
    return safe;
  }

  // --- Saved Addresses ---
  public addAddress(consumerId: string, addressData: Omit<Address, 'id'>): Consumer {
    const userIndex = this.data.consumers.findIndex(c => c.id === consumerId);
    if (userIndex === -1) throw new Error('User not found');

    const newAddress: Address = {
      ...addressData,
      id: `addr_${Date.now()}`,
    };

    // If marked default, unset previous default
    if (newAddress.isDefault || this.data.consumers[userIndex].saved_addresses.length === 0) {
      this.data.consumers[userIndex].saved_addresses.forEach(a => { a.isDefault = false; });
      newAddress.isDefault = true;
    }

    this.data.consumers[userIndex].saved_addresses.push(newAddress);
    this.saveData(this.data);

    const { password_hash: _, salt: __, ...safe } = this.data.consumers[userIndex];
    return safe;
  }

  public deleteAddress(consumerId: string, addressId: string): Consumer {
    const userIndex = this.data.consumers.findIndex(c => c.id === consumerId);
    if (userIndex === -1) throw new Error('User not found');

    this.data.consumers[userIndex].saved_addresses = this.data.consumers[userIndex].saved_addresses.filter(
      a => a.id !== addressId
    );

    // If none marked default and list is not empty, make first default
    const addrs = this.data.consumers[userIndex].saved_addresses;
    if (addrs.length > 0 && !addrs.some(a => a.isDefault)) {
      addrs[0].isDefault = true;
    }

    this.saveData(this.data);
    const { password_hash: _, salt: __, ...safe } = this.data.consumers[userIndex];
    return safe;
  }

  // --- Shops & Discovery ---
  public getAllShops(): Shop[] {
    return this.data.shops;
  }

  public findShopByIdOrCode(idOrCode: string): Shop | undefined {
    const clean = idOrCode.trim().toLowerCase();
    return this.data.shops.find(
      s => s.id.toLowerCase() === clean || s.shop_id.toLowerCase() === clean
    );
  }

  public searchShops(query: string): Shop[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.data.shops;

    return this.data.shops.filter(s =>
      s.shop_id.toLowerCase().includes(q) ||
      s.shop_name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
    );
  }

  public getShopProducts(shopIdOrCode: string): Product[] {
    const shop = this.findShopByIdOrCode(shopIdOrCode);
    if (!shop) return [];
    return this.data.products.filter(p => p.shop_id === shop.id);
  }

  public getProductById(productId: string): Product | undefined {
    return this.data.products.find(p => p.id === productId);
  }

  // --- Orders & Tracking ---
  public createOrder(payload: {
    consumerId: string;
    shopId: string;
    items: Array<{ productId: string; quantity: number; selected_weight: string }>;
    deliveryAddress: Address;
    deliveryTimeSlot: string;
    paymentMethod: 'Cash on Delivery' | 'UPI';
  }): Order {
    const consumer = this.findConsumerById(payload.consumerId);
    if (!consumer) throw new Error('Invalid consumer account');

    const shop = this.findShopByIdOrCode(payload.shopId);
    if (!shop) throw new Error('Selected shop not found');

    if (!payload.items || payload.items.length === 0) {
      throw new Error('Cannot place an empty order');
    }

    // Backend-validated price calculations
    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    for (const reqItem of payload.items) {
      const prod = this.getProductById(reqItem.productId);
      if (!prod) {
        throw new Error(`Product ${reqItem.productId} is no longer available`);
      }
      if (prod.shop_id !== shop.id) {
        throw new Error(`Product ${prod.name} does not belong to shop ${shop.shop_name}`);
      }

      // Weight multiplier if pack is different (e.g. 500g is half price, 2kg is double)
      let priceMultiplier = 1;
      if (reqItem.selected_weight === '500 g' && prod.unit === 'kg') {
        priceMultiplier = 0.5;
      } else if (reqItem.selected_weight === '1.5 kg' && prod.unit === 'kg') {
        priceMultiplier = 1.5;
      } else if (reqItem.selected_weight === '2 kg' && prod.unit === 'kg') {
        priceMultiplier = 2;
      }

      const itemUnitPrice = Math.round(prod.price * priceMultiplier);
      const itemTotal = itemUnitPrice * reqItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        order_id: '', // Will be set below
        product_id: prod.id,
        product_name: prod.name,
        product_image: prod.image,
        quantity: reqItem.quantity,
        unit: prod.unit,
        selected_weight: reqItem.selected_weight || prod.unit,
        price: itemUnitPrice,
      });
    }

    const deliveryFee = subtotal >= 500 ? 0 : shop.delivery_fee;
    const total = subtotal + deliveryFee;

    const seq = this.data.nextOrderSequence;
    this.data.nextOrderSequence += 1;
    const orderCode = `#XYZ${seq}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      order_id: orderCode,
      consumer_id: consumer.id,
      consumer_name: consumer.name,
      consumer_mobile: consumer.mobile,
      shop_id: shop.id,
      shop_name: shop.shop_name,
      shop_address: shop.address,
      items: orderItems.map(it => ({ ...it, order_id: orderCode })),
      subtotal,
      delivery_fee: deliveryFee,
      total,
      delivery_address: payload.deliveryAddress,
      delivery_time_slot: payload.deliveryTimeSlot || 'Deliver Now (30-45 min)',
      payment_method: payload.paymentMethod || 'Cash on Delivery',
      payment_status: payload.paymentMethod === 'UPI' ? 'Paid' : 'Pending',
      status: 'Order Placed',
      status_history: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note: 'Your order has been received by xyz.com.',
        }
      ],
      estimated_delivery_time: '30-45 min',
      created_at: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);
    this.saveData(this.data);

    return newOrder;
  }

  public getOrdersForConsumer(consumerId: string): Order[] {
    return this.data.orders.filter(o => o.consumer_id === consumerId);
  }

  public getOrderByIdOrCode(idOrCode: string): Order | undefined {
    const clean = idOrCode.trim();
    return this.data.orders.find(
      o => o.id === clean || o.order_id.toLowerCase() === clean.toLowerCase()
    );
  }

  public advanceOrderStatus(idOrCode: string): Order | undefined {
    const order = this.getOrderByIdOrCode(idOrCode);
    if (!order) return undefined;

    const sequence: OrderStatus[] = [
      'Order Placed',
      'Shop Accepted',
      'Preparing',
      'Packed',
      'Out for Delivery',
      'Delivered',
    ];

    const currentIndex = sequence.indexOf(order.status);
    if (currentIndex >= 0 && currentIndex < sequence.length - 1) {
      const nextStatus = sequence[currentIndex + 1];
      order.status = nextStatus;
      order.status_history.push({
        status: nextStatus,
        timestamp: new Date().toISOString(),
        note: `Order updated to ${nextStatus}`,
      });
      if (nextStatus === 'Delivered') {
        order.payment_status = 'Paid';
      }
      this.saveData(this.data);
    }
    return order;
  }
}

export const db = new Database();
