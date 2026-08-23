import React, { useState } from 'react';
import {
  Menu,
  Bell,
  ChevronDown,
  ShoppingBag,
  Clock,
  Bike,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  Store,
  Calendar,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const DashboardScreen: React.FC = () => {
  const {
    isShopOpen,
    toggleShopStatus,
    navigateTo,
    setOrdersFilter,
    counts,
    shopProfile,
  } = useShop();

  const [dateRange, setDateRange] = useState('Today');
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStoreDrawer, setShowStoreDrawer] = useState(false);

  // Itemized sold weight & sales breakdown details
  const soldWeightItems = [
    {
      id: 'sw-1',
      name: 'Chicken Wings',
      weightKg: 45,
      pricePerKg: 120,
      total: 5400,
    },
    {
      id: 'sw-2',
      name: 'Chicken Boneless',
      weightKg: 76,
      pricePerKg: 300,
      total: 22800,
    },
    {
      id: 'sw-3',
      name: 'Chicken Curry Cut',
      weightKg: 35,
      pricePerKg: 240,
      total: 8400,
    },
    {
      id: 'sw-4',
      name: 'Chicken Drumstick',
      weightKg: 22,
      pricePerKg: 290,
      total: 6380,
    },
    {
      id: 'sw-5',
      name: 'Country Chicken (Natu Kodi)',
      weightKg: 18,
      pricePerKg: 480,
      total: 8640,
    },
    {
      id: 'sw-6',
      name: 'Chicken Keema (Minced)',
      weightKg: 14,
      pricePerKg: 340,
      total: 4760,
    },
  ];

  const totalWeightAll = soldWeightItems.reduce((acc, item) => acc + item.weightKg, 0);
  const totalSalesAll = soldWeightItems.reduce((acc, item) => acc + item.total, 0);

  const handleCardClick = (filter: string) => {
    setOrdersFilter(filter);
    navigateTo('orders');
  };

  const handleOrderClick = (orderId: string) => {
    navigateTo('order_info', orderId);
  };

  return (
    <div className="min-h-full bg-[#F7F5FD] flex flex-col font-sans select-none pb-4">
      {/* Top Header */}
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-20 bg-[#F7F5FD]/95 backdrop-blur-xs">
        <button
          type="button"
          onClick={() => setShowStoreDrawer(true)}
          className="p-1 text-gray-900 hover:text-gray-700 rounded-lg cursor-pointer"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 stroke-[2]" />
        </button>

        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard</h1>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1 text-gray-900 hover:text-gray-700 rounded-lg cursor-pointer relative"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6 stroke-[2]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-[#F7F5FD]" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-30 space-y-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold text-gray-900">Notifications</span>
                <span className="text-[10px] text-[#4F1990] font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div
                onClick={() => {
                  setShowNotifications(false);
                  navigateTo('order_info', '1025');
                }}
                className="p-2 bg-purple-50 rounded-xl cursor-pointer hover:bg-purple-100/70 transition-colors"
              >
                <p className="text-xs font-bold text-[#4F1990]">🔔 New Order #1025</p>
                <p className="text-[11px] text-gray-600">Rahul Kumar ordered 2 Items (₹590)</p>
                <p className="text-[9px] text-gray-400 mt-0.5">2 mins ago</p>
              </div>
              <div
                onClick={() => {
                  setShowNotifications(false);
                  navigateTo('drivers');
                }}
                className="p-2 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <p className="text-xs font-bold text-gray-800">🛵 Driver Online</p>
                <p className="text-[11px] text-gray-600">Ravi Kumar is ready for deliveries</p>
                <p className="text-[9px] text-gray-400 mt-0.5">15 mins ago</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Scrollable Area */}
      <main className="px-4 pb-4 space-y-3.5 flex-1">
        {/* Store Info & Status Card */}
        <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Cartoon Rooster Avatar */}
            <div className="w-12 h-12 rounded-full bg-[#E53935] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              <svg viewBox="0 0 100 100" className="w-9 h-9">
                {/* Rooster Body */}
                <ellipse cx="50" cy="55" rx="30" ry="26" fill="#FFFFFF" />
                {/* Wing */}
                <path d="M 45 45 Q 65 52 55 70 Q 40 65 45 45 Z" fill="#F0F0F0" stroke="#E0E0E0" strokeWidth="1" />
                {/* Head */}
                <circle cx="58" cy="36" r="15" fill="#FFFFFF" />
                {/* Red Comb */}
                <path d="M 52 24 C 54 18, 59 18, 60 23 C 62 17, 67 17, 68 23 C 71 18, 76 20, 74 27 Z" fill="#D32F2F" />
                {/* Eye */}
                <circle cx="63" cy="34" r="2.5" fill="#212121" />
                <circle cx="64" cy="33" r="0.8" fill="#FFFFFF" />
                {/* Beak */}
                <polygon points="71,36 82,41 71,46" fill="#FFB300" />
                {/* Wattle */}
                <path d="M 68 45 C 72 48, 70 55, 66 53 Z" fill="#D32F2F" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight leading-tight">
                {shopProfile.shopName || 'Sun Chicken'}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isShopOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="text-xs font-medium text-gray-500">
                  {isShopOpen ? 'Store is Open' : 'Store is Closed'}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Button Dropdown */}
          <button
            type="button"
            onClick={toggleShopStatus}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isShopOpen
                ? 'bg-[#E8F8EE] text-[#16A34A] border border-[#DCFCE7] hover:bg-[#DCFCE7]'
                : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
            }`}
          >
            <span>{isShopOpen ? 'Open' : 'Closed'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Status Metric Cards */}
        <div className="grid grid-cols-4 gap-2">
          {/* New Order */}
          <div
            id="status-card-new"
            onClick={() => handleCardClick('New')}
            className="bg-[#F4F0FD] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between cursor-pointer border border-purple-100/70 hover:border-purple-300 transition-all active:scale-[0.97] shadow-2xs group"
          >
            <div className="w-5 h-5 flex items-center justify-start">
              <ShoppingBag className="w-4.5 h-4.5 text-[#4F1990] stroke-[1.8] group-hover:scale-105 transition-transform" />
            </div>
            <div className="mt-2">
              <span className="text-[10px] sm:text-xs font-semibold text-[#4F1990] block leading-tight min-h-[24px]">
                New Order
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#4F1990] mt-1 block leading-none">
                {counts.newOrders || 4}
              </span>
            </div>
          </div>

          {/* Preparing */}
          <div
            id="status-card-preparing"
            onClick={() => handleCardClick('Preparing')}
            className="bg-[#FFF6EB] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between cursor-pointer border border-orange-100/70 hover:border-orange-300 transition-all active:scale-[0.97] shadow-2xs group"
          >
            <div className="w-5 h-5 flex items-center justify-start">
              <Clock className="w-4.5 h-4.5 text-[#D97706] stroke-[1.8] group-hover:scale-105 transition-transform" />
            </div>
            <div className="mt-2">
              <span className="text-[10px] sm:text-xs font-semibold text-[#D97706] block leading-tight min-h-[24px]">
                Preparing
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#D97706] mt-1 block leading-none">
                {counts.preparing || 3}
              </span>
            </div>
          </div>

          {/* Assigned to Driver */}
          <div
            id="status-card-assigned"
            onClick={() => handleCardClick('Assigned')}
            className="bg-[#EEF4FF] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between cursor-pointer border border-blue-100/70 hover:border-blue-300 transition-all active:scale-[0.97] shadow-2xs group"
          >
            <div className="w-5 h-5 flex items-center justify-start">
              <Bike className="w-4.5 h-4.5 text-[#2563EB] stroke-[1.8] group-hover:scale-105 transition-transform" />
            </div>
            <div className="mt-2">
              <span className="text-[10px] sm:text-xs font-semibold text-[#2563EB] block leading-tight min-h-[24px]">
                Assigned to Driver
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#2563EB] mt-1 block leading-none">
                {counts.assignedToDriver || 2}
              </span>
            </div>
          </div>

          {/* Delivered */}
          <div
            id="status-card-delivered"
            onClick={() => handleCardClick('Delivered')}
            className="bg-[#E8F8EE] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between cursor-pointer border border-emerald-100/70 hover:border-emerald-300 transition-all active:scale-[0.97] shadow-2xs group"
          >
            <div className="w-5 h-5 flex items-center justify-start">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#16A34A] stroke-[1.8] group-hover:scale-105 transition-transform" />
            </div>
            <div className="mt-2">
              <span className="text-[10px] sm:text-xs font-semibold text-[#16A34A] block leading-tight min-h-[24px]">
                Delivered
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#16A34A] mt-1 block leading-none">
                {counts.deliveredOrders || 2}
              </span>
            </div>
          </div>
        </div>

        {/* Today's Summary Card */}
        <section className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Today's Summary</h3>
            <button
              type="button"
              onClick={() => setShowDetailsModal(true)}
              className="text-xs font-semibold text-[#4F1990] hover:underline cursor-pointer"
            >
              View details
            </button>
          </div>

          {/* Summary Metrics Row */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 text-center py-1">
            <div className="px-2">
              <p className="text-xs font-medium text-gray-500">Total Weight Sold</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {dateRange === 'Today' ? '52.5 kg' : `${totalWeightAll} kg`}
              </p>
            </div>
            <div className="px-2">
              <p className="text-xs font-medium text-gray-500">Total Sales</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {dateRange === 'Today' ? '₹12,450' : `₹${totalSalesAll.toLocaleString('en-IN')}`}
              </p>
            </div>
          </div>

          {/* Trend & Filter */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>18% vs yesterday</span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDateMenu(!showDateMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-gray-600" />
                <span>{dateRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {showDateMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                  {['Today', 'Yesterday', 'This Week', 'This Month'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setDateRange(range);
                        setShowDateMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-purple-50 hover:text-[#4F1990]"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recent Orders Card */}
        <section className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Recent Orders</h3>
            <button
              type="button"
              onClick={() => navigateTo('orders')}
              className="text-xs font-semibold text-[#4F1990] hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Order #1025 - Rahul */}
            <div
              id="recent-order-1025"
              onClick={() => handleOrderClick('1025')}
              className="bg-white border border-gray-100 hover:border-purple-200 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all duration-150 active:scale-[0.99]"
            >
              <div className="flex items-start gap-4">
                <span className="text-sm font-black text-gray-900 mt-0.5">#1025</span>
                <div>
                  <span className="text-sm font-bold text-gray-900 block">Rahul</span>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">10:30 AM • 2 Items</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FEF3E8] text-[#D97706] text-[10px] font-bold inline-block">
                    Preparing
                  </span>
                  <p className="text-sm font-black text-gray-900 mt-0.5">₹590</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </div>
            </div>

            {/* Order #1026 - Priya */}
            <div
              id="recent-order-1026"
              onClick={() => handleOrderClick('1026')}
              className="bg-white border border-gray-100 hover:border-purple-200 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all duration-150 active:scale-[0.99]"
            >
              <div className="flex items-start gap-4">
                <span className="text-sm font-black text-gray-900 mt-0.5">#1026</span>
                <div>
                  <span className="text-sm font-bold text-gray-900 block">Priya</span>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">09:50 AM • 3 Items</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold inline-block">
                    Ready
                  </span>
                  <p className="text-sm font-black text-gray-900 mt-0.5">₹710</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Summary Details Modal - Itemized Weight & Sales Breakdown */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Weight & Sales Breakdown</h3>
                <p className="text-[11px] text-gray-400 font-medium">{dateRange} • Itemized product sales</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#F4F0FD] rounded-2xl border border-purple-100/60 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700 block">Total Weight Sold</span>
                <span className="text-lg font-black text-[#4F1990]">{totalWeightAll} kg</span>
              </div>
              <div className="border-l border-purple-200/60">
                <span className="text-[10px] uppercase font-bold text-purple-700 block">Total Revenue</span>
                <span className="text-lg font-black text-[#4F1990]">₹{totalSalesAll.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Itemized Sold Products List */}
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 text-xs">
              {soldWeightItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#FBF9FE] rounded-2xl border border-purple-100/70 hover:border-purple-200 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-xs">{item.name}</span>
                    <span className="font-black text-[#4F1990] text-xs">
                      ₹{item.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Formula format: item name - Xkgs * price = total */}
                  <div className="text-[11px] font-medium text-gray-700 bg-white px-2.5 py-1.5 rounded-xl border border-purple-50 flex items-center justify-between font-mono">
                    <span className="truncate mr-2">
                      {item.name.toLowerCase()} - {item.weightKg}kgs * ₹{item.pricePerKg}
                    </span>
                    <span className="font-bold text-[#4F1990] shrink-0">
                      = ₹{item.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="w-full py-3 bg-[#4F1990] hover:bg-[#3E1372] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Drawer */}
      {showStoreDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex">
          <div className="bg-white w-72 h-full shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#4F1990]" />
                  <span className="font-black text-gray-900">Sun Chicken</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStoreDrawer(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                {[
                  { label: 'Dashboard', screen: 'dashboard' as const },
                  { label: 'Live Orders', screen: 'orders' as const },
                  { label: 'Product Catalog', screen: 'products' as const },
                  { label: 'Delivery Fleet', screen: 'drivers' as const },
                  { label: 'Shop Settings', screen: 'more' as const },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setShowStoreDrawer(false);
                      navigateTo(item.screen);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-[#4F1990] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 text-center">
              Shop ID: CS123456 • v1.0.0
            </div>
          </div>
          <div className="flex-1" onClick={() => setShowStoreDrawer(false)} />
        </div>
      )}
    </div>
  );
};

