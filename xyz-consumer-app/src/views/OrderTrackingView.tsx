import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, Clock, Store, MapPin, CheckCircle2, ChevronDown, ChevronUp, Sparkles, RefreshCw, ShoppingBag, Heart } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { StatusStepper } from '../components/StatusStepper';
import { useAuth } from '../context/AuthContext';

interface OrderTrackingViewProps {
  orderId: string;
  onBack: () => void;
  onOrderAgain?: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orderId,
  onBack,
  onOrderAgain,
}) => {
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  useEffect(() => {
    if (!user?.id) return;
    const sse = new EventSource(`/api/events?role=CONSUMER&userId=${user.id}`);
    sse.onmessage = () => {
      loadOrder();
    };
    return () => sse.close();
  }, [user?.id, orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const res = await api.getOrder(orderId);
      setOrder(res);
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceStatus = async () => {
    if (!order) return;
    try {
      setAdvancing(true);
      const updated = await api.advanceOrderStatus(order.id);
      setOrder(updated);
    } catch (err) {
      console.error('Failed to advance status:', err);
    } finally {
      setAdvancing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center max-w-md mx-auto space-y-4 pt-12">
        <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-neutral-500">Loading order tracking details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center max-w-md mx-auto space-y-4 pt-12">
        <p className="text-xs text-neutral-600">Order not found</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isDelivered = order.status === 'Delivered';

  return (
    <div className="pb-32 px-4 pt-3 max-w-md mx-auto space-y-4 animate-fade-in">
      {/* Top Header matching reference designs #6 & #7 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            id="btn-track-back"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-black text-neutral-900 tracking-tight">
              Order {order.order_id}
            </h1>
            <span className="text-[10px] text-neutral-400 font-medium">
              Placed {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <a
          href={`tel:+919876543210`}
          className="text-xs font-bold text-neutral-600 hover:text-neutral-900 px-3 py-1 bg-neutral-100 rounded-full"
        >
          Help
        </a>
      </div>

      {/* Delivered State Graphic matching Reference Design #7 */}
      {isDelivered ? (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/80 text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              Delivered!
            </h2>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 leading-relaxed">
              Your order has been delivered fresh to your address. We hope you enjoy your meal!
            </p>
          </div>

          <div className="pt-2">
            <span className="text-xs font-bold text-neutral-600 block mb-2">
              Rate your experience
            </span>
            <div className="flex items-center justify-center gap-2 text-amber-400">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className="p-1 text-2xl hover:scale-125 transition-transform"
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Active Status Pill matching Reference Design #6 */
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-800">
              {order.status === 'Order Placed' && 'Order confirmed by xyz.com'}
              {order.status === 'Shop Accepted' && 'Shop accepted your order'}
              {order.status === 'Preparing' && 'Preparing your fresh cuts'}
              {order.status === 'Packed' && 'Order packed and sealed'}
              {order.status === 'Out for Delivery' && 'Out for delivery to you'}
            </span>
          </div>

          <span className="text-[10px] font-bold bg-white text-emerald-700 px-2 py-0.5 rounded-md shadow-xs">
            Live
          </span>
        </div>
      )}

      {/* Progress Timeline Stepper */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/80">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-3">
          Order Progress
        </h3>
        <StatusStepper currentStatus={order.status} history={order.status_history} />
      </div>

      {/* Testing Simulation Tool for reviewer */}
      {!isDelivered && (
        <div className="p-3 bg-neutral-900 text-white rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div>
              <span className="font-bold block">Status Simulation</span>
              <span className="text-[10px] text-neutral-400">Advance order step in real database</span>
            </div>
          </div>

          <button
            id="btn-advance-status"
            onClick={handleAdvanceStatus}
            disabled={advancing}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-xl transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${advancing ? 'animate-spin' : ''}`} />
            <span>{advancing ? 'Updating...' : 'Advance Status →'}</span>
          </button>
        </div>
      )}

      {/* Shop Info & Quick Call matching reference design #6 */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-neutral-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">{order.shop_name}</h4>
            <p className="text-[11px] text-neutral-500 truncate max-w-[180px]">
              {order.shop_address}
            </p>
          </div>
        </div>

        <a
          id="btn-call-shop"
          href="tel:+919876543210"
          className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Shop</span>
        </a>
      </div>

      {/* Delivery Address & Time */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-neutral-200/80 space-y-2.5">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-100">
          <span className="text-neutral-500 font-medium">Estimated Delivery</span>
          <span className="font-bold text-neutral-900 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-red-500" /> {order.estimated_delivery_time}
          </span>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-neutral-600 pt-1">
          <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-neutral-900">{order.delivery_address.tag} ({order.delivery_address.fullName}):</span>{' '}
            {order.delivery_address.houseFlat}, {order.delivery_address.streetArea}, {order.delivery_address.city} - {order.delivery_address.pincode}
            <div className="text-[10px] text-neutral-400 mt-0.5 font-medium">
              Phone: {order.delivery_address.mobile}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Accordion */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-neutral-200/80 space-y-2">
        <button
          onClick={() => setShowItems(!showItems)}
          className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-700"
        >
          <span>Order Items ({order.items.length})</span>
          <div className="flex items-center gap-1 text-red-600 font-bold text-xs normal-case">
            <span>₹{order.total}</span>
            {showItems ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showItems && (
          <div className="pt-2 space-y-2 border-t border-neutral-100 animate-fade-in">
            {order.items.map(it => (
              <div key={it.id} className="flex justify-between items-center text-xs text-neutral-700">
                <div className="flex items-center gap-2">
                  <img
                    src={it.product_image}
                    alt={it.product_name}
                    className="w-8 h-8 rounded-lg object-cover bg-neutral-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="font-bold">{it.quantity}x</span> {it.product_name}
                    <span className="text-[10px] text-neutral-400 block">{it.selected_weight}</span>
                  </div>
                </div>
                <span className="font-bold text-neutral-900">₹{it.price * it.quantity}</span>
              </div>
            ))}

            <div className="pt-2 border-t border-neutral-100 space-y-1 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-neutral-900 pt-1 border-t border-neutral-100">
                <span>Total Amount ({order.payment_method})</span>
                <span className="text-red-600">₹{order.total}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delivered Order Again Button */}
      {isDelivered && (
        <div className="pt-2 space-y-2">
          <button
            id="btn-order-again"
            onClick={onOrderAgain || onBack}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-red-200 transition-all"
          >
            Order Again
          </button>
        </div>
      )}
    </div>
  );
};
