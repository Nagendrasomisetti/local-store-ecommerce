import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, CreditCard, Banknote, Plus, CheckCircle2, ChevronRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order } from '../types';
import { AddressModal } from '../components/AddressModal';
import { AuthModal } from '../components/AuthModal';

interface CheckoutViewProps {
  onBack: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onBack, onOrderPlaced }) => {
  const { items, currentShop, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user, selectedAddress, setSelectedAddress } = useAuth();

  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<'Deliver Now' | 'Schedule Order'>('Deliver Now');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI'>('Cash on Delivery');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fallback default address if none explicitly set
  const activeAddress = selectedAddress || user?.saved_addresses?.[0];

  const handleConfirmOrder = async () => {
    setErrorMsg(null);

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!activeAddress) {
      setErrorMsg('Please select or add a delivery address to confirm your order');
      setIsAddressModalOpen(true);
      return;
    }

    if (!currentShop || items.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }

    try {
      setPlacingOrder(true);
      const orderPayload = {
        shopId: currentShop.id,
        items: items.map(it => ({
          productId: it.product.id,
          quantity: it.quantity,
          selected_weight: it.selected_weight,
        })),
        deliveryAddress: activeAddress,
        deliveryTimeSlot: deliveryTimeSlot === 'Deliver Now' ? 'Deliver Now (30-45 min)' : 'Scheduled Delivery',
        paymentMethod: paymentMethod,
      };

      const createdOrder = await api.createOrder(orderPayload);
      clearCart();
      onOrderPlaced(createdOrder);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to confirm order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="pb-36 px-4 pt-3 max-w-md mx-auto space-y-4 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <button
            id="checkout-back-btn"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1 className="text-lg font-black text-neutral-900 tracking-tight">Checkout</h1>
        </div>

        {currentShop && (
          <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg">
            {currentShop.shop_name}
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* SECTION 1: Delivery Address */}
      <div className="bg-white rounded-3xl p-4.5 shadow-xs border border-neutral-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-neutral-700">
            Delivery Address
          </span>
          <button
            id="checkout-change-address-btn"
            type="button"
            onClick={() => {
              if (!user) {
                setIsAuthModalOpen(true);
              } else {
                setIsAddressModalOpen(true);
              }
            }}
            className="text-xs font-black text-red-600 hover:text-red-700 cursor-pointer"
          >
            {activeAddress ? 'Change' : '+ Add Address'}
          </button>
        </div>

        {activeAddress ? (
          <div
            onClick={() => setIsAddressModalOpen(true)}
            className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/70 flex items-start gap-3 cursor-pointer hover:bg-neutral-100/80 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-neutral-900">{activeAddress.tag}</span>
                <span className="text-[10px] text-neutral-400 font-medium">({activeAddress.fullName})</span>
              </div>
              <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed truncate">
                {activeAddress.houseFlat}, {activeAddress.streetArea}, {activeAddress.city} - {activeAddress.pincode}
              </p>
              <div className="text-[10px] text-neutral-500 font-medium mt-1">
                Phone: {activeAddress.mobile}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 self-center" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!user) setIsAuthModalOpen(true);
              else setIsAddressModalOpen(true);
            }}
            className="w-full py-3 px-4 border-2 border-dashed border-neutral-300 rounded-2xl text-neutral-600 hover:text-red-600 hover:border-red-400 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery Address</span>
          </button>
        )}
      </div>

      {/* SECTION 2: Payment Method */}
      <div className="bg-white rounded-3xl p-4.5 shadow-xs border border-neutral-200/80 space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-neutral-700 block">
          PAYMENT METHOD
        </span>

        <div className="space-y-2.5">
          {/* Cash on Delivery */}
          <div
            id="radio-pay-cod"
            onClick={() => setPaymentMethod('Cash on Delivery')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              paymentMethod === 'Cash on Delivery'
                ? 'border-red-600 bg-red-50/40 ring-1.5 ring-red-600 shadow-xs'
                : 'border-neutral-200 hover:border-neutral-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'Cash on Delivery' ? 'border-red-600' : 'border-neutral-300'
                }`}
              >
                {paymentMethod === 'Cash on Delivery' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                )}
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Banknote className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-neutral-900">Cash on Delivery (COD)</div>
                <div className="text-[11px] text-neutral-500">Pay cash or UPI upon delivery</div>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
              Recommended
            </span>
          </div>

          {/* UPI */}
          <div
            id="radio-pay-upi"
            onClick={() => setPaymentMethod('UPI')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              paymentMethod === 'UPI'
                ? 'border-red-600 bg-red-50/40 ring-1.5 ring-red-600 shadow-xs'
                : 'border-neutral-200 hover:border-neutral-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'UPI' ? 'border-red-600' : 'border-neutral-300'
                }`}
              >
                {paymentMethod === 'UPI' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                )}
              </div>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-neutral-900">UPI / QR Payment</div>
                <div className="text-[11px] text-neutral-500">GPay, PhonePe, Paytm, BHIM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Order Summary */}
      <div className="bg-white rounded-3xl p-4.5 shadow-xs border border-neutral-200/80 space-y-2.5">
        <span className="text-xs font-black uppercase tracking-wider text-neutral-700 block mb-1">
          ORDER SUMMARY ({items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'})
        </span>

        <div className="space-y-2 pb-2.5 border-b border-neutral-100 max-h-44 overflow-y-auto">
          {items.map(it => (
            <div key={`${it.product.id}-${it.selected_weight}`} className="flex justify-between text-xs text-neutral-800">
              <span className="truncate pr-2 font-medium">
                {it.quantity}x {it.product.name} ({it.selected_weight})
              </span>
              <span className="font-bold text-neutral-900 shrink-0">₹{it.unit_price * it.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xs text-neutral-600 pt-1">
          <span>Subtotal</span>
          <span className="font-semibold text-neutral-900">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-xs text-neutral-600">
          <span>Delivery Fee</span>
          <span className="font-semibold text-emerald-600">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
        </div>
        <div className="flex justify-between text-sm font-black text-neutral-900 pt-2.5 border-t border-neutral-100">
          <span>Total Payable</span>
          <span className="text-red-600 text-lg font-black">₹{total}</span>
        </div>
      </div>

      {/* Trust Guarantee note */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 font-semibold py-1">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>100% Safe & Hygienic Meat Delivery Guarantee</span>
      </div>

      {/* Prominent Fixed Sticky Bottom Bar with "Confirm Order" CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-2xl p-4">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Total Amount</div>
            <div className="text-xl font-black text-neutral-900 leading-tight">₹{total}</div>
          </div>

          <button
            id="btn-confirm-order"
            type="button"
            onClick={handleConfirmOrder}
            disabled={placingOrder}
            className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-xl shadow-red-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {placingOrder ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirming Order...
              </span>
            ) : (
              <>
                <span>Confirm Order</span>
                <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressSelected={addr => {
          setSelectedAddress(addr);
          setIsAddressModalOpen(false);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
