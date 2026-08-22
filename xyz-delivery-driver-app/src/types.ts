export type VehicleType = 'Bike' | 'Scooter' | 'Other';

export type OrderStatus = 
  | 'AVAILABLE' 
  | 'READY_FOR_PICKUP'
  | 'ACCEPTED' 
  | 'GOING_TO_PICKUP' 
  | 'PICKED_UP' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'REJECTED';

export type PaymentMethod = 'Cash on Delivery' | 'Paid Online';

export interface OrderItem {
  id: string;
  name: string;
  quantity: string;
  price: number;
}

export interface Coordinates {
  x: number; // percentage on map canvas (0 - 100)
  y: number;
  lat?: number;
  lng?: number;
}

export interface DeliveryOrder {
  delivery_id: string;
  order_id: string; // e.g. "#1025"
  driver_id: string | null;
  shop_id: string;
  shop_name: string;
  shop_branch: string;
  shop_phone: string;
  shop_address: string;
  shop_coordinates?: Coordinates;
  
  consumer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_notes?: string;
  customer_coordinates?: Coordinates;
  
  distance: string; // e.g. "1.2 km"
  distance_km: number;
  estimated_time: string; // e.g. "15 min"
  order_amount: number; // e.g. ₹710
  delivery_earning: number; // e.g. ₹40
  tip_earning?: number;
  payment_method: PaymentMethod;
  items: OrderItem[];
  status: OrderStatus;
  
  created_at: string;
  accepted_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  cash_collected?: boolean;
  delivery_proof_image?: string;
  delivery_proof_note?: string;
}

export interface Driver {
  driver_id: string;
  full_name: string;
  username: string; // Unique e.g. "ramesh123"
  mobile: string;
  email: string;
  city: string;
  vehicle_type: VehicleType;
  vehicle_number: string;
  online_status: boolean;
  avatar_url?: string;
  rating: number;
  total_deliveries_count: number;
  created_at: string;
}

export interface DriverStats {
  today_deliveries: number;
  today_earnings: number;
  this_week_earnings: number;
  cash_collected_today: number;
  incentives_today: number;
  pending_orders: number;
  out_for_delivery_orders: number;
  completed_orders: number;
}
