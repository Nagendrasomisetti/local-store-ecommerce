import React from 'react';
import { useDriver } from '../context/DriverContext';
import { Power, Bell, Shield, Bike, RefreshCw, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentDriver, isOnline, toggleOnlineStatus, activeOrder, setActiveTab, simulateNewOrder, resetDemoData } = useDriver();

  if (!currentDriver) return null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        {/* Brand & Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-base tracking-tight shadow-sm">
            XYZ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">XYZ Delivery</span>
              <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                Driver
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 truncate max-w-[120px] sm:max-w-[160px]">
              @{currentDriver.username} • {currentDriver.city}
            </p>
          </div>
        </div>

        {/* Online / Offline Toggle Switch */}
        <div className="flex items-center gap-2">
          {/* Quick Demo Order generator button */}
          <button
            onClick={simulateNewOrder}
            title="Simulate incoming order"
            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="hidden sm:inline text-[11px]">+ New Order</span>
          </button>

          {/* Online Toggle Switch Button */}
          <button
            onClick={toggleOnlineStatus}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
              isOnline
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>
      </div>

      {/* Active Order in-progress banner alert if active */}
      {activeOrder && (
        <div 
          onClick={() => setActiveTab('orders')}
          className="mt-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between cursor-pointer hover:bg-blue-100/70 transition-colors"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <div className="truncate">
              <span className="text-xs font-bold text-blue-900 mr-1.5">
                Active Order {activeOrder.order_id}
              </span>
              <span className="text-[11px] text-blue-700 font-medium">
                {activeOrder.status === 'ACCEPTED' || activeOrder.status === 'GOING_TO_PICKUP'
                  ? `Going to ${activeOrder.shop_name}`
                  : activeOrder.status === 'PICKED_UP'
                  ? 'Picked Up • Ready to Deliver'
                  : `Delivering to ${activeOrder.customer_name}`}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-blue-700 underline shrink-0">
            View Trip →
          </span>
        </div>
      )}
    </header>
  );
};
