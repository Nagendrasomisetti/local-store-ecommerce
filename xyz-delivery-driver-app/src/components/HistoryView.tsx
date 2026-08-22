import React, { useState } from 'react';
import { useDriver } from '../context/DriverContext';
import { DeliveryOrder } from '../types';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Store, 
  User, 
  Calendar, 
  ChevronRight, 
  IndianRupee, 
  X,
  Clock,
  Receipt
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { orders, currentDriver, setActiveOrderId, setActiveTab } = useDriver();
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'REJECTED'>('COMPLETED');
  const [inspectOrder, setInspectOrder] = useState<DeliveryOrder | null>(null);

  if (!currentDriver) return null;

  const driverOrders = orders.filter(
    o => o.driver_id === currentDriver.driver_id || o.status === 'REJECTED' || o.status === 'DELIVERED'
  );

  const filteredOrders = driverOrders.filter(o => {
    if (filter === 'COMPLETED') return o.status === 'DELIVERED';
    if (filter === 'REJECTED') return o.status === 'REJECTED';
    return true;
  });

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Delivery History
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Past deliveries and trip records
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setFilter('COMPLETED')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'COMPLETED' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('REJECTED')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'REJECTED' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Rejected / Cancelled
        </button>
        <button
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'ALL' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All
        </button>
      </div>

      {/* Order list */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs">
          <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No records found</h4>
          <p className="text-xs text-slate-500 mt-1">
            Deliveries completed or rejected will be logged here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredOrders.map((order) => (
            <div
              key={order.delivery_id}
              onClick={() => setInspectOrder(order)}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900">
                    Order {order.order_id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    order.status === 'DELIVERED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {order.status === 'DELIVERED' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Delivered
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Cancelled
                      </>
                    )}
                  </span>
                </div>

                <span className="text-xs font-bold text-slate-700">
                  ₹{order.order_amount}
                </span>
              </div>

              <div className="py-2 space-y-1 text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold">{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{order.shop_name} ({order.shop_branch})</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {order.delivered_at 
                      ? new Date(order.delivered_at).toLocaleDateString() + ' ' + new Date(order.delivered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Today'}
                  </span>
                </div>

                {order.status === 'DELIVERED' && (
                  <span className="text-emerald-600 font-extrabold">
                    Earned +₹{order.delivery_earning}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Order Details Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600">Order Summary</span>
                <h3 className="text-base font-extrabold text-slate-900">Order {inspectOrder.order_id}</h3>
              </div>
              <button
                onClick={() => setInspectOrder(null)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                <p className={`font-extrabold mt-0.5 ${inspectOrder.status === 'DELIVERED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {inspectOrder.status}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pickup Location</span>
                <p className="font-bold text-slate-900">{inspectOrder.shop_name}</p>
                <p className="text-slate-500">{inspectOrder.shop_address}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Drop-off</span>
                <p className="font-bold text-slate-900">{inspectOrder.customer_name}</p>
                <p className="text-slate-500">{inspectOrder.customer_address}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Items Delivered</span>
                <div className="mt-1 space-y-1">
                  {inspectOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between bg-slate-50 p-2 rounded-lg text-slate-800 font-medium">
                      <span>{item.name} ({item.quantity})</span>
                      <span className="font-bold">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Mode:</span>
                  <span className="font-bold text-slate-900">{inspectOrder.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Bill:</span>
                  <span className="font-bold text-slate-900">₹{inspectOrder.order_amount}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold pt-1 border-t border-slate-200">
                  <span>Driver Payout:</span>
                  <span>+₹{inspectOrder.delivery_earning}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setInspectOrder(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
