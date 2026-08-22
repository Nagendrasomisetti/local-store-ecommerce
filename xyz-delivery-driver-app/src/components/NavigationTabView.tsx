import React from 'react';
import { useDriver } from '../context/DriverContext';
import { InteractiveMap } from './InteractiveMap';
import { ActiveOrderWorkflow } from './ActiveOrderWorkflow';
import { Navigation, Store, User, ArrowRight, Package, Sparkles } from 'lucide-react';

export const NavigationTabView: React.FC = () => {
  const { activeOrder, orders, setActiveOrderId, setActiveTab, simulateNewOrder } = useDriver();

  if (activeOrder) {
    return <ActiveOrderWorkflow order={activeOrder} onBackToDashboard={() => setActiveTab('orders')} />;
  }

  // If no order is currently in-progress, show map of available pickup hubs nearby
  const firstAvailable = orders.find(o => o.status === 'AVAILABLE');

  return (
    <div className="space-y-4 pb-20 pt-1">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Delivery Route Navigation
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Live GPS route view and pickup points
        </p>
      </div>

      {firstAvailable ? (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-700">Recommended Next Delivery</span>
              <h3 className="text-xs font-bold text-slate-900 mt-0.5">Order {firstAvailable.order_id} ({firstAvailable.shop_name})</h3>
              <p className="text-[11px] text-slate-600">Pickup: {firstAvailable.shop_address}</p>
            </div>
            <button
              onClick={() => {
                setActiveOrderId(firstAvailable.delivery_id);
                setActiveTab('orders');
              }}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl shrink-0"
            >
              View Order →
            </button>
          </div>

          <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs">
            <InteractiveMap order={firstAvailable} currentPhase="pickup" />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs">
          <Navigation className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Active Trip in Progress</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Accept a new delivery from the Orders or Home tab to begin turn-by-turn route navigation.
          </p>
          <button
            onClick={() => setActiveTab('orders')}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
          >
            Check Available Orders
          </button>
        </div>
      )}
    </div>
  );
};
