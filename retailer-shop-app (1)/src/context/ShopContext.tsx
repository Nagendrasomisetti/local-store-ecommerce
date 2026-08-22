import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  ActiveTab,
  CurrentScreen,
  Driver,
  Order,
  OrderStatus,
  Product,
  ShopProfile,
} from '../types';
import {
  INITIAL_DRIVERS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SHOP_PROFILE,
} from '../data/mockData';
import { soundManager } from '../utils/audio';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

interface ShopContextType {
  // Auth & Profile
  isAuthenticated: boolean;
  shopProfile: ShopProfile;
  login: (shopId: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateShopProfile: (updates: Partial<ShopProfile>) => void;

  // Shop Online / Offline
  isShopOpen: boolean;
  toggleShopStatus: () => void;

  // Sound Settings
  soundEnabled: boolean;
  toggleSound: () => void;

  // Navigation & View
  currentScreen: CurrentScreen;
  activeTab: ActiveTab;
  activeOrderId: string;
  currentOrder: Order | undefined;
  navigationHistory: CurrentScreen[];
  setActiveTab: (tab: ActiveTab) => void;
  setActiveOrderId: (id: string) => void;
  navigateTo: (screen: CurrentScreen, orderId?: string) => void;
  goBack: () => void;

  // Orders
  orders: Order[];
  ordersFilter: 'All' | 'New' | 'Preparing' | 'Assigned' | 'Delivered' | 'Accepted' | string;
  setOrdersFilter: (filter: string) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, extra?: Partial<Order>) => void;
  acceptOrder: (orderId: string) => Promise<void>;
  rejectOrder: (orderId: string, reason?: string) => Promise<void>;
  markOrderReady: (orderId: string, note?: string) => Promise<void>;
  assignDriver: (orderId: string, driverId: string) => Promise<void>;
  assignDeliveryAgent: (orderId: string) => Promise<void>;
  assignManualDelivery: (orderId: string) => Promise<void>;
  createManualOrder: (orderData: Partial<Order>) => Order;
  markOutForDelivery: (orderId: string) => Promise<void>;
  markOrderDelivered: (orderId: string) => Promise<void>;

  // Drivers
  drivers: Driver[];
  selectedDriverId: string;
  setSelectedDriverId: (id: string) => void;
  toggleDriverStatus: (id: string) => void;
  addDriver: (data: string | { name?: string; phone?: string; vehicleType?: Driver['vehicleType']; vehicleNumber?: string; driverId?: string }) => boolean;
  deleteDriver: (id: string) => void;

  // Products
  products: Product[];
  selectedProductCategory: string;
  setSelectedProductCategory: (cat: string) => void;
  editingProduct: Product | null;
  setEditingProduct: (prod: Product | null) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  toggleProductStatus: (id: string) => void;
  deleteProduct: (id: string) => void;

  // Modals & UI helpers
  activeModal: 'none' | 'map' | 'driver_details' | 'edit_shop' | 'filter' | 'add_driver' | 'contact' | 'preview_product' | 'reject_order';
  setActiveModal: (modal: 'none' | 'map' | 'driver_details' | 'edit_shop' | 'filter' | 'add_driver' | 'contact' | 'preview_product' | 'reject_order') => void;
  selectedModalDriver: Driver | null;
  setSelectedModalDriver: (driver: Driver | null) => void;
  rejectingOrderId: string | null;
  setRejectingOrderId: (id: string | null) => void;

  // Counts / Metrics
  counts: {
    newOrders: number;
    acceptedOrders: number;
    deliveredOrders: number;
    rejectedOrders: number;
    preparing: number;
    assignedToDriver: number;
    ready: number;
    outForDelivery: number;
    completed: number;
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    totalDrivers: number;
    onlineDrivers: number;
    offlineDrivers: number;
    onDeliveryDrivers: number;
    totalSales: number;
    totalTodayOrders: number;
    totalWeightSoldKg: number;
  };

  // Toast & Loading
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  isActionLoading: boolean;
  actionLoadingText: string;

  // Reset
  resetPrototype: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEY_AUTH = 'retailer_shop_auth_v3';
const STORAGE_KEY_ORDERS = 'retailer_shop_orders_v3';
const STORAGE_KEY_PRODUCTS = 'retailer_shop_products_v3';
const STORAGE_KEY_DRIVERS = 'retailer_shop_drivers_v3';
const STORAGE_KEY_SOUND = 'retailer_shop_sound_v3';
const STORAGE_KEY_OPEN = 'retailer_shop_open_v3';
const STORAGE_KEY_PROFILE = 'retailer_shop_profile_v3';

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
    return saved === 'true';
  });

  const [shopProfile, setShopProfile] = useState<ShopProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_SHOP_PROFILE;
    } catch {
      return INITIAL_SHOP_PROFILE;
    }
  });

  // Shop Open / Closed
  const [isShopOpen, setIsShopOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_OPEN);
    return saved !== 'false';
  });

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SOUND);
    return saved !== 'false';
  });

  // Screen and tabs
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>(() => {
    const isAuth = localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    return isAuth ? 'dashboard' : 'login';
  });
  const [activeTab, setActiveTabState] = useState<ActiveTab>('dashboard');
  const [activeOrderId, setActiveOrderId] = useState<string>('1025');
  const [navigationHistory, setNavigationHistory] = useState<CurrentScreen[]>(['dashboard']);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersFilter, setOrdersFilter] = useState<'New' | 'Accepted' | 'Delivered' | string>('New');

  const fetchOrders = async () => {
    if (!shopProfile?.id) return;
    try {
      const res = await fetch(`/api/orders?role=RETAILER&storeId=${shopProfile.id}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data.map((o: any) => ({
          id: o.id,
          customerName: o.consumer_name,
          customerPhone: o.consumer_mobile,
          isNewCustomer: true,
          time: new Date(o.created_at).toLocaleTimeString(),
          orderDate: new Date(o.created_at).toLocaleDateString(),
          status: o.status,
          items: o.items.map((i: any) => ({
            id: i.id, name: i.product_name, quantity: `${i.quantity}`, price: i.price
          })),
          total: o.total,
          paymentMethod: 'Cash',
          paymentStatus: 'Pending',
          orderType: 'Delivery',
          address: typeof o.delivery_address === 'string' ? JSON.parse(o.delivery_address) : o.delivery_address
        })));
      }
    } catch (e) {}
  };

  const fetchProducts = async () => {
    if (!shopProfile?.id) return;
    try {
      const res = await fetch(`/api/stores/${shopProfile.id}/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          shortDescription: p.description,
          price: p.price,
          priceUnit: p.unit,
          stockStatus: p.stock_status,
          status: p.status,
          image: p.image,
        })));
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchProducts();
    }
  }, [isAuthenticated, shopProfile?.id]);

  useEffect(() => {
    if (!isAuthenticated || !shopProfile?.id) return;
    const sse = new EventSource(`/api/events?role=RETAILER&storeId=${shopProfile.id}`);
    sse.onmessage = () => { 
      fetchOrders(); 
      fetchProducts();
    };
    return () => sse.close();
  }, [isAuthenticated, shopProfile?.id]);

  // Drivers
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRIVERS);
      return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
    } catch {
      return INITIAL_DRIVERS;
    }
  });
  const [selectedDriverId, setSelectedDriverId] = useState<string>('d001');

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('All Products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Modals
  const [activeModal, setActiveModal] = useState<'none' | 'map' | 'driver_details' | 'edit_shop' | 'filter' | 'add_driver' | 'contact' | 'preview_product' | 'reject_order'>('none');
  const [selectedModalDriver, setSelectedModalDriver] = useState<Driver | null>(null);
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [actionLoadingText, setActionLoadingText] = useState<string>('');

  // Persist states
  useEffect(() => {
    soundManager.setMuted(!soundEnabled);
    localStorage.setItem(STORAGE_KEY_SOUND, String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AUTH, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_OPEN, String(isShopOpen));
  }, [isShopOpen]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(shopProfile));
  }, [shopProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Product syncing removed as we rely on backend

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DRIVERS, JSON.stringify(drivers));
  }, [drivers]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3200);
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundManager.setMuted(!next);
      if (next) soundManager.playSuccessTone();
      showToast(next ? 'Sound alerts enabled' : 'Sound alerts muted', 'info');
      return next;
    });
  };

  const toggleShopStatus = () => {
    setIsShopOpen((prev) => {
      const next = !prev;
      soundManager.playClickTone();
      showToast(next ? 'Store is now Open' : 'Store is now Closed', next ? 'success' : 'info');
      return next;
    });
  };

  const updateShopProfile = (updates: Partial<ShopProfile>) => {
    setShopProfile((prev) => ({ ...prev, ...updates }));
    showToast('Shop details updated', 'success');
  };

  const navigateTo = (screen: CurrentScreen, orderId?: string) => {
    soundManager.playClickTone();
    if (orderId) {
      setActiveOrderId(orderId);
    }
    setNavigationHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);

    // Synchronize active tab
    if (screen === 'dashboard') setActiveTabState('dashboard');
    else if (screen === 'orders' || screen === 'orders_list' || screen === 'order_info' || screen === 'order_details') setActiveTabState('orders');
    else if (screen === 'products' || screen === 'add_product') setActiveTabState('products');
    else if (screen === 'drivers' || screen === 'delivery') setActiveTabState('drivers');
    else if (screen === 'more') setActiveTabState('more');
  };

  const goBack = () => {
    soundManager.playClickTone();
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('dashboard');
      setActiveTabState('dashboard');
    }
  };

  const setActiveTab = (tab: ActiveTab) => {
    soundManager.playClickTone();
    setActiveTabState(tab);
    if (tab === 'dashboard') {
      setCurrentScreen('dashboard');
      setNavigationHistory(['dashboard']);
    } else if (tab === 'orders') {
      setCurrentScreen('orders');
      setNavigationHistory(['dashboard', 'orders']);
    } else if (tab === 'products') {
      setCurrentScreen('products');
      setNavigationHistory(['dashboard', 'products']);
    } else if (tab === 'drivers') {
      setCurrentScreen('drivers');
      setNavigationHistory(['dashboard', 'drivers']);
    } else if (tab === 'more') {
      setCurrentScreen('more');
      setNavigationHistory(['dashboard', 'more']);
    }
  };

  const login = async (shopId: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsActionLoading(true);
    setActionLoadingText('Logging in...');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: shopId, password: pass })
      });
      const data = await res.json();
      if (data.success && data.user.role === 'RETAILER') {
        const storeRes = await fetch(`/api/stores/${data.user.id}`);
        const storeData = await storeRes.json();
        const store = storeData.data?.shop || { id: 'shop_sun123', name: 'Demo Shop' };
        
        setIsAuthenticated(true);
        setShopProfile({ ...INITIAL_SHOP_PROFILE, id: store.id, shopName: store.name });
        setCurrentScreen('dashboard');
        setActiveTabState('dashboard');
        setNavigationHistory(['dashboard']);
        soundManager.playSuccessTone();
        showToast('Welcome back!', 'success');
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials or role' };
    } catch (e: any) {
      return { success: false, error: e.message };
    } finally {
      setIsActionLoading(false);
      setActionLoadingText('');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('login');
    setNavigationHistory([]);
    soundManager.playClickTone();
    showToast('Logged out', 'info');
  };

  const currentOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, extra?: Partial<Order>) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            ...extra,
          };
        }
        return order;
      })
    );
  };

  const acceptOrder = async (orderId: string) => {
    setIsActionLoading(true);
    setActionLoadingText('Accepting Order...');
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACCEPTED' })
      });
      updateOrderStatus(orderId, 'ACCEPTED');
      soundManager.playSuccessTone();
      showToast(`Order #${orderId} accepted!`, 'success');
    } catch (e) {}
    setIsActionLoading(false);
    setActionLoadingText('');
  };

  const rejectOrder = async (orderId: string, reason?: string) => {
    setIsActionLoading(true);
    setActionLoadingText('Rejecting Order...');
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsActionLoading(false);
    setActionLoadingText('');

    updateOrderStatus(orderId, 'REJECTED', { note: reason || 'Rejected by store' });
    soundManager.playClickTone();
    showToast(`Order #${orderId} rejected`, 'info');
    setActiveModal('none');
    setRejectingOrderId(null);
  };

  const markOrderReady = async (orderId: string, note?: string) => {
    setIsActionLoading(true);
    setActionLoadingText('Marking Ready...');
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READY_FOR_PICKUP' })
      });
      updateOrderStatus(orderId, 'READY_FOR_PICKUP', { note: note || '' });
      soundManager.playBellTone();
      showToast(`Order #${orderId} is Ready for delivery!`, 'success');
    } catch(e) {}
    setIsActionLoading(false);
    setActionLoadingText('');
  };

  const assignDriver = async (orderId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId) || drivers[0];
    setIsActionLoading(true);
    setActionLoadingText(`Assigning to ${driver.name}...`);
    try {
      const sharedDriverId = driver.id === 'd001' ? 'drv_1' : driver.id;
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READY_FOR_PICKUP', driver_id: sharedDriverId }),
      });
      if (!response.ok) throw new Error('Failed to assign delivery driver');

      updateOrderStatus(orderId, 'READY_FOR_PICKUP', {
        assignedDriverId: sharedDriverId,
        assignedDriverName: driver.name,
        assignedDriverPhone: driver.phone,
      });

      setDrivers((prev) =>
        prev.map((d) =>
          d.id === driverId
            ? {
                ...d,
                currentOrder: `#${orderId}`,
                pendingDeliveries: d.pendingDeliveries + 1,
              }
            : d
        )
      );

      soundManager.playSuccessTone();
      showToast(`Order #${orderId} assigned to ${driver.name}`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Failed to assign delivery driver', 'error');
    } finally {
      setIsActionLoading(false);
      setActionLoadingText('');
    }
  };

  const assignManualDelivery = async (orderId: string) => {
    setIsActionLoading(true);
    setActionLoadingText('Setting Manual / Self Delivery...');
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsActionLoading(false);
    setActionLoadingText('');

    updateOrderStatus(orderId, 'OUT_FOR_DELIVERY', {
      assignedDriverId: 'self_retailer',
      assignedDriverName: `${shopProfile.shopName} (Self Delivery)`,
      assignedDriverPhone: shopProfile.phone || '9876501234',
      note: 'Retailer Self Delivery: No delivery boy required.',
    });

    soundManager.playSuccessTone();
    showToast(`Order #${orderId} assigned for Manual / Self Delivery!`, 'success');
    navigateTo('delivery_assigned');
  };

  const assignDeliveryAgent = async (orderId: string) => {
    setIsActionLoading(true);
    setActionLoadingText('Making order available to delivery agents...');
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READY_FOR_PICKUP' }),
      });
      if (!response.ok) throw new Error('Failed to publish order to delivery agents');
      updateOrderStatus(orderId, 'READY_FOR_PICKUP', { assignedDriverId: undefined });
      soundManager.playSuccessTone();
      showToast('Order is now available to delivery agents.', 'success');
      navigateTo('orders');
    } catch (e: any) {
      showToast(e.message || 'Failed to publish order to delivery agents', 'error');
    } finally {
      setIsActionLoading(false);
      setActionLoadingText('');
    }
  };

  const createManualOrder = (orderData: Partial<Order>): Order => {
    const newId = String(Math.floor(1000 + Math.random() * 9000));
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newOrder: Order = {
      id: newId,
      customerName: orderData.customerName || 'Direct Customer',
      customerPhone: orderData.customerPhone || '9848012345',
      isNewCustomer: false,
      time: timeStr,
      orderDate: 'Today',
      status: orderData.status || 'OUT_FOR_DELIVERY',
      items:
        orderData.items && orderData.items.length > 0
          ? orderData.items
          : [
              {
                id: `item-${Date.now()}`,
                name: 'Chicken Curry Cut (Fresh)',
                quantity: '1 kg',
                price: 240,
                image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=120&auto=format&fit=crop&q=80',
                checked: true,
              },
            ],
      subtotal: orderData.subtotal || 240,
      deliveryFee: orderData.deliveryFee ?? 0,
      packagingFee: orderData.packagingFee ?? 0,
      total: orderData.total || 240,
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      paymentStatus: orderData.paymentStatus || 'Paid',
      orderType: orderData.orderType || 'Delivery',
      address: orderData.address || {
        street: 'Direct Counter / Local Delivery',
        colony: shopProfile.colony || 'Store Locality',
        city: shopProfile.city || 'Rajahmundry',
        state: 'Andhra Pradesh',
        pincode: shopProfile.pincode || '533101',
      },
      specialInstructions: orderData.specialInstructions || 'Direct manual order delivered directly by retailer.',
      assignedDriverId: orderData.assignedDriverId || 'self_retailer',
      assignedDriverName: orderData.assignedDriverName || `${shopProfile.shopName} (Self Delivery)`,
      assignedDriverPhone: shopProfile.phone || '9876501234',
      ...orderData,
    };

    setOrders((prev) => [newOrder, ...prev]);
    soundManager.playSuccessTone();
    showToast(`Manual Order #${newId} created for direct self delivery!`, 'success');
    return newOrder;
  };

  const markOutForDelivery = async (orderId: string) => {
    updateOrderStatus(orderId, 'OUT_FOR_DELIVERY');
    showToast(`Order #${orderId} is Out for Delivery`, 'info');
  };

  const markOrderDelivered = async (orderId: string) => {
    setIsActionLoading(true);
    setActionLoadingText('Marking Delivered...');
    await new Promise((resolve) => setTimeout(resolve, 350));
    setIsActionLoading(false);
    setActionLoadingText('');

    updateOrderStatus(orderId, 'DELIVERED');
    soundManager.playSuccessTone();
    showToast(`Order #${orderId} Delivered successfully!`, 'success');
  };

  const toggleDriverStatus = (id: string) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === id
          ? {
              ...driver,
              status: driver.status === 'Online' ? 'Offline' : 'Online',
            }
          : driver
      )
    );
    showToast('Driver status toggled', 'info');
  };

  const addDriver = (
    data: string | { name?: string; phone?: string; vehicleType?: Driver['vehicleType']; vehicleNumber?: string; driverId?: string }
  ): boolean => {
    let inputCode = '';
    let customName = '';
    let customPhone = '';
    let customVehicleType: Driver['vehicleType'] = 'Bike';
    let customVehicleNumber = 'AP 05 AB 1234';

    if (typeof data === 'string') {
      inputCode = data.trim();
    } else {
      inputCode = (data.driverId || '').trim();
      customName = data.name || '';
      customPhone = data.phone || '';
      if (data.vehicleType) customVehicleType = data.vehicleType;
      if (data.vehicleNumber) customVehicleNumber = data.vehicleNumber;
    }

    if (!inputCode && !customName) {
      showToast('Please enter a valid Driver ID', 'error');
      return false;
    }

    // Normalize code e.g. "drv-8942" -> "DRV-8942"
    const normalizedCode = inputCode
      ? (inputCode.toUpperCase().startsWith('DRV-') || inputCode.toUpperCase().startsWith('D00')
          ? inputCode.toUpperCase()
          : `DRV-${inputCode.toUpperCase()}`)
      : `D00${drivers.length + 1}`;

    // Check if already in retailer's driver list
    const existingInShop = drivers.find(
      (d) =>
        d.driverCode.toUpperCase() === normalizedCode ||
        d.id.toUpperCase() === normalizedCode ||
        d.driverCode.toUpperCase() === inputCode.toUpperCase()
    );

    if (existingInShop) {
      showToast(`Driver ${existingInShop.name} (${existingInShop.driverCode}) is already in your driver list!`, 'info');
      return false;
    }

    // Registered directory mock mapping
    const REGISTERED_DIRECTORY: Record<
      string,
      { name: string; phone: string; vehicleType: Driver['vehicleType']; vehicleNumber: string; avatar: string }
    > = {
      'DRV-8942': {
        name: 'Ramesh Reddy',
        phone: '9848012345',
        vehicleType: 'Bike',
        vehicleNumber: 'AP 05 AB 1234',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      },
      'DRV-101': {
        name: 'Ramesh Reddy',
        phone: '9848012345',
        vehicleType: 'Bike',
        vehicleNumber: 'AP 05 AB 1234',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      },
      'DRV-102': {
        name: 'Siva Prasad',
        phone: '9848023456',
        vehicleType: 'Bike',
        vehicleNumber: 'AP 05 BC 5678',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      },
      'DRV-103': {
        name: 'Naresh Kumar',
        phone: '9848034567',
        vehicleType: 'Scooter',
        vehicleNumber: 'AP 05 CD 9012',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
      },
      'DRV-104': {
        name: 'Venkata Rao',
        phone: '9848045678',
        vehicleType: 'Bike',
        vehicleNumber: 'AP 05 DE 3456',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      },
      'DRV-105': {
        name: 'Kalyan Chakravarthy',
        phone: '9848056789',
        vehicleType: 'Bike',
        vehicleNumber: 'AP 05 EF 7890',
        avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
      },
      'DRV-201': {
        name: 'Satish Varma',
        phone: '9848067890',
        vehicleType: 'Scooter',
        vehicleNumber: 'AP 05 GH 2345',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
    };

    const matchedProfile = REGISTERED_DIRECTORY[normalizedCode] || REGISTERED_DIRECTORY[inputCode.toUpperCase()];

    const assignedName =
      customName ||
      matchedProfile?.name ||
      (inputCode ? `Driver ${normalizedCode.replace('DRV-', '')}` : `Driver #${drivers.length + 1}`);

    const assignedPhone =
      customPhone ||
      matchedProfile?.phone ||
      `98480${Math.floor(10000 + Math.random() * 90000)}`;

    const assignedVehicleType =
      customVehicleType || matchedProfile?.vehicleType || 'Bike';

    const assignedVehicleNumber =
      customVehicleNumber !== 'AP 05 AB 1234'
        ? customVehicleNumber
        : matchedProfile?.vehicleNumber || `AP 05 ${String.fromCharCode(65 + (drivers.length % 26))}B ${1000 + drivers.length * 111}`;

    const assignedAvatar =
      matchedProfile?.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const newDriver: Driver = {
      id: `d00${drivers.length + 1}`,
      driverCode: normalizedCode,
      name: assignedName,
      phone: assignedPhone,
      avatar: assignedAvatar,
      vehicleNumber: assignedVehicleNumber,
      vehicleType: assignedVehicleType,
      joinedDate: 'Today',
      status: 'Online',
      currentOrder: 'No Active Order',
      totalDeliveries: 0,
      completedDeliveries: 0,
      pendingDeliveries: 0,
      rating: 5.0,
    };

    setDrivers((prev) => [newDriver, ...prev]);
    soundManager.playSuccessTone();
    showToast(`Driver ${newDriver.name} (${newDriver.driverCode}) added!`, 'success');
    setActiveModal('none');
    return true;
  };

  const deleteDriver = (id: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    showToast('Driver removed', 'info');
  };

  const addProduct = async (prodData: Omit<Product, 'id'>) => {
    setIsActionLoading(true);
    setActionLoadingText('Adding Product...');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_id: shopProfile.id,
          name: prodData.name,
          category: prodData.category,
          description: prodData.shortDescription,
          price: prodData.price,
          unit: prodData.priceUnit,
          stock_status: prodData.stockStatus,
          status: prodData.status,
          image: prodData.image,
        })
      });
      if (res.ok) {
        await fetchProducts();
        soundManager.playSuccessTone();
        showToast(`Product "${prodData.name}" saved!`, 'success');
        navigateTo('products');
      }
    } catch (e) {
      showToast('Failed to add product', 'error');
    }
    setIsActionLoading(false);
    setActionLoadingText('');
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setIsActionLoading(true);
    setActionLoadingText('Updating Product...');
    try {
      // Find current product to merge updates
      const current = products.find(p => p.id === id);
      if (!current) throw new Error('Not found');
      
      const merged = { ...current, ...updates };
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: merged.name,
          category: merged.category,
          description: merged.shortDescription,
          price: merged.price,
          unit: merged.priceUnit,
          stock_status: merged.stockStatus,
          status: merged.status,
          image: merged.image,
        })
      });
      if (res.ok) {
        await fetchProducts();
        soundManager.playSuccessTone();
        showToast('Product updated successfully!', 'success');
        navigateTo('products');
      }
    } catch (e) {
      showToast('Failed to update product', 'error');
    }
    setIsActionLoading(false);
    setActionLoadingText('');
  };

  const toggleProductStatus = async (id: string) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    const newStatus = prod.status === 'Active' ? 'Inactive' : 'Active';
    await updateProduct(id, { status: newStatus });
  };

  const deleteProduct = async (id: string) => {
    setIsActionLoading(true);
    setActionLoadingText('Deleting...');
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchProducts();
        showToast('Product removed', 'info');
      }
    } catch(e) {
      showToast('Failed to delete product', 'error');
    }
    setIsActionLoading(false);
    setActionLoadingText('');
  };

  const resetPrototype = () => {
    localStorage.clear();
    setOrders(INITIAL_ORDERS);
    setProducts(INITIAL_PRODUCTS);
    setDrivers(INITIAL_DRIVERS);
    setShopProfile(INITIAL_SHOP_PROFILE);
    setIsShopOpen(true);
    setIsAuthenticated(true);
    setCurrentScreen('dashboard');
    setActiveTabState('dashboard');
    setActiveOrderId('1025');
    showToast('Prototype state reset to original mockup values', 'info');
  };

  // Metrics computation
  const newCount = orders.filter((o) => o.status === 'NEW').length;
  const acceptedCount = orders.filter((o) =>
    ['ACCEPTED', 'PREPARING', 'READY', 'DELIVERY_ASSIGNED', 'OUT_FOR_DELIVERY'].includes(o.status)
  ).length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  const preparingCount = orders.filter((o) => ['PREPARING', 'ACCEPTED'].includes(o.status)).length;
  const assignedCount = orders.filter((o) =>
    ['DELIVERY_ASSIGNED', 'OUT_FOR_DELIVERY'].includes(o.status) || Boolean(o.assignedDriverId && o.status !== 'DELIVERED')
  ).length;
  const rejectedCount = orders.filter((o) => ['REJECTED', 'CANCELLED'].includes(o.status)).length;

  const counts = {
    newOrders: newCount,
    acceptedOrders: acceptedCount,
    deliveredOrders: deliveredCount,
    rejectedOrders: rejectedCount,
    preparing: preparingCount,
    assignedToDriver: assignedCount,
    ready: orders.filter((o) => o.status === 'READY').length,
    outForDelivery: orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length,
    completed: deliveredCount,
    totalProducts: products.length || 24,
    activeProducts: products.filter((p) => p.status === 'Active').length || 20,
    inactiveProducts: products.filter((p) => p.status === 'Inactive').length || 4,
    totalDrivers: drivers.length || 3,
    onlineDrivers: drivers.filter((d) => d.status === 'Online').length || 2,
    offlineDrivers: drivers.filter((d) => d.status === 'Offline').length || 1,
    onDeliveryDrivers: drivers.filter((d) => d.currentOrder && d.currentOrder !== 'No Active Order').length || 1,
    totalSales: 12450,
    totalTodayOrders: 28,
    totalWeightSoldKg: 52.5,
  };

  return (
    <ShopContext.Provider
      value={{
        isAuthenticated,
        shopProfile,
        login,
        logout,
        updateShopProfile,
        isShopOpen,
        toggleShopStatus,
        soundEnabled,
        toggleSound,
        currentScreen,
        activeTab,
        activeOrderId,
        currentOrder,
        navigationHistory,
        setActiveTab,
        setActiveOrderId,
        navigateTo,
        goBack,
        orders,
        ordersFilter,
        setOrdersFilter,
        updateOrderStatus,
        acceptOrder,
        rejectOrder,
        markOrderReady,
        assignDriver,
        assignDeliveryAgent,
        assignManualDelivery,
        createManualOrder,
        markOutForDelivery,
        markOrderDelivered,
        drivers,
        selectedDriverId,
        setSelectedDriverId,
        toggleDriverStatus,
        addDriver,
        deleteDriver,
        products,
        selectedProductCategory,
        setSelectedProductCategory,
        editingProduct,
        setEditingProduct,
        addProduct,
        updateProduct,
        toggleProductStatus,
        deleteProduct,
        activeModal,
        setActiveModal,
        selectedModalDriver,
        setSelectedModalDriver,
        rejectingOrderId,
        setRejectingOrderId,
        counts,
        toast,
        showToast,
        isActionLoading,
        actionLoadingText,
        resetPrototype,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
