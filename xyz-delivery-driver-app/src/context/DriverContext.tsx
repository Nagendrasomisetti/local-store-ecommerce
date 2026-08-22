import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DeliveryOrder, Driver, DriverStats, OrderStatus, VehicleType } from '../types';
import { INITIAL_DRIVERS, INITIAL_ORDERS } from '../data/mockData';

export type AppTab = 'home' | 'orders' | 'navigation' | 'earnings' | 'history' | 'profile';

interface DriverContextType {
  currentDriver: Driver | null;
  registeredDrivers: Driver[];
  orders: DeliveryOrder[];
  activeOrder: DeliveryOrder | null;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isOnline: boolean;
  toggleOnlineStatus: () => void;
  stats: DriverStats;
  
  // Auth methods
  login: (username: string, password?: string) => { success: boolean; message: string };
  signup: (data: {
    full_name: string;
    username: string;
    mobile: string;
    email: string;
    password?: string;
    city: string;
    vehicle_type: VehicleType;
  }) => { success: boolean; message: string };
  logout: () => void;
  checkUsernameAvailable: (username: string) => { available: boolean; message: string };
  updateProfile: (data: Partial<Driver>) => void;
  switchDriverAccount: (driverId: string) => void;

  // Order Lifecycle Actions
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  markAsGoingToPickup: (orderId: string) => void;
  markAsPickedUp: (orderId: string, proofNote?: string) => void;
  markAsOutForDelivery: (orderId: string) => void;
  confirmPaymentCollected: (orderId: string) => void;
  markAsDelivered: (orderId: string, proofImage?: string) => void;
  
  // Navigation & UI Helpers
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  openOrderDetails: (order: DeliveryOrder) => void;
  openNavigationForOrder: (order: DeliveryOrder) => void;
  callingContact: { name: string; phone: string; role: 'Shop' | 'Customer' } | null;
  setCallingContact: (contact: { name: string; phone: string; role: 'Shop' | 'Customer' } | null) => void;
  notification: { message: string; type?: 'info' | 'success' | 'warning' } | null;
  setNotification: (notif: { message: string; type?: 'info' | 'success' | 'warning' } | null) => void;
  
  // Prototype reset / generator
  resetDemoData: () => void;
  simulateNewOrder: () => void;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

const DRIVER_STORAGE_KEY = 'xyz_driver_current_v2';
const REGISTERED_DRIVERS_KEY = 'xyz_registered_drivers_v2';
const ORDERS_STORAGE_KEY = 'xyz_driver_orders_v2';

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Registered drivers state
  const [registeredDrivers, setRegisteredDrivers] = useState<Driver[]>(() => {
    try {
      const saved = localStorage.getItem(REGISTERED_DRIVERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
    } catch {
      return INITIAL_DRIVERS;
    }
  });

  // Active current driver
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(() => {
    try {
      const saved = localStorage.getItem(DRIVER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DRIVERS[0]; // Default logged-in as Ramesh Kumar
    } catch {
      return INITIAL_DRIVERS[0];
    }
  });

  // Orders list
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);

  const fetchOrders = async () => {
    if (!currentDriver?.driver_id) return;
    try {
      const res = await fetch(`/api/orders?role=DRIVER&userId=${currentDriver.driver_id}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data.map((o: any) => ({
          delivery_id: o.id,
          order_id: o.order_code,
          driver_id: o.driver_id,
          shop_id: o.store_id,
          shop_name: o.shop_name,
          shop_address: o.shop_address,
          consumer_id: o.consumer_id,
          customer_name: o.consumer_name,
          customer_phone: o.consumer_mobile,
          customer_address: typeof o.delivery_address === 'string' ? JSON.parse(o.delivery_address).streetArea : '',
          customer_city: typeof o.delivery_address === 'string' ? JSON.parse(o.delivery_address).city : '',
          order_amount: o.total,
          delivery_earning: 40,
          payment_method: 'Cash',
          items: o.items.map((i: any) => ({ id: i.id, name: i.product_name, quantity: `${i.quantity}`, price: i.price })),
          status: o.status,
          created_at: o.created_at
        })));
      }
    } catch(e) {}
  };

  useEffect(() => {
    if (currentDriver) fetchOrders();
  }, [currentDriver]);

  useEffect(() => {
    if (!currentDriver) return;
    const sse = new EventSource(`/api/events?role=DRIVER&userId=${currentDriver.driver_id}`);
    sse.onmessage = () => fetchOrders();
    return () => sse.close();
  }, [currentDriver]);

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [callingContact, setCallingContact] = useState<{ name: string; phone: string; role: 'Shop' | 'Customer' } | null>(null);
  const [notification, setNotification] = useState<{ message: string; type?: 'info' | 'success' | 'warning' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(REGISTERED_DRIVERS_KEY, JSON.stringify(registeredDrivers));
    } catch (e) {
      console.warn('Failed to save registered drivers:', e);
    }
  }, [registeredDrivers]);

  useEffect(() => {
    try {
      if (currentDriver) {
        localStorage.setItem(DRIVER_STORAGE_KEY, JSON.stringify(currentDriver));
      } else {
        localStorage.removeItem(DRIVER_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save current driver:', e);
    }
  }, [currentDriver]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders:', e);
    }
  }, [orders]);

  // Derive active order in progress for current driver
  const activeOrder = useMemo(() => {
    if (!currentDriver) return null;
    if (activeOrderId) {
      const found = orders.find(o => o.delivery_id === activeOrderId);
      if (found && found.status !== 'DELIVERED' && found.status !== 'REJECTED') {
        return found;
      }
    }
    // Search for any order assigned to current driver that is in-progress
    return orders.find(
      o => o.driver_id === currentDriver.driver_id && 
      ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(o.status)
    ) || null;
  }, [orders, currentDriver, activeOrderId]);

  const isOnline = currentDriver?.online_status ?? false;

  const toggleOnlineStatus = useCallback(() => {
    if (!currentDriver) return;
    const newStatus = !currentDriver.online_status;
    const updated = { ...currentDriver, online_status: newStatus };
    setCurrentDriver(updated);
    setRegisteredDrivers(prev => prev.map(d => d.driver_id === currentDriver.driver_id ? updated : d));
    
    setNotification({
      message: newStatus ? 'You are now ONLINE. You can receive new orders.' : 'You are now OFFLINE. New delivery alerts paused.',
      type: newStatus ? 'success' : 'info'
    });
  }, [currentDriver]);

  // Username validation helper (Instagram-like unique check)
  const checkUsernameAvailable = useCallback((username: string): { available: boolean; message: string } => {
    const clean = username.trim().toLowerCase().replace(/^@/, '');
    if (!clean) {
      return { available: false, message: 'Please enter a username' };
    }
    if (clean.length < 3) {
      return { available: false, message: 'Username must be at least 3 characters' };
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(clean)) {
      return { available: false, message: 'Only letters, numbers, underscores and dots allowed' };
    }

    const isTaken = registeredDrivers.some(
      d => d.username.toLowerCase() === clean && d.driver_id !== currentDriver?.driver_id
    );

    if (isTaken) {
      return { available: false, message: 'This username is already taken.' };
    }
    return { available: true, message: 'Username available.' };
  }, [registeredDrivers, currentDriver]);

  // Auth: Login
  const login = async (username: string, _password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: username, password: _password || 'Xyz@1234' })
      });
      const data = await res.json();
      if (data.success && data.user.role === 'DRIVER') {
        setCurrentDriver({ ...INITIAL_DRIVERS[0], driver_id: data.user.id, full_name: data.user.name, username, mobile: data.user.mobile, email: data.user.email });
        setActiveTab('home');
        setNotification({ message: `Welcome back, ${data.user.name}!`, type: 'success' });
        return { success: true, message: 'Logged in successfully.' };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch(e: any) {
      return { success: false, message: e.message };
    }
  };

  // Auth: Sign up
  const signup = async (data: {
    full_name: string;
    username: string;
    mobile: string;
    email: string;
    password?: string;
    city: string;
    vehicle_type: VehicleType;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.full_name, mobile: data.mobile, email: data.email, password: data.password || 'Xyz@1234', role: 'DRIVER' })
      });
      const resData = await res.json();
      if (resData.success) {
        setCurrentDriver({ ...INITIAL_DRIVERS[0], driver_id: resData.user.id, full_name: data.full_name, username: data.username, mobile: data.mobile, email: data.email });
        setActiveTab('home');
        setNotification({ message: `Registration complete!`, type: 'success' });
        return { success: true, message: 'Account created' };
      }
      return { success: false, message: 'Failed to create account' };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  // Auth: Logout
  const logout = useCallback(() => {
    setCurrentDriver(null);
    setActiveOrderId(null);
    setNotification({ message: 'You have been logged out.', type: 'info' });
  }, []);

  const updateProfile = useCallback((data: Partial<Driver>) => {
    if (!currentDriver) return;
    const updated = { ...currentDriver, ...data };
    setCurrentDriver(updated);
    setRegisteredDrivers(prev => prev.map(d => d.driver_id === currentDriver.driver_id ? updated : d));
    setNotification({ message: 'Profile updated successfully!', type: 'success' });
  }, [currentDriver]);

  const switchDriverAccount = useCallback((driverId: string) => {
    const target = registeredDrivers.find(d => d.driver_id === driverId);
    if (target) {
      setCurrentDriver(target);
      setActiveOrderId(null);
      setNotification({ message: `Switched account to ${target.full_name}`, type: 'info' });
    }
  }, [registeredDrivers]);

  // Order Lifecycle: Accept Order
  const acceptOrder = async (orderId: string) => {
    if (!currentDriver) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACCEPTED', driver_id: currentDriver.driver_id })
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        setNotification({ message: error.message || 'This delivery was already accepted.', type: 'warning' });
        await fetchOrders();
        return;
      }
      fetchOrders();
      setActiveOrderId(orderId);
      setActiveTab('orders');
      setNotification({ message: `Order accepted! Head over to pickup shop.`, type: 'success' });
    } catch(e) {}
  };

  // Order Lifecycle: Reject Order
  const rejectOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.delivery_id === orderId) {
        return {
          ...order,
          status: 'REJECTED',
        };
      }
      return order;
    }));
    setNotification({ message: `Delivery rejected.`, type: 'info' });
  }, []);

  // Order Lifecycle: Moving to Pickup
  const markAsGoingToPickup = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.delivery_id === orderId) {
        return {
          ...order,
          status: 'GOING_TO_PICKUP',
        };
      }
      return order;
    }));
    setActiveOrderId(orderId);
  }, []);

  // Order Lifecycle: Picked Up
  const markAsPickedUp = async (orderId: string, proofNote?: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'OUT_FOR_DELIVERY' })
      });
      fetchOrders();
      setNotification({ message: 'Order picked up from shop! Next step: Deliver to customer.', type: 'success' });
    } catch(e) {}
  };

  // Order Lifecycle: Out for delivery
  const markAsOutForDelivery = async (orderId: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'OUT_FOR_DELIVERY' })
      });
      fetchOrders();
      setActiveOrderId(orderId);
    } catch(e) {}
  };

  // Order Lifecycle: Confirm Cash Collected
  const confirmPaymentCollected = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.delivery_id === orderId) {
        return {
          ...order,
          cash_collected: true,
        };
      }
      return order;
    }));
    setNotification({ message: 'Cash collection confirmed.', type: 'success' });
  }, []);

  // Order Lifecycle: Mark as Delivered
  const markAsDelivered = async (orderId: string, proofImage?: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DELIVERED' })
      });
      fetchOrders();
      setNotification({ message: 'Order successfully delivered!', type: 'success' });
    } catch(e) {}
  };

  // Open order in details view
  const openOrderDetails = useCallback((order: DeliveryOrder) => {
    setActiveOrderId(order.delivery_id);
    setActiveTab('orders');
  }, []);

  // Open interactive navigation
  const openNavigationForOrder = useCallback((order: DeliveryOrder) => {
    setActiveOrderId(order.delivery_id);
    setActiveTab('navigation');
  }, []);

  // Calculate Driver Stats dynamically
  const stats: DriverStats = useMemo(() => {
    if (!currentDriver) {
      return {
        today_deliveries: 0,
        today_earnings: 0,
        this_week_earnings: 0,
        cash_collected_today: 0,
        incentives_today: 0,
        pending_orders: 0,
        out_for_delivery_orders: 0,
        completed_orders: 0,
      };
    }

    const driverOrders = orders.filter(o => o.driver_id === currentDriver.driver_id);
    const completed = driverOrders.filter(o => o.status === 'DELIVERED');
    const outForDelivery = driverOrders.filter(o => o.status === 'OUT_FOR_DELIVERY');
    const pendingAvailable = orders.filter(o => (o.status === 'READY_FOR_PICKUP' && !o.driver_id) || (o.driver_id === currentDriver.driver_id && o.status === 'READY_FOR_PICKUP'));

    const completedEarnings = completed.reduce((sum, o) => sum + o.delivery_earning + (o.tip_earning || 0), 0);
    const cashCollected = completed.filter(o => o.payment_method === 'Cash on Delivery').reduce((sum, o) => sum + o.order_amount, 0);
    
    // Baseline base figures for demo consistency with reference design (e.g. ₹1,250)
    const baseTodayEarnings = 1250;
    const baseWeekEarnings = 7450;
    const totalTodayEarnings = baseTodayEarnings + (completed.length > 3 ? (completed.length - 3) * 40 : 0);

    return {
      today_deliveries: completed.length > 0 ? completed.length + 2 : 5,
      today_earnings: totalTodayEarnings,
      this_week_earnings: baseWeekEarnings + (completed.length * 40),
      cash_collected_today: 1050 + (cashCollected > 0 ? cashCollected : 0),
      incentives_today: 200,
      pending_orders: pendingAvailable.length,
      out_for_delivery_orders: outForDelivery.length,
      completed_orders: completed.length > 0 ? completed.length + 2 : 5,
    };
  }, [orders, currentDriver]);

  // Reset to initial demo data
  const resetDemoData = useCallback(() => {
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    localStorage.removeItem(DRIVER_STORAGE_KEY);
    localStorage.removeItem(REGISTERED_DRIVERS_KEY);
    setOrders(INITIAL_ORDERS);
    setRegisteredDrivers(INITIAL_DRIVERS);
    setCurrentDriver(INITIAL_DRIVERS[0]);
    setActiveOrderId(null);
    setActiveTab('home');
    setNotification({ message: 'Reset application state to default demo data.', type: 'info' });
  }, []);

  // Simulate new incoming order
  const simulateNewOrder = useCallback(() => {
    const nextNum = Math.floor(1028 + Math.random() * 90);
    const names = ['Kavita Rao', 'Mohan Krishna', 'Deepa Nair', 'Santosh Reddy', 'Meera Joshi'];
    const shops = [
      { name: 'Sun Chicken Shop', branch: 'Main Branch', addr: 'Market Road, Rajahmundry' },
      { name: 'Fresh Cut Meats', branch: 'Kotagummam', addr: 'Opposite Clock Tower, Rajahmundry' },
      { name: 'Super Agro Chicken', branch: 'Aryapuram', addr: 'Main Line, Aryapuram' },
    ];
    const chosenShop = shops[Math.floor(Math.random() * shops.length)];
    const chosenName = names[Math.floor(Math.random() * names.length)];
    const isCod = Math.random() > 0.4;
    const amount = Math.floor(320 + Math.random() * 550);

    const newOrder: DeliveryOrder = {
      delivery_id: `DEL-${nextNum}`,
      order_id: `#${nextNum}`,
      driver_id: null,
      shop_id: `SHP-00${Math.floor(1 + Math.random() * 4)}`,
      shop_name: chosenShop.name,
      shop_branch: chosenShop.branch,
      shop_phone: '+91 98765 00112',
      shop_address: chosenShop.addr,
      shop_coordinates: { x: 30 + Math.random() * 20, y: 30 + Math.random() * 20 },
      consumer_id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      customer_name: chosenName,
      customer_phone: '+91 98480 ' + Math.floor(10000 + Math.random() * 90000),
      customer_address: `${Math.floor(10 + Math.random() * 90)} Main Road, Rajahmundry`,
      customer_city: 'Rajahmundry',
      distance: `${(0.9 + Math.random() * 2.5).toFixed(1)} km`,
      distance_km: parseFloat((0.9 + Math.random() * 2.5).toFixed(1)),
      estimated_time: `${Math.floor(10 + Math.random() * 15)} min`,
      order_amount: amount,
      delivery_earning: 40 + (amount > 500 ? 15 : 0),
      payment_method: isCod ? 'Cash on Delivery' : 'Paid Online',
      items: [
        { id: `itm-new-${Date.now()}`, name: 'Fresh Chicken Curry Cut', quantity: '1.5 KG', price: amount }
      ],
      status: 'AVAILABLE',
      created_at: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    setNotification({ message: `⚡ New Delivery Available: ${newOrder.order_id} (${newOrder.shop_name})`, type: 'success' });
  }, []);

  return (
    <DriverContext.Provider
      value={{
        currentDriver,
        registeredDrivers,
        orders,
        activeOrder,
        activeTab,
        setActiveTab,
        isOnline,
        toggleOnlineStatus,
        stats,
        login,
        signup,
        logout,
        checkUsernameAvailable,
        updateProfile,
        switchDriverAccount,
        acceptOrder,
        rejectOrder,
        markAsGoingToPickup,
        markAsPickedUp,
        markAsOutForDelivery,
        confirmPaymentCollected,
        markAsDelivered,
        activeOrderId,
        setActiveOrderId,
        openOrderDetails,
        openNavigationForOrder,
        callingContact,
        setCallingContact,
        notification,
        setNotification,
        resetDemoData,
        simulateNewOrder,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDriver must be used within a DriverProvider');
  }
  return context;
};
