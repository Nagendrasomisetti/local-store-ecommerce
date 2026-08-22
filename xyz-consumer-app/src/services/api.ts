import { Consumer, Shop, Product, Order, Address, ApiResponse, AuthResponse } from '../types';

const TOKEN_KEY = 'xyz_auth_token';
const USER_KEY = 'user_data';
const API_BASE_URL = ((import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || '').replace(/\/$/, '');

function normalizeUser(user: any): Consumer {
  return { ...user, saved_addresses: user?.saved_addresses || [], created_at: user?.created_at || new Date().toISOString() };
}

function normalizeShop(shop: any): Shop {
  return {
    id: shop.id,
    shop_id: shop.shop_id || shop.unique_name || shop.id,
    shop_name: shop.shop_name || shop.name,
    logo: shop.logo || '',
    banner: shop.banner || shop.logo || '',
    address: shop.address || '',
    rating: shop.rating || 0,
    rating_count: shop.rating_count || 0,
    distance: shop.distance || '',
    status: shop.status === 'CLOSED' ? 'CLOSED' : 'OPEN',
    delivery_time: shop.delivery_time || '30-45 min',
    delivery_fee: shop.delivery_fee ?? 40,
    min_order: shop.min_order ?? 0,
    phone: shop.phone || '',
    categories: shop.categories || [],
    created_at: shop.created_at || new Date().toISOString(),
  };
}

function normalizeProduct(product: any): Product {
  return { ...product, shop_id: product.shop_id || product.store_id, description: product.description || '', availability: product.availability ?? Boolean(product.available ?? true) };
}

function normalizeOrder(order: any, shop?: Shop, address?: Address): Order {
  const items = (order.items || []).map((item: any) => ({
    id: item.id,
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name || item.name,
    product_image: item.product_image || '',
    quantity: Number(item.quantity),
    unit: item.unit || 'kg',
    selected_weight: item.selected_weight || `${item.quantity} kg`,
    price: item.price,
    unit_price: item.price,
  }));
  const status = order.status === 'NEW' || order.status === 'PLACED' ? 'Order Placed' : order.status === 'ACCEPTED' ? 'Shop Accepted' : order.status === 'PREPARING' ? 'Preparing' : order.status === 'READY_FOR_PICKUP' ? 'Packed' : order.status === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : 'Delivered';
  return {
    ...order,
    order_id: order.order_code || order.order_id,
    consumer_name: order.consumer_name || '',
    consumer_mobile: order.consumer_mobile || '',
    shop_id: order.store_id || order.shop_id,
    shop_name: order.shop_name || shop?.shop_name || '',
    shop_address: order.shop_address || shop?.address || '',
    items,
    subtotal: order.subtotal ?? Math.max(0, (order.total || 0) - 40),
    delivery_fee: order.delivery_fee ?? 40,
    total: order.total || 0,
    delivery_address: typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : (order.delivery_address || address),
    delivery_time_slot: order.delivery_time_slot || 'Asap',
    payment_method: order.payment_method || 'Cash on Delivery',
    payment_status: order.payment_status || 'Pending',
    status,
    status_history: [{ status, timestamp: order.created_at || new Date().toISOString() }],
    estimated_delivery_time: '30-45 mins',
    created_at: order.created_at || new Date().toISOString(),
  };
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Network request failed');
  }
  return data;
}

export const api = {
  getToken,
  setToken,
  clearToken,
  request,

  // Auth
  async signup(data: { name: string; mobile: string; email?: string; password: string; confirmPassword: string }): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data, role: 'CONSUMER' }),
    });
    if (res.user?.id) setToken(res.user.id);
    if (res.user) res.user = normalizeUser(res.user);
    if (res.user) localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    return res;
  },

  async login(data: { identifier: string; password: string }): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.user?.id) setToken(res.user.id);
    if (res.user) res.user = normalizeUser(res.user);
    if (res.user) localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    return res;
  },

  async getCurrentUser(): Promise<Consumer | null> {
    const token = getToken();
    if (!token) return null;
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? normalizeUser(JSON.parse(data)) : null;
    } catch {
      clearToken();
      return null;
    }
  },

  async logout() {
    clearToken();
    localStorage.removeItem(USER_KEY);
  },

  // Addresses
  async addAddress(address: Omit<Address, 'id'>): Promise<Consumer> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Please log in to manage addresses');
    const updatedUser = normalizeUser({ ...user, saved_addresses: [...user.saved_addresses, { ...address, id: `addr_${Date.now()}` }] });
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  async deleteAddress(addressId: string): Promise<Consumer> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Please log in to manage addresses');
    const updatedUser = normalizeUser({ ...user, saved_addresses: user.saved_addresses.filter(address => address.id !== addressId) });
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  // Shops
  async getShops(search?: string): Promise<Shop[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await request<ApiResponse<any[]>>(`/api/stores${query}`);
    const shops = (res.data || []).map(normalizeShop);
    return search ? shops.filter(shop => `${shop.shop_id} ${shop.shop_name}`.toLowerCase().includes(search.toLowerCase())) : shops;
  },

  async getShopDetails(shopIdOrCode: string): Promise<{ shop: Shop; products: Product[] }> {
    const res = await request<ApiResponse<{ shop: Shop; products: Product[] }>>(`/api/stores/${encodeURIComponent(shopIdOrCode)}`);
    if (!res.data) throw new Error('Shop not found');
    return { shop: normalizeShop(res.data.shop), products: (res.data.products || []).map(normalizeProduct) };
  },

  async getShopByQR(qrPayload: string): Promise<Shop> {
    // For MVP, just lookup by ID
    const res = await request<ApiResponse<any>>(`/api/stores/${encodeURIComponent(qrPayload)}`);
    if (!res.data) throw new Error(res.message || 'Invalid xyz Shop QR Code');
    return normalizeShop(res.data.shop || res.data);
  },

  async createOrder(payload: {
    shopId: string;
    items: Array<{ productId: string; quantity: number; selected_weight: string; price?: number; name?: string }>;
    deliveryAddress: Address;
    deliveryTimeSlot: string;
    paymentMethod: 'Cash on Delivery' | 'UPI';
    total?: number;
  }): Promise<Order> {
    const token = getToken();
    const mappedPayload = {
      store_id: payload.shopId,
      consumer_id: token,
      items: payload.items.map(i => ({
        product_id: i.productId,
        quantity: i.quantity,
        price: i.price || 240,
        name: i.name || 'Product'
      })),
      delivery_address: payload.deliveryAddress
    };
    
    const res = await request<ApiResponse<Order>>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(mappedPayload),
    });
    if (!res.data) throw new Error('Order creation failed');
    return normalizeOrder(res.data, undefined, payload.deliveryAddress);
  },

  async getOrders(): Promise<Order[]> {
    const token = getToken();
    const res = await request<ApiResponse<any[]>>(`/api/orders?role=CONSUMER&userId=${token}`);
    if (!res.data) return [];
    return res.data.map((order: any) => normalizeOrder(order));
  },

  async getOrder(orderId: string): Promise<Order> {
    const res = await request<ApiResponse<Order>>(`/api/orders/${encodeURIComponent(orderId)}`);
    if (!res.data) throw new Error('Order not found');
    return normalizeOrder(res.data);
  },

  async advanceOrderStatus(orderId: string): Promise<Order> {
    const res = await request<ApiResponse<Order>>(`/api/orders/${encodeURIComponent(orderId)}/advance-status`, {
      method: 'POST',
    });
    if (!res.data) throw new Error('Failed to update order status');
    return res.data;
  }
};
