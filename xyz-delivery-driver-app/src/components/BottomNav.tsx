import React from 'react';
import { useDriver, AppTab } from '../context/DriverContext';
import { Home, PackageCheck, Navigation, Wallet, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, orders, activeOrder, currentDriver } = useDriver();

  if (!currentDriver) return null;

  const availableCount = orders.filter(o => o.status === 'AVAILABLE').length;
  const hasActiveTrip = !!activeOrder;

  const navItems: { id: AppTab; label: string; icon: React.FC<{ className?: string }>; badge?: number | string; badgeColor?: string }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: PackageCheck,
      badge: availableCount > 0 ? availableCount : undefined,
      badgeColor: 'bg-blue-600',
    },
    {
      id: 'navigation',
      label: 'Map/Trip',
      icon: Navigation,
      badge: hasActiveTrip ? 'LIVE' : undefined,
      badgeColor: 'bg-emerald-600 text-[9px]',
    },
    {
      id: 'earnings',
      label: 'Earnings',
      icon: Wallet,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-lg max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold text-white flex items-center justify-center shadow-xs ${
                      item.badgeColor || 'bg-rose-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
