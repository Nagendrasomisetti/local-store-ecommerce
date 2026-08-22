import React, { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Bell, MapPin, Phone, Check, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const IncomingOrderModal: React.FC = () => {
  const { incomingOrder, acceptIncomingOrder, rejectIncomingOrder } = useShop();
  const [secondsLeft, setSecondsLeft] = useState<number>(60);

  useEffect(() => {
    if (!incomingOrder) {
      setSecondsLeft(60);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          rejectIncomingOrder();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [incomingOrder, rejectIncomingOrder]);

  if (!incomingOrder) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-500"
        >
          {/* Header with pulsating alert */}
          <div className="bg-[#7C3AED] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-purple-200">
                  Incoming Online Order
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  Order #{incomingOrder.id}
                </h3>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{secondsLeft}s</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3.5 max-h-[60vh] overflow-y-auto">
            {/* Customer Details */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  {incomingOrder.customerName}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                  <Phone className="w-3 h-3 text-[#7C3AED]" />
                  <span>{incomingOrder.customerPhone}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 font-medium">Payment</span>
                <p className="text-xs font-bold text-gray-800">
                  {incomingOrder.paymentMethod}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Order Items ({incomingOrder.items.length})
              </span>
              <div className="bg-gray-50 rounded-xl p-3 divide-y divide-gray-200/60 space-y-2">
                {incomingOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pt-1.5 first:pt-0 text-xs">
                    <div>
                      <span className="font-bold text-gray-800">{item.name}</span>
                      <span className="text-gray-500 ml-1.5 font-medium">({item.quantity})</span>
                    </div>
                    <span className="font-bold text-gray-900">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="flex items-start gap-2 text-xs text-gray-600 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
              <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
              <span>
                {incomingOrder.address.street}, {incomingOrder.address.city} - {incomingOrder.address.pincode}
              </span>
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-700">Total Order Amount</span>
              <span className="text-xl font-extrabold text-[#7C3AED]">
                ₹{incomingOrder.total}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
            <button
              onClick={rejectIncomingOrder}
              className="flex-1 py-3 px-4 bg-white border border-gray-300 hover:bg-rose-50 hover:border-rose-300 text-gray-700 hover:text-rose-600 font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Reject / Busy</span>
            </button>

            <button
              onClick={acceptIncomingOrder}
              className="flex-2 py-3 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-200 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Accept Order (₹{incomingOrder.total})</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
