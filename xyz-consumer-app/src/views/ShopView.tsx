import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Search, Plus, Minus, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { Shop, Product } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

interface ShopViewProps {
  shop: Shop;
  onBack: () => void;
  onGoToCart: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  shop,
  onBack,
  onGoToCart,
  onSelectProduct,
}) => {
  const { currentShop, setCurrentShop, items, addItem, updateQuantity, getItemQuantity, itemCount, subtotal } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Set this shop as the active shop in cart if not set or empty
    if (!currentShop || items.length === 0) {
      setCurrentShop(shop);
    }
    loadShopProducts();
  }, [shop.id]);

  const loadShopProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getShopDetails(shop.id);
      setProducts(res.products);
    } catch (err) {
      console.error('Failed to load shop products:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-32 max-w-md mx-auto animate-fade-in">
      {/* Top Shop Banner & Header */}
      <div className="relative h-44 bg-neutral-900 overflow-hidden">
        <img
          src={shop.banner}
          alt={shop.shop_name}
          className="w-full h-full object-cover opacity-70"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back Button */}
        <button
          id="shop-back-btn"
          onClick={onBack}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-900 flex items-center justify-center backdrop-blur-xs shadow-md transition-all z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Shop Badge info overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <img
              src={shop.logo}
              alt={shop.shop_name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md bg-white"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-md">
                  ID: {shop.shop_id}
                </span>
                <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-md">
                  {shop.status}
                </span>
              </div>
              <h1 className="text-base font-black text-white leading-tight mt-1 truncate max-w-[220px]">
                {shop.shop_name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Info bar */}
      <div className="bg-white px-4 py-3 border-b border-neutral-100 shadow-xs">
        <div className="flex items-center justify-between text-xs text-neutral-600 font-medium">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-neutral-900">{shop.rating}</span>
            <span className="text-neutral-400">({shop.rating_count}+ reviews)</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{shop.delivery_time}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-red-600">₹{shop.delivery_fee}</span>
            <span className="text-neutral-400">Delivery</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-2">
          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
          <span className="truncate">{shop.address}</span>
        </div>
      </div>

      {/* Search within shop */}
      <div className="p-4 bg-neutral-50/70 border-b border-neutral-100">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-shop-products"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search chicken cuts, breast, boneless..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              id={`cat-pill-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid / List matching design reference #1 & #2 */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500">
            {activeCategory} Products ({filteredProducts.length})
          </h2>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Fresh Daily
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-neutral-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200/80 p-6">
            <Sparkles className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
            <h3 className="text-xs font-bold text-neutral-700">No products found</h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Try searching with a different keyword or category
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map(product => {
              const qtyInCart = getItemQuantity(product.id);
              const defaultWeight = product.weight_options?.[0] || product.unit;

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  onClick={() => onSelectProduct(product)}
                  className="p-3 bg-white rounded-2xl border border-neutral-200/80 hover:border-red-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex gap-3.5 relative group"
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {product.popular && (
                      <span className="absolute top-1 left-1 bg-amber-500 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                        Hot
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-xs font-bold text-neutral-900 group-hover:text-red-600 transition-colors leading-snug">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
                      <div>
                        <span className="text-sm font-black text-red-600">
                          ₹{product.price}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-medium ml-1">
                          / {product.unit}
                        </span>
                      </div>

                      {/* Add Button or Stepper */}
                      <div onClick={e => e.stopPropagation()}>
                        {qtyInCart > 0 ? (
                          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-2 py-1 rounded-xl border border-red-200 shadow-xs">
                            <button
                              id={`card-dec-${product.id}`}
                              onClick={() => updateQuantity(product.id, defaultWeight, qtyInCart - 1)}
                              className="w-5 h-5 flex items-center justify-center bg-white rounded-md text-neutral-800 shadow-xs hover:bg-neutral-100"
                            >
                              <Minus className="w-3 h-3 stroke-[3]" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                              {qtyInCart}
                            </span>
                            <button
                              id={`card-inc-${product.id}`}
                              onClick={() => addItem(product, 1, defaultWeight)}
                              className="w-5 h-5 flex items-center justify-center bg-white rounded-md text-neutral-800 shadow-xs hover:bg-neutral-100"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`btn-add-product-${product.id}`}
                            onClick={() => addItem(product, 1, defaultWeight)}
                            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1 active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar matching mobile shopping standard */}
      {itemCount > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-30 max-w-md mx-auto animate-slide-up">
          <div
            id="floating-cart-pill"
            onClick={onGoToCart}
            className="bg-neutral-900 hover:bg-black text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border border-neutral-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in Cart
                </div>
                <div className="text-[10px] text-neutral-400">
                  From {shop.shop_name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">₹{subtotal}</span>
              <span className="text-xs font-bold text-red-400 bg-red-950/80 px-2 py-1 rounded-lg">
                View Cart →
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
