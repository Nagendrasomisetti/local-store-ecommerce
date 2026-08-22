import React from 'react';
import {
  Home,
  ClipboardList,
  ShoppingBag,
  Bike,
  MoreHorizontal,
  LogOut,
  Store,
  RotateCcw,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ActiveTab } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    shopProfile,
    logout,
    counts,
    resetPrototype,
  } = useShop();

  const menuItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Orders', icon: ClipboardList, badge: counts.newOrders },
    { id: 'products', label: 'Products', icon: ShoppingBag, badge: counts.totalProducts },
    { id: 'drivers', label: 'Drivers', icon: Bike, badge: counts.onlineDrivers },
    { id: 'more', label: 'Settings', icon: MoreHorizontal },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200/80 h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#582C93] flex items-center justify-center font-bold">
          <Store className="w-6 h-6 stroke-[2]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-gray-900 truncate">
            {shopProfile.shopName}
          </h2>
          <p className="text-xs text-[#6C38CC] font-semibold truncate">
            ID: {shopProfile.shopId}
          </p>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Shop Operations
        </div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#582C93] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                    isActive ? 'bg-white text-[#582C93]' : 'bg-purple-100 text-[#6C38CC]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-100 space-y-1.5">
        <button
          onClick={resetPrototype}
          id="sidebar-reset-btn"
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-[#6C38CC] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
          title="Reset sample orders & flow"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Flow</span>
        </button>

        <button
          onClick={logout}
          id="sidebar-logout-btn"
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout ({shopProfile.shopId})</span>
        </button>
      </div>
    </aside>
  );
};
