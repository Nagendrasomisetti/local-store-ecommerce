import React, { useState } from 'react';
import { useDriver } from '../context/DriverContext';
import { DeliveryOrder } from '../types';
import { ActiveOrderWorkflow } from './ActiveOrderWorkflow';
import { 
  Package, 
  MapPin, 
  Store, 
  User, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  XCircle, 
  Navigation, 
  ChevronRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

export const AvailableOrdersView: React.FC = () => {
  const { 
    orders, 
    currentDriver, 
    activeOrder, 
    activeOrderId, 
    setActiveOrderId, 
    acceptOrder, 
    rejectOrder, 
    isOnline, 
    toggleOnlineStatus,
    simulateNewOrder
  } = useDriver();

  const [orderFilter, setOrderFilter] = useState<'available' | 'active' | 'completed'>('available');
  const [searchQuery, setSearchQuery] = useState('');

  // If a specific active order is being worked on or selected, show its dedicated workflow screen!
  const selectedOrder = orders.find(o => o.delivery_id === activeOrderId);
  if (selectedOrder && selectedOrder.status !== 'REJECTED') {
    return (
      <ActiveOrderWorkflow 
        order={selectedOrder} 
        onBackToDashboard={() => setActiveOrderId(null)} 
      />
    );
  }

  // Filter orders according to tabs
  const availableOrders = orders.filter(o => o.status === 'READY_FOR_PICKUP' && !o.driver_id);
  const myActiveOrders = orders.filter(
    o => o.driver_id === currentDriver?.driver_id && 
    ['ACCEPTED', 'GOING_TO_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status)
  );
  const myCompletedOrders = orders.filter(
    o => o.driver_id === currentDriver?.driver_id && o.status === 'DELIVERED'
  );

  let displayedOrders: DeliveryOrder[] = [];
  if (orderFilter === 'available') {
    displayedOrders = availableOrders;
  } else if (orderFilter === 'active') {
    displayedOrders = myActiveOrders;
  } else {
    displayedOrders = myCompletedOrders;
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedOrders = displayedOrders.filter(
      o => o.order_id.toLowerCase().includes(q) ||
           o.customer_name.toLowerCase().includes(q) ||
           o.shop_name.toLowerCase().includes(q) ||
           o.customer_address.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Delivery Orders
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {isOnline ? 'Real-time order dispatch feed' : 'Driver currently offline'}
          </p>
        </div>
        <button
          onClick={simulateNewOrder}
          className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 border border-blue-200 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>+ Add Order</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setOrderFilter('available')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            orderFilter === 'available'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Available</span>
          {availableOrders.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
              {availableOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setOrderFilter('active')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            orderFilter === 'active'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>In Progress</span>
          {myActiveOrders.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
              {myActiveOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setOrderFilter('completed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            orderFilter === 'completed'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Completed</span>
          <span className="text-[10px] text-slate-400">
            ({myCompletedOrders.length})
          </span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order #, customer, or shop..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">
            {orderFilter === 'available' 
              ? 'No Available Orders' 
              : orderFilter === 'active' 
              ? 'No Active Orders' 
              : 'No Completed Orders Yet'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {orderFilter === 'available'
              ? isOnline 
                ? 'Waiting for new orders from retailers nearby...'
                : 'Please turn ONLINE to receive new orders.'
              : 'Accepted orders in progress will appear here.'}
          </p>
          {orderFilter === 'available' && (
            <div className="mt-3 flex items-center justify-center gap-2">
              {!isOnline && (
                <button
                  onClick={toggleOnlineStatus}
                  className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                >
                  Go Online
                </button>
              )}
              <button
                onClick={simulateNewOrder}
                className="px-3.5 py-2 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold rounded-xl hover:bg-blue-100"
              >
                + Simulate New Order
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedOrders.map((order) => {
            const isAvailable = order.status === 'READY_FOR_PICKUP' && !order.driver_id;
            const isDelivered = order.status === 'DELIVERED';
            const isInProgress = ['ACCEPTED', 'GOING_TO_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.status);

            return (
              <div 
                key={order.delivery_id}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-xs ${
                  isInProgress ? 'border-blue-400 ring-1 ring-blue-400/30' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header: Order ID, Amount, Status */}
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

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900 block">
                      ₹{order.order_amount}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">
                      Earn +₹{order.delivery_earning}
                    </span>
                  </div>
                </div>

                {/* Pickup & Drop off addresses */}
                <div className="py-3 space-y-2.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Pickup:
                    </span>
                    <div className="flex items-start gap-1.5 font-bold text-slate-800">
                      <Store className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <span>{order.shop_name}</span>
                        <p className="text-[11px] text-slate-500 font-normal">{order.shop_address}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Drop:
                    </span>
                    <div className="flex items-start gap-1.5 font-bold text-slate-800">
                      <User className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <span>{order.customer_name}</span>
                        <p className="text-[11px] text-slate-500 font-normal">{order.customer_address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distance & ETA Strip */}
                <div className="flex items-center justify-between text-[11px] font-bold bg-slate-50 px-3 py-2 rounded-xl mb-3">
                  <div className="flex items-center gap-1 text-slate-700">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>Distance: {order.distance}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-700">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Est. Time: {order.estimated_time}</span>
                  </div>
                </div>

                {/* Action Buttons based on order state */}
                {isAvailable && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => acceptOrder(order.delivery_id)}
                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => rejectOrder(order.delivery_id)}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {isInProgress && (
                  <button
                    onClick={() => setActiveOrderId(order.delivery_id)}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>
                      {order.status === 'ACCEPTED' || order.status === 'GOING_TO_PICKUP'
                        ? 'Continue Pickup Navigation →'
                        : 'Continue Customer Delivery →'}
                    </span>
                  </button>
                )}

                {isDelivered && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Delivered
                    </span>
                    <button
                      onClick={() => setActiveOrderId(order.delivery_id)}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                    >
                      <span>View Receipt</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
