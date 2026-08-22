import React, { useEffect } from 'react';
import { Check, Clock, ArrowRight, Store, MapPin, Sparkles, CheckCircle2, ShieldCheck, PhoneCall, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../types';

interface OrderConfirmedViewProps {
  order: Order;
  onTrackOrder: (orderId: string) => void;
  onContinueShopping: () => void;
}

export const OrderConfirmedView: React.FC<OrderConfirmedViewProps> = ({
  order,
  onTrackOrder,
  onContinueShopping,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#dc2626', '#16a34a', '#f59e0b', '#000000'],
      });
    } catch (e) {
      console.log('Confetti effect executed');
    }
  }, []);

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-5 animate-fade-in">
      {/* Top Success Badge */}
      <div className="text-center space-y-3 pt-2">
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center shadow-xl shadow-emerald-100/50">
            <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Check className="w-7 h-7 stroke-[3.5]" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Placed Successfully
          </span>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight mt-2">
            Order Confirmed!
          </h1>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 leading-relaxed">
            Your fresh meat order has been sent to{' '}
            <span className="font-bold text-neutral-800">{order.shop_name}</span>.
          </p>
        </div>
      </div>

      {/* Order Info & Estimated Delivery Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 space-y-4 text-left">
        {/* Header receipt info */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-neutral-400 block">
              ORDER ID
            </span>
            <div className="text-sm font-black text-neutral-900">{order.order_id}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-black tracking-wider text-neutral-400 block">
              TOTAL AMOUNT
            </span>
            <div className="text-base font-black text-red-600">₹{order.total}</div>
          </div>
        </div>

        {/* Estimated Delivery Highlight */}
        <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Estimated Delivery Time
              </span>
              <span className="text-xs font-black text-neutral-900">
                {order.estimated_delivery_time || '30–45 mins'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
            Express
          </span>
        </div>

        {/* Shop Info */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900">{order.shop_name}</div>
              <div className="text-[10px] text-neutral-400">Payment: {order.payment_method}</div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {order.payment_method === 'Cash on Delivery' ? 'Pay on Delivery' : 'Paid Online'}
          </span>
        </div>

        {/* Items list */}
        <div className="space-y-1.5 pt-2 border-t border-neutral-100">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
            Items Ordered ({order.items.length})
          </span>
          <div className="space-y-1">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-xs text-neutral-700">
                <span className="truncate pr-2">
                  {it.quantity}x {it.product_name} ({it.selected_weight})
                </span>
                <span className="font-bold text-neutral-900">₹{it.unit_price * it.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="pt-2 border-t border-neutral-100 flex items-start gap-2 text-xs text-neutral-600">
          <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-black text-neutral-900">{order.delivery_address.tag}:</span>{' '}
            <span>
              {order.delivery_address.houseFlat}, {order.delivery_address.streetArea}, {order.delivery_address.city}
            </span>
          </div>
        </div>
      </div>

      {/* Live Order Stepper Preview */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 space-y-3 text-left">
        <span className="text-xs font-black uppercase tracking-wider text-neutral-700 block">
          Order Progress
        </span>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-neutral-900">Order Placed & Confirmed</div>
              <div className="text-[10px] text-neutral-400">Received by shop</div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600">Done</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-neutral-900">Shop Preparing Fresh Meat</div>
              <div className="text-[10px] text-neutral-400">Cutting & vacuum packing</div>
            </div>
            <span className="text-[10px] font-bold text-amber-600">In Progress</span>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-3 pt-1">
        <button
          id="btn-track-live-order"
          type="button"
          onClick={() => onTrackOrder(order.id)}
          className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-xl shadow-red-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Track Live Order</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          id="btn-continue-shopping-home"
          type="button"
          onClick={onContinueShopping}
          className="w-full py-3.5 px-6 bg-neutral-100 hover:bg-neutral-200 active:scale-[0.99] text-neutral-800 font-bold text-xs rounded-2xl transition-all cursor-pointer"
        >
          Back to Home
        </button>
      </div>

      {/* Safety Guarantee footer */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 font-medium pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>100% Quality Guaranteed by xyz.com</span>
      </div>
    </div>
  );
};
