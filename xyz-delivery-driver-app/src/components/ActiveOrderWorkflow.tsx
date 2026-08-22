import React, { useState } from 'react';
import { useDriver } from '../context/DriverContext';
import { DeliveryOrder } from '../types';
import { InteractiveMap } from './InteractiveMap';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Store, 
  User, 
  Phone, 
  Navigation, 
  MapPin, 
  Clock, 
  IndianRupee, 
  PackageCheck, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  Camera,
  CheckSquare,
  Square,
  AlertCircle,
  TrendingUp,
  Receipt
} from 'lucide-react';

interface ActiveOrderWorkflowProps {
  order: DeliveryOrder;
  onBackToDashboard?: () => void;
}

export const ActiveOrderWorkflow: React.FC<ActiveOrderWorkflowProps> = ({ order, onBackToDashboard }) => {
  const { 
    markAsGoingToPickup, 
    markAsPickedUp, 
    markAsOutForDelivery, 
    confirmPaymentCollected, 
    markAsDelivered,
    setCallingContact,
    setActiveTab,
    setActiveOrderId
  } = useDriver();

  // Checklist states for pickup verification
  const [itemsChecked, setItemsChecked] = useState<{ [key: string]: boolean }>({});
  const [packageSealed, setPackageSealed] = useState(true);
  const [proofNote, setProofNote] = useState('');
  const [codReceived, setCodReceived] = useState(order.cash_collected || false);
  const [deliveryStep, setDeliveryStep] = useState<'details' | 'nav_pickup' | 'nav_dropoff' | 'confirm_pickup' | 'confirm_delivery'>('details');

  // Trigger celebration confetti on completion
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const isAllItemsChecked = order.items.length === 0 || order.items.every(i => itemsChecked[i.id]);

  // ==========================================
  // VIEW 1: COMPLETED SUCCESS SCREEN (Section 9)
  // ==========================================
  if (order.status === 'DELIVERED') {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg text-center space-y-5 animate-fade-in my-2">
        {/* Green Check Illustration */}
        <div className="relative inline-block mx-auto mt-2">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500/30 flex items-center justify-center text-emerald-600 shadow-lg">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 block mb-1">
            Order Completed
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            ✓ Delivered Successfully
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Order <span className="font-bold text-slate-800">{order.order_id}</span> has been handed over to <span className="font-bold text-slate-800">{order.customer_name}</span>.
          </p>
        </div>

        {/* Financial Earnings Card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-600">Trip Earnings</span>
              <p className="text-xs text-slate-500">Base delivery pay + bonus</p>
            </div>
            <span className="text-xl font-extrabold text-emerald-600">
              +₹{order.delivery_earning + (order.tip_earning || 0)}
            </span>
          </div>

          {order.payment_method === 'Cash on Delivery' && (
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-600">Cash Collected</span>
                <p className="text-xs text-slate-500">Customer Bill Handover</p>
              </div>
              <span className="text-base font-extrabold text-slate-900">
                ₹{order.order_amount}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <span>Delivered at:</span>
            <span className="font-semibold text-slate-700">
              {order.delivered_at ? new Date(order.delivered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              setActiveOrderId(null);
              setActiveTab('home');
            }}
            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            Back to Home
          </button>
          <button
            onClick={() => {
              setActiveOrderId(null);
              setActiveTab('earnings');
            }}
            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            View Earnings
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: ACCEPTED / GOING TO PICKUP & PICKUP STAGES (Sections 4, 5, 6)
  // =========================================================================
  if (order.status === 'ACCEPTED' || order.status === 'GOING_TO_PICKUP') {
    return (
      <div className="space-y-4 pb-20">
        {/* Navigation & Header Strip */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Orders List</span>
          </button>

          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Going to Pickup
          </span>
        </div>

        {/* Order Title Header */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-extrabold text-slate-900">
              Order {order.order_id}
            </h2>
            <span className="text-xs font-bold text-slate-500">
              Est. Arrival: 4 min
            </span>
          </div>

          {/* Sequential Timeline Indicator */}
          <div className="flex items-center gap-2 text-[11px] font-bold pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1 text-blue-600">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
              Pickup Shop
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">2</span>
              Customer Drop
            </span>
          </div>
        </div>

        {/* Interactive Route Navigation Map to Shop */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs">
          <InteractiveMap order={order} currentPhase="pickup" />
        </div>

        {/* Pickup Shop Details Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600">Pickup Location</span>
                <h3 className="text-sm font-extrabold text-slate-900">{order.shop_name}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{order.shop_address}</p>
                <span className="text-[11px] font-semibold text-slate-500 mt-1 inline-block">
                  Branch: {order.shop_branch} • 450m away
                </span>
              </div>
            </div>
          </div>

          {/* Quick Call Shop Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => setCallingContact({ name: order.shop_name, phone: order.shop_phone, role: 'Shop' })}
              className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Call Shop</span>
            </button>
          </div>
        </div>

        {/* Customer Preview Info */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Destination:</span>
              <span className="font-bold text-slate-800">{order.customer_name} ({order.customer_address})</span>
            </div>
          </div>
          <span className="font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md shrink-0">
            {order.distance}
          </span>
        </div>

        {/* Order Items to Pick Up */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block mb-2">
            Items to Collect ({order.items.length})
          </span>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs font-semibold">
                <span className="text-slate-800">{item.name}</span>
                <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-bold">{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Action Button: Mark as Picked Up */}
        <div className="pt-2">
          <button
            onClick={() => {
              markAsPickedUp(order.delivery_id);
              markAsOutForDelivery(order.delivery_id);
            }}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PackageCheck className="w-5 h-5" />
            <span>I Have Picked Up the Order</span>
          </button>
          <p className="text-[11px] text-center text-slate-500 mt-2">
            Tap once you have received and verified the packaged order at the shop.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: OUT FOR DELIVERY & CUSTOMER DROP-OFF (Sections 7, 8)
  // =========================================================================
  return (
    <div className="space-y-4 pb-20">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Orders List</span>
        </button>

        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          Out for Delivery
        </span>
      </div>

      {/* Order Title Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-extrabold text-slate-900">
            Order {order.order_id}
          </h2>
          <span className="text-xs font-bold text-emerald-600">
            ETA: {order.estimated_time}
          </span>
        </div>

        {/* Sequential Timeline Indicator */}
        <div className="flex items-center gap-2 text-[11px] font-bold pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Shop Picked Up
          </span>
          <span className="text-slate-300">→</span>
          <span className="flex items-center gap-1 text-blue-600 font-extrabold">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
            Delivering to Customer
          </span>
        </div>
      </div>

      {/* Interactive Map from Shop to Customer */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs">
        <InteractiveMap order={order} currentPhase="dropoff" />
      </div>

      {/* Customer Information Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-600">Customer Delivery</span>
              <h3 className="text-sm font-extrabold text-slate-900">{order.customer_name}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{order.customer_address}</p>
              {order.customer_notes && (
                <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200/70 text-[11px] text-amber-900 font-medium">
                  <span className="font-bold">Note: </span>{order.customer_notes}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call Customer Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => setCallingContact({ name: order.customer_name, phone: order.customer_phone, role: 'Customer' })}
            className="flex-1 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Call Customer ({order.customer_phone})</span>
          </button>
        </div>
      </div>

      {/* PAYMENT & BILL CONFIRMATION (Section 8) */}
      <div className={`rounded-2xl p-4 border transition-all ${
        order.payment_method === 'Cash on Delivery'
          ? 'bg-amber-50/70 border-amber-200'
          : 'bg-emerald-50/70 border-emerald-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Receipt className="w-4 h-4" />
            Payment Status
          </span>
          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
            order.payment_method === 'Cash on Delivery'
              ? 'bg-amber-200 text-amber-900'
              : 'bg-emerald-200 text-emerald-900'
          }`}>
            {order.payment_method}
          </span>
        </div>

        {order.payment_method === 'Cash on Delivery' ? (
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase block">Amount to Collect</span>
                <span className="text-2xl font-extrabold text-slate-900">₹{order.order_amount}</span>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setCodReceived(!codReceived);
                  confirmPaymentCollected(order.delivery_id);
                }}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  codReceived
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{codReceived ? '✓ ₹' + order.order_amount + ' Collected' : 'Confirm ₹' + order.order_amount + ' Collected'}</span>
              </button>
            </div>
            {!codReceived && (
              <p className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>Please collect ₹{order.order_amount} in cash before handing over the parcel.</span>
              </p>
            )}
          </div>
        ) : (
          <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase block">Paid Online</span>
              <span className="text-lg font-extrabold text-emerald-700">₹{order.order_amount} (Prepaid)</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              No Cash Collection Needed
            </span>
          </div>
        )}
      </div>

      {/* FINAL PRIMARY ACTION: Mark as Delivered */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (order.payment_method === 'Cash on Delivery' && !codReceived) {
              setCodReceived(true);
              confirmPaymentCollected(order.delivery_id);
            }
            markAsDelivered(order.delivery_id);
            triggerConfetti();
          }}
          className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-base font-extrabold rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Mark as Delivered</span>
        </button>
        <p className="text-[11px] text-center text-slate-500 mt-2">
          Completing delivery will credit <span className="font-bold text-emerald-600">+₹{order.delivery_earning}</span> to your earnings.
        </p>
      </div>
    </div>
  );
};
