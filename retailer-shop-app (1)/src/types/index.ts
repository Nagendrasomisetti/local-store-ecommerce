export type OrderStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'READY_FOR_PICKUP'
  | 'DELIVERY_ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'REJECTED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  name: string;
  quantity: string;
  price: number;
  image?: string;
  checked?: boolean;
}

export interface TimelineStep {
  status: OrderStatus;
  label: string;
  timestamp?: string;
  completed: boolean;
  current?: boolean;
  description?: string;
}

export interface Order {
  id: string; // e.g. "1025"
  customerName: string;
  customerPhone: string;
  isNewCustomer?: boolean;
  time: string;
  orderDate?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'Paid Online' | 'UPI / QR' | 'Card';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderType: 'Delivery' | 'Takeaway' | 'Dine-in';
  address: {
    street: string;
    colony?: string;
    city: string;
    state?: string;
    pincode: string;
    country?: string;
    landmark?: string;
  };
  specialInstructions?: string;
  note?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  assignedAt?: string;
  estimatedDeliveryMins?: string; // e.g. "15-20 min"
  createdAt?: string;
  timeline?: {
    step: number;
    title: string;
    time?: string;
    description?: string;
    isCurrent?: boolean;
    isCompleted?: boolean;
  }[];
}

export interface Driver {
  id: string;
  driverCode: string; // e.g. "D001"
  name: string;
  phone: string;
  avatar: string;
  vehicleNumber: string; // e.g. "AP 39 AB 1234"
  vehicleType: 'Bike' | 'Scooter' | 'EV' | 'Bicycle';
  joinedDate: string; // e.g. "15 Jan 2024"
  status: 'Online' | 'Offline';
  currentOrder?: string; // e.g. "#1025"
  totalDeliveries: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  rating: number;
}

export type DeliveryBoy = Driver;

export type ProductCategory = 'Chicken' | 'Mutton' | 'Eggs' | 'Fish' | string;
export type ProductStockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
export type ProductStatus = 'Active' | 'Inactive';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  shortDescription?: string;
  price: number;
  priceUnit?: string; // e.g. "per kg" or "500 g"
  comparePrice?: number;
  costPrice?: number;
  unit?: string; // "kg" | "500 g" | "piece" | "pack"
  stockStatus: ProductStockStatus;
  stockNote?: string;
  minOrderQty?: string;
  maxOrderQty?: string;
  tags?: string[];
  isVisible?: boolean;
  status: ProductStatus;
  images?: string[];
  image: string;
}

export interface ShopProfile {
  shopId: string;
  shopName: string;
  ownerName: string;
  address: string;
  colony?: string;
  city: string;
  state?: string;
  pincode: string;
  phone: string;
  timings?: string;
  isOpen: boolean;
  logo?: string;
  fssaiNumber?: string;
  gstin?: string;
}

export type ActiveTab = 'dashboard' | 'orders' | 'products' | 'drivers' | 'more' | 'delivery' | 'reports';

export type CurrentScreen =
  | 'login'
  | 'dashboard'
  | 'orders'
  | 'order_info'
  | 'products'
  | 'add_product'
  | 'drivers'
  | 'more'
  | 'settings'
  // Workflow sub-steps if user explores from details
  | 'order_details'
  | 'orders_list'
  | 'preparing'
  | 'ready'
  | 'assign_delivery'
  | 'own_delivery_boy'
  | 'delivery_assigned'
  | 'order_status'
  | 'delivery'
  | 'reports';
