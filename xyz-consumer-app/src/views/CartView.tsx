import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Store, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartViewProps {
  onGoToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ onGoToCheckout, onContinueShopping }) => {
  const { items, currentShop, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="pb-24 pt-12 px-6 max-w-md mx-auto text-center space-y-5 animate-fade-in">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-inner">
          <ShoppingBag className="w-12 h-12" strokeWidth={1.5} />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            You haven't added any fresh products to your cart yet. Explore your trusted local shops!
          </p>
        </div>

        <button
          id="cart-continue-shopping-btn"
          onClick={onContinueShopping}
          className="py-3 px-6 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-2xl shadow-md shadow-red-200 transition-all inline-flex items-center gap-2"
        >
          <Store className="w-4 h-4" />
          <span>Find Trusted Shops & Products</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 px-4 pt-3 max-w-md mx-auto space-y-4 animate-fade-in">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-neutral-900 tracking-tight">Your Cart</h1>
          <p className="text-xs text-neutral-500 font-medium">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} from {currentShop?.shop_name || 'Local Shop'}
          </p>
        </div>
        <button
          id="btn-clear-cart"
          onClick={clearCart}
          className="text-xs font-semibold text-neutral-400 hover:text-red-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Items List matching design reference #3 */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-neutral-200/80 space-y-3">
        {items.map(item => {
          const itemTotal = item.unit_price * item.quantity;

          return (
            <div
              key={`${item.product.id}-${item.selected_weight}`}
              id={`cart-item-${item.product.id}`}
              className="flex items-center gap-3 py-2 border-b border-neutral-100 last:border-0 last:pb-0"
            >
              {/* Image */}
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-16 h-16 rounded-2xl object-cover bg-neutral-100 shrink-0 border border-neutral-100"
                referrerPolicy="no-referrer"
              />

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-neutral-900 truncate">
                  {item.product.name}
                </h3>
                <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
                  Pack: <span className="text-neutral-800 font-semibold">{item.selected_weight}</span> • ₹{item.unit_price}
                </div>
                <div className="text-xs font-black text-red-600 mt-1">
                  ₹{itemTotal}
                </div>
              </div>

              {/* Stepper & Remove */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-neutral-100 rounded-xl p-1 border border-neutral-200">
                  <button
                    id={`cart-dec-${item.product.id}`}
                    onClick={() => updateQuantity(item.product.id, item.selected_weight, item.quantity - 1)}
                    className="w-6 h-6 rounded-lg bg-white text-neutral-800 flex items-center justify-center shadow-xs hover:bg-neutral-50"
                  >
                    <Minus className="w-3 h-3 stroke-[3]" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-neutral-900">
                    {item.quantity}
                  </span>
                  <button
                    id={`cart-inc-${item.product.id}`}
                    onClick={() => updateQuantity(item.product.id, item.selected_weight, item.quantity + 1)}
                    className="w-6 h-6 rounded-lg bg-white text-neutral-800 flex items-center justify-center shadow-xs hover:bg-neutral-50"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </button>
                </div>

                <button
                  id={`cart-remove-${item.product.id}`}
                  onClick={() => removeItem(item.product.id, item.selected_weight)}
                  className="p-2 text-neutral-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-3 bg-red-50/60 rounded-2xl border border-red-100 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-red-600 shrink-0" />
        <div className="text-[11px] text-neutral-700">
          <span className="font-bold text-red-800">Freshness Guaranteed:</span> Freshly trimmed upon order confirmation and delivered in temperature-safe packaging.
        </div>
      </div>

      {/* Bill Details */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-neutral-200/80 space-y-2.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-1">
          Bill Details
        </h3>

        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span>Item Subtotal</span>
          <span className="font-semibold text-neutral-900">₹{subtotal}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-600">
          <div className="flex items-center gap-1">
            <span>Delivery Partner Fee</span>
            {subtotal >= 500 && (
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                FREE
              </span>
            )}
          </div>
          <span className="font-semibold text-neutral-900">
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>

        <div className="border-t border-neutral-100 pt-2.5 flex items-center justify-between">
          <div>
            <div className="text-sm font-black text-neutral-900">Total Payable</div>
            <div className="text-[10px] text-neutral-400 font-medium">Inclusive of all taxes</div>
          </div>
          <span className="text-lg font-black text-red-600">₹{total}</span>
        </div>
      </div>

      {/* Sticky Bottom CTA for Checkout */}
      <div className="fixed bottom-20 left-4 right-4 z-30 max-w-md mx-auto animate-slide-up">
        <button
          id="btn-proceed-to-checkout"
          onClick={onGoToCheckout}
          className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-xl shadow-red-200 flex items-center justify-between transition-all"
        >
          <div className="text-left">
            <span className="text-[11px] font-bold text-red-100 block">Total • {itemCount} items</span>
            <span className="text-base font-black">₹{total}</span>
          </div>

          <div className="flex items-center gap-1.5 text-white">
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};
