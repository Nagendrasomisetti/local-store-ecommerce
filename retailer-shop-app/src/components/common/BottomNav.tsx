import React from 'react';
import { Home, ClipboardList, ShoppingBag, Bike, MoreHorizontal } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ActiveTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useShop();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'drivers', label: 'Drivers', icon: Bike },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav className="w-full bg-white border-t border-gray-100 px-3 pt-2.5 pb-1 shadow-xs shrink-0 z-20">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all cursor-pointer ${
                isActive ? 'text-[#4F1990]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? 'fill-[#4F1990] text-[#4F1990] stroke-[1.5]'
                    : 'text-gray-500 stroke-[1.75]'
                }`}
              />
              <span
                className={`text-[11px] mt-1 tracking-tight ${
                  isActive ? 'font-bold text-[#4F1990]' : 'font-medium text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-32 h-1 bg-black rounded-full mx-auto mt-2 mb-0.5" />
    </nav>
  );
};

