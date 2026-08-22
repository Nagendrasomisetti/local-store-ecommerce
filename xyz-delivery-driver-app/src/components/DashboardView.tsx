import React from 'react';
import { useDriver } from '../context/DriverContext';
import { DeliveryOrder } from '../types';
import { 
  Bike, 
  MapPin, 
  Store, 
  User, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  Power, 
  ChevronRight,
  TrendingUp,
  Package,
  Navigation,
  Sparkles,
  Phone
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    currentDriver, 
    isOnline, 
    toggleOnlineStatus, 
    stats, 
    orders, 
    activeOrder, 
    acceptOrder, 
    rejectOrder, 
    openOrderDetails, 
    openNavigationForOrder,
    setActiveTab,
    simulateNewOrder
  } = useDriver();

  if (!currentDriver) return null;

  // Filter available new deliveries
  const availableOrders = orders.filter(o => o.status === 'AVAILABLE');
  // Driver's active/completed orders for today
  const myCompletedToday = orders.filter(o => o.driver_id === currentDriver.driver_id && o.status === 'DELIVERED');

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Welcome & Driver Info Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-blue-600 overflow-hidden flex items-center justify-center text-slate-700 font-bold text-lg">
                {currentDriver.avatar_url ? (
                  <img src={currentDriver.avatar_url} alt={currentDriver.full_name} className="w-full h-full object-cover" />
                ) : (
                  currentDriver.full_name.charAt(0)
                )}
              </div>
              <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                  Welcome, {currentDriver.full_name}
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                @{currentDriver.username} • {currentDriver.vehicle_type} ({currentDriver.vehicle_number})
              </p>
            </div>
          </div>

          {/* Online / Offline status badge */}
          <div className="text-right">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
              isOnline ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </span>
          </div>
        </div>

        {/* Offline Warning Banner with Action */}
        {!isOnline && (
          <div className="mt-3.5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 font-medium">
                You are currently OFFLINE and cannot receive delivery requests.
              </p>
            </div>
            <button
              onClick={toggleOnlineStatus}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shrink-0 shadow-xs cursor-pointer"
            >
              Go Online
            </button>
          </div>
        )}
      </div>

      {/* Top 3 Stat Pills matching Reference UI (Pending, Out for Delivery, Completed) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white rounded-2xl p-3 border border-slate-200 text-center shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-tight block">
            Available
          </span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
            {availableOrders.length}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-200 text-center shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-tight block">
            In Progress
          </span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
            {activeOrder ? '1' : '0'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-200 text-center shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-tight block">
            Completed
          </span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
            {stats.completed_orders}
          </span>
        </div>
      </div>

      {/* Today's Earnings Summary Card matching Reference UI */}
      <div 
        onClick={() => setActiveTab('earnings')}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 text-white shadow-md cursor-pointer hover:shadow-lg transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
              Today's Earnings
            </span>
            <h3 className="text-2xl font-extrabold tracking-tight mt-0.5 flex items-center">
              ₹{stats.today_earnings.toLocaleString()}
            </h3>
            <p className="text-xs text-blue-100 font-medium mt-1">
              {stats.completed_orders} Deliveries Completed Today
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold transition-colors">
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Active Order In-Progress Card (If any) */}
      {activeOrder && (
        <div className="bg-white rounded-2xl p-4 border-2 border-blue-500 shadow-md">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-extrabold text-blue-600 uppercase bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Active Delivery • {activeOrder.order_id}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {activeOrder.status === 'ACCEPTED' || activeOrder.status === 'GOING_TO_PICKUP' 
                ? 'Going to Pickup' 
                : activeOrder.status === 'PICKED_UP'
                ? 'Order Picked Up'
                : 'Out for Delivery'}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-start gap-2">
              <Store className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">{activeOrder.shop_name}</p>
                <p className="text-[11px] text-slate-500 truncate max-w-[260px]">{activeOrder.shop_address}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">{activeOrder.customer_name}</p>
                <p className="text-[11px] text-slate-500 truncate max-w-[260px]">{activeOrder.customer_address}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Continue Order Workflow →</span>
          </button>
        </div>
      )}

      {/* NEW DELIVERIES SECTION */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              New Deliveries
            </h3>
            {isOnline && availableOrders.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {isOnline ? `${availableOrders.length} Available` : 'Offline'}
          </span>
        </div>

        {!isOnline ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
              <Power className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">You are Offline</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Switch your status to ONLINE using the top button to start receiving delivery requests in your area.
            </p>
            <button
              onClick={toggleOnlineStatus}
              className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Go Online Now
            </button>
          </div>
        ) : availableOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No New Orders Right Now</h4>
            <p className="text-xs text-slate-500 mt-1">
              You are Online and in queue. New delivery alerts will ring here automatically!
            </p>
            <button
              onClick={simulateNewOrder}
              className="mt-3 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-xl border border-blue-200 inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Incoming Order</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {availableOrders.map((order) => (
              <div 
                key={order.delivery_id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 transition-all"
              >
                {/* Header: Order ID & Distance */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      Order {order.order_id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.payment_method === 'Cash on Delivery' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {order.payment_method}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>{order.distance}</span>
                  </div>
                </div>

                {/* Pickup & Drop Details matching reference */}
                <div className="py-2.5 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Pickup:
                    </span>
                    <div className="flex items-start gap-1.5 font-bold text-slate-800">
                      <Store className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span>{order.shop_name} ({order.shop_branch})</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Drop:
                    </span>
                    <div className="flex items-start gap-1.5 font-bold text-slate-800">
                      <User className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{order.customer_name} • {order.customer_address}</span>
                    </div>
                  </div>
                </div>

                {/* Amount & Earning Strip */}
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-600 block">Order Bill</span>
                    <span className="text-sm font-extrabold text-slate-900">₹{order.order_amount}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">Your Earning</span>
                    <span className="text-sm font-extrabold text-emerald-600">+₹{order.delivery_earning}</span>
                  </div>
                </div>

                {/* Action Buttons: Accept & Reject matching prompt */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => acceptOrder(order.delivery_id)}
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept</span>
                  </button>

                  <button
                    onClick={() => rejectOrder(order.delivery_id)}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
