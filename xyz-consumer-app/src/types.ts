export interface Consumer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  saved_addresses: Address[];
  created_at: string;
}

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  houseFlat: string;
  streetArea: string;
  city: string;
  pincode: string;
  tag: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export interface Shop {
  id: string;
  shop_id: string; // e.g. "SUN123"
  shop_name: string;
  logo: string;
  banner: string;
  address: string;
  rating: number;
  rating_count: number;
  distance: string;
  status: 'OPEN' | 'CLOSED';
  delivery_time: string; // e.g. "30-45 min"
  delivery_fee: number; // e.g. 40
  min_order: number;
  phone: string;
  categories: string[];
  created_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  image: string;
  price: number; // in INR (₹)
  unit: string; // e.g. "kg", "500g", "pack"
  category: string;
  availability: boolean;
  popular?: boolean;
  weight_options?: string[]; // e.g. ["500 g", "1 kg", "1.5 kg", "2 kg"]
  servings?: string;
  pieces?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected_weight: string;
  unit_price: number;
  shop_id: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Shop Accepted'
  | 'Preparing'
  | 'Packed'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit: string;
  selected_weight: string;
  price: number; // captured at checkout
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  order_id: string; // e.g. "#XYZ1025"
  consumer_id: string;
  consumer_name: string;
  consumer_mobile: string;
  shop_id: string;
  shop_name: string;
  shop_address: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_address: Address;
  delivery_time_slot: string;
  payment_method: 'Cash on Delivery' | 'UPI';
  payment_status: 'Pending' | 'Paid';
  status: OrderStatus;
  status_history: OrderStatusHistoryItem[];
  estimated_delivery_time: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: Consumer;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
