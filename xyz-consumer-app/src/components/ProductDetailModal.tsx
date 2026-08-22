import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Sparkles, ShieldCheck, Flame } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddedToCart?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddedToCart,
}) => {
  const { addItem, getItemQuantity } = useCart();

  const [selectedWeight, setSelectedWeight] = useState<string>('1 kg');
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);

  // Lock body scroll when modal is open so the page doesn't scroll underneath
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      const defaultWeight =
        product.weight_options && product.weight_options.length > 0
          ? product.weight_options.includes('1 kg')
            ? '1 kg'
            : product.weight_options[0]
          : product.unit;
      setSelectedWeight(defaultWeight);
      setQuantity(1);
      setJustAdded(false);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  // Calculate unit price based on weight
  let multiplier = 1;
  if (selectedWeight === '500 g' && product.unit === 'kg') multiplier = 0.5;
  else if (selectedWeight === '1.5 kg' && product.unit === 'kg') multiplier = 1.5;
  else if (selectedWeight === '2 kg' && product.unit === 'kg') multiplier = 2;

  const unitPrice = Math.round(product.price * multiplier);
  const totalPrice = unitPrice * quantity;
  const inCartCount = getItemQuantity(product.id, selectedWeight);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedWeight);
    setJustAdded(true);
    if (onAddedToCart) onAddedToCart();

    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 transition-opacity animate-fade-in touch-none"
      onClick={onClose}
    >
      {/* Fixed Full Modal Container strictly constrained to max-w-md and max-h-screen */}
      <div
        className="bg-white w-full max-w-md h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-slide-up relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Fixed Header / Image Section */}
        <div className="relative shrink-0 w-full h-64 sm:h-56 bg-neutral-900 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

          {/* Close button - Fixed top right */}
          <button
            id="close-product-detail-btn"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg active:scale-95 z-20 cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Category & Best Seller Badges */}
          <div className="absolute bottom-3.5 left-4 flex items-center gap-2 z-10">
            <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-black rounded-lg shadow-sm tracking-wide">
              {product.category}
            </span>
            {product.popular && (
              <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-white" /> Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Scrollable details body with custom smooth touch feel */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 overscroll-contain">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-xl font-black text-neutral-900 leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="text-right shrink-0 bg-red-50 px-3 py-1.5 rounded-2xl border border-red-100">
              <span className="text-xl font-black text-red-600">₹{unitPrice}</span>
              <span className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">
                per {selectedWeight}
              </span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-[11px] text-neutral-700 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Antibiotic-free</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Freshly dressed today</span>
            </div>
            {product.servings && (
              <div className="text-neutral-500 col-span-2 text-[10px] pt-1.5 mt-1 border-t border-neutral-200/60 flex items-center gap-1 font-semibold">
                <span>Serves: {product.servings}</span>
                {product.pieces && <span>• {product.pieces}</span>}
              </div>
            )}
          </div>

          {/* Weight / Pack Selector */}
          {product.weight_options && product.weight_options.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-neutral-700 block">
                Select Quantity / Weight
              </label>
              <div className="grid grid-cols-4 gap-2">
                {product.weight_options.map(wt => {
                  const isSelected = selectedWeight === wt;
                  return (
                    <button
                      key={wt}
                      id={`weight-option-${wt.replace(/\s+/g, '')}`}
                      type="button"
                      onClick={() => setSelectedWeight(wt)}
                      className={`py-2.5 px-1 text-center rounded-xl text-xs font-black border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-200'
                          : 'border-neutral-200 bg-neutral-50 hover:bg-white text-neutral-800'
                      }`}
                    >
                      {wt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <div>
              <span className="text-xs font-black text-neutral-800 uppercase tracking-wider block">
                Units Count
              </span>
              <span className="text-[10px] text-neutral-400">Total {selectedWeight} packs</span>
            </div>
            <div className="flex items-center gap-3 bg-neutral-100 rounded-2xl p-1 border border-neutral-200/80">
              <button
                id="qty-decrement-btn"
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-xl bg-white text-neutral-800 flex items-center justify-center shadow-xs disabled:opacity-40 hover:bg-neutral-50 transition-colors cursor-pointer"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="w-6 text-center text-sm font-black text-neutral-900">
                {quantity}
              </span>
              <button
                id="qty-increment-btn"
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 rounded-xl bg-white text-neutral-800 flex items-center justify-center shadow-xs hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Sticky Bottom CTA */}
        <div className="p-4 bg-white border-t border-neutral-100 shrink-0 shadow-lg">
          <button
            id="add-to-cart-cta"
            type="button"
            onClick={handleAddToCart}
            disabled={justAdded}
            className={`w-full py-4 px-4 rounded-2xl text-sm font-black text-white shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] ${
              justAdded
                ? 'bg-emerald-600 shadow-emerald-200'
                : 'bg-red-600 hover:bg-red-700 shadow-red-200'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <span>Add to Cart</span>
                <span>•</span>
                <span>₹{totalPrice}</span>
              </>
            )}
          </button>
          {inCartCount > 0 && (
            <p className="text-[11px] text-center text-neutral-500 font-semibold mt-1.5">
              {inCartCount} item(s) already in your cart
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
