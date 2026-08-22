import React from 'react';
import { useDriver } from '../context/DriverContext';
import { 
  Wallet, 
  TrendingUp, 
  IndianRupee, 
  CheckCircle2, 
  Calendar, 
  ArrowUpRight, 
  ChevronRight,
  Receipt,
  Coins,
  Sparkles
} from 'lucide-react';

export const EarningsView: React.FC = () => {
  const { currentDriver, stats, orders, setActiveOrderId, setActiveTab } = useDriver();

  if (!currentDriver) return null;

  // Driver's delivered orders list
  const completedOrders = orders.filter(
    o => o.driver_id === currentDriver.driver_id && o.status === 'DELIVERED'
  );

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Top Title */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Driver Earnings
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Daily payouts & cash settlements
        </p>
      </div>

      {/* Main Today's Earnings Card matching Reference UI */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs uppercase tracking-widest font-extrabold text-blue-400 block mb-1">
            Total Today's Earnings
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-extrabold tracking-tight">
              ₹{stats.today_earnings.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
              +{stats.completed_orders} Trips
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-2 font-medium">
            {stats.completed_orders} Completed Deliveries Today
          </p>

          {/* Breakdown Pills matching Image 2 */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-700/80">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Cash Collected</span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                ₹{stats.cash_collected_today.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-400 font-medium">To be settled</span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Trip Pay & Bonus</span>
              <span className="text-base font-extrabold text-emerald-400 mt-0.5 block">
                ₹{stats.today_earnings.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-300 font-medium">Direct Bank Credit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week Overview Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">This Week</span>
            <span className="text-lg font-extrabold text-slate-900">₹{stats.this_week_earnings.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Completed Deliveries</span>
          <span className="text-lg font-extrabold text-blue-600">{stats.completed_orders + 18}</span>
        </div>
      </div>

      {/* TRIP-BY-TRIP EARNINGS LIST (Matching prompt & Image 2) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
            Trip Earnings Breakdown
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            {completedOrders.length} Trips
          </span>
        </div>

        {completedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
            <p className="text-xs text-slate-500">No completed deliveries yet today.</p>
          </div>
        ) : (
          completedOrders.map((order) => (
            <div
              key={order.delivery_id}
              onClick={() => {
                setActiveOrderId(order.delivery_id);
                setActiveTab('orders');
              }}
              className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between hover:border-blue-400 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 font-bold text-xs">
                  {order.order_id}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Order {order.order_id} • {order.customer_name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{order.shop_name}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">Delivered</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex items-center gap-2">
                <div>
                  <span className="text-sm font-extrabold text-emerald-600 block">
                    +₹{order.delivery_earning + (order.tip_earning || 0)}
                  </span>
                  {order.payment_method === 'Cash on Delivery' && (
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
                      COD ₹{order.order_amount}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
