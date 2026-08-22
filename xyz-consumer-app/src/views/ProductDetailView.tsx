import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Minus, Check, Sparkles, ShieldCheck, Flame, ShoppingBag } from 'lucide-react';
import { Product, Shop } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailViewProps {
  product: Product;
  shop: Shop;
  onBack: () => void;
  onGoToCart: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  shop,
  onBack,
  onGoToCart,
}) => {
  const { user } = useAuth();
  const { addItem, getItemQuantity, itemCount, subtotal } = useCart();

  const [selectedWeight, setSelectedWeight] = useState<string>('1 kg');
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const defaultWeight =
      product.weight_options && product.weight_options.length > 0
        ? product.weight_options.includes('1 kg')
          ? '1 kg'
          : product.weight_options[0]
        : product.unit;
    setSelectedWeight(defaultWeight);
    setQuantity(1);
    setJustAdded(false);
  }, [product.id]);

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
    setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <div className="pb-36 min-h-screen bg-white animate-fade-in flex flex-col justify-between">
      <div>
        {/* Top Header Bar matching user reference */}
        <header className="sticky top-0 z-30 bg-white border-b border-neutral-100 px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <button
              id="btn-back-to-shop-header"
              onClick={onBack}
              className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <h1 className="text-base font-black text-neutral-900 truncate max-w-[230px]">
              {shop.shop_name}
            </h1>
          </div>

          <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 text-red-600 font-extrabold text-xs flex items-center justify-center">
            {userInitials}
          </div>
        </header>

        {/* Product Hero Banner */}
        <div className="relative w-full h-64 bg-neutral-900 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Badges on image */}
          <div className="absolute bottom-3.5 left-4 flex items-center gap-2 z-10">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-black rounded-lg shadow-sm">
              {product.category}
            </span>
            {product.popular && (
              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-white" /> Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Product Content */}
        <div className="p-5 space-y-6">
          {/* Title & Price Box */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-2xl font-black text-neutral-900 leading-snug tracking-tight">
                {product.name}
              </h2>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="text-right shrink-0 bg-red-50/80 px-3.5 py-2.5 rounded-2xl border border-red-100 min-w-[90px]">
              <div className="text-2xl font-black text-red-600">₹{unitPrice}</div>
              <div className="text-[10px] text-neutral-500 font-black uppercase tracking-wider mt-0.5">
                PER {selectedWeight.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-100 space-y-2.5">
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700 font-bold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Antibiotic-free</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Freshly dressed today</span>
              </div>
            </div>
            <div className="text-neutral-500 text-[11px] pt-2 border-t border-neutral-200/60 font-medium">
              Serves: {product.servings || '3-4 persons / kg'} • {product.pieces || '4-5 pieces / kg'}
            </div>
          </div>

          {/* Select Quantity / Weight */}
          {product.weight_options && product.weight_options.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-neutral-800 block">
                SELECT QUANTITY / WEIGHT
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {product.weight_options.map(wt => {
                  const isSelected = selectedWeight === wt;
                  return (
                    <button
                      key={wt}
                      id={`detail-wt-${wt.replace(/\s+/g, '')}`}
                      type="button"
                      onClick={() => setSelectedWeight(wt)}
                      className={`py-3.5 px-2 text-center rounded-2xl text-xs font-black border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-200 ring-2 ring-red-600'
                          : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      {wt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Units Count Stepper */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs font-black text-neutral-900 uppercase tracking-wider block">
                UNITS COUNT
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                Total {selectedWeight} packs
              </span>
            </div>

            <div className="flex items-center gap-3 bg-neutral-100/90 rounded-2xl p-1.5 border border-neutral-200/80">
              <button
                id="btn-detail-decrement"
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-white text-neutral-800 flex items-center justify-center shadow-xs disabled:opacity-40 hover:bg-neutral-50 transition-colors cursor-pointer"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="w-8 text-center text-base font-black text-neutral-900">
                {quantity}
              </span>
              <button
                id="btn-detail-increment"
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 rounded-xl bg-white text-neutral-800 flex items-center justify-center shadow-xs hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Sticky Bottom Bar for Add to Cart Option */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-2xl p-4">
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center gap-3">
            {/* Add to Cart CTA */}
            <button
              id="btn-page-add-to-cart"
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-4 px-4 rounded-2xl text-sm font-black text-white shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] ${
                justAdded
                  ? 'bg-emerald-600 shadow-emerald-200'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-200'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Added {quantity} Pack(s)!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add to Cart</span>
                  <span>•</span>
                  <span>₹{totalPrice}</span>
                </>
              )}
            </button>

            {/* If cart has items, show Go to Cart button */}
            {itemCount > 0 && (
              <button
                id="btn-page-view-cart"
                type="button"
                onClick={onGoToCart}
                className="py-4 px-4 bg-neutral-900 hover:bg-black text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
              >
                <ShoppingBag className="w-4 h-4 text-red-500" />
                <span>Cart ({itemCount})</span>
              </button>
            )}
          </div>

          {inCartCount > 0 && (
            <p className="text-[11px] text-center text-neutral-500 font-semibold">
              ✓ {inCartCount} pack(s) in cart (₹{subtotal} total)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
