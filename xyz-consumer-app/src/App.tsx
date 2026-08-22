import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { BrandHeader } from './components/BrandHeader';
import { BottomNav, NavTab } from './components/BottomNav';
import { SignupView } from './views/SignupView';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmedView } from './views/OrderConfirmedView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { OrdersListView } from './views/OrdersListView';
import { AccountView } from './views/AccountView';
import { AddressModal } from './components/AddressModal';
import { AuthModal } from './components/AuthModal';
import { Shop, Product, Order } from './types';

type ActiveView =
  | 'signup'
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmed'
  | 'order-tracking'
  | 'orders'
  | 'account';

function MainAppContent() {
  const { user, loading: authLoading } = useAuth();
  const { currentShop, setCurrentShop } = useCart();

  // The first interface when opening the app is the Sign Up page
  const [activeView, setActiveView] = useState<ActiveView>('signup');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // If user is already authenticated (e.g. from localStorage token), navigate to home
  useEffect(() => {
    if (user && activeView === 'signup') {
      setActiveView('home');
    }
  }, [user]);

  // Map view to bottom nav tab
  const getNavTab = (): NavTab => {
    if (activeView === 'home' || activeView === 'shop' || activeView === 'product-detail') return 'home';
    if (activeView === 'orders' || activeView === 'order-tracking' || activeView === 'order-confirmed') return 'orders';
    if (activeView === 'cart' || activeView === 'checkout') return 'cart';
    if (activeView === 'account') return 'account';
    return 'home';
  };

  const handleSelectTab = (tab: NavTab) => {
    if (tab === 'home') {
      if (selectedShop) setActiveView('shop');
      else setActiveView('home');
    } else if (tab === 'orders') {
      setActiveView('orders');
    } else if (tab === 'cart') {
      setActiveView('cart');
    } else if (tab === 'account') {
      setActiveView('account');
    }
  };

  const handleShopSelected = (shop: Shop) => {
    setSelectedShop(shop);
    setCurrentShop(shop);
    setActiveView('shop');
  };

  const handleProductSelected = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product-detail');
  };

  const handleOrderPlaced = (order: Order) => {
    setConfirmedOrder(order);
    setActiveView('order-confirmed');
  };

  const handleTrackOrder = (orderId: string) => {
    setTrackingOrderId(orderId);
    setActiveView('order-tracking');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-100/60 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAuthPage = activeView === 'signup';

  return (
    <div className="min-h-screen bg-neutral-100/60 font-sans text-neutral-900 flex justify-center selection:bg-red-500 selection:text-white">
      {/* Mobile-first centered app container */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col border-x border-neutral-200/60">
        {/* Brand Header - Hidden on signup/login page and dedicated product detail page which has its own back nav */}
        {!isAuthPage && activeView !== 'product-detail' && (
          <BrandHeader
            onOpenAccount={() => {
              if (!user) setActiveView('signup');
              else setActiveView('account');
            }}
            onOpenAddressSelect={() => {
              if (!user) setActiveView('signup');
              else setIsAddressModalOpen(true);
            }}
            title={
              activeView === 'shop'
                ? selectedShop?.shop_name || 'Shop'
                : activeView === 'cart'
                ? 'Your Cart'
                : activeView === 'checkout'
                ? 'Checkout'
                : activeView === 'order-confirmed'
                ? 'Order Confirmed'
                : activeView === 'order-tracking'
                ? 'Track Order'
                : activeView === 'orders'
                ? 'My Orders'
                : activeView === 'account'
                ? 'My Account'
                : undefined
            }
            showBack={
              activeView === 'shop' ||
              activeView === 'checkout' ||
              activeView === 'order-tracking'
            }
            onBack={() => {
              if (activeView === 'shop') setActiveView('home');
              else if (activeView === 'checkout') setActiveView('cart');
              else if (activeView === 'order-tracking') setActiveView('orders');
              else setActiveView('home');
            }}
          />
        )}

        {/* View Router */}
        <main className={`flex-1 ${isAuthPage ? 'flex flex-col justify-center' : ''}`}>
          {activeView === 'signup' && (
            <SignupView
              onAuthSuccess={() => setActiveView('home')}
            />
          )}

          {activeView === 'home' && (
            <HomeView
              onSelectShop={handleShopSelected}
              onOpenAuth={() => setActiveView('signup')}
            />
          )}

          {activeView === 'shop' && selectedShop && (
            <ShopView
              shop={selectedShop}
              onBack={() => setActiveView('home')}
              onGoToCart={() => setActiveView('cart')}
              onSelectProduct={handleProductSelected}
            />
          )}

          {activeView === 'product-detail' && selectedProduct && (selectedShop || currentShop) && (
            <ProductDetailView
              product={selectedProduct}
              shop={selectedShop || currentShop!}
              onBack={() => setActiveView('shop')}
              onGoToCart={() => setActiveView('cart')}
            />
          )}

          {activeView === 'cart' && (
            <CartView
              onGoToCheckout={() => {
                if (!user) {
                  setActiveView('signup');
                } else {
                  setActiveView('checkout');
                }
              }}
              onContinueShopping={() => {
                if (selectedShop) setActiveView('shop');
                else setActiveView('home');
              }}
            />
          )}

          {activeView === 'checkout' && (
            <CheckoutView
              onBack={() => setActiveView('cart')}
              onOrderPlaced={handleOrderPlaced}
            />
          )}

          {activeView === 'order-confirmed' && confirmedOrder && (
            <OrderConfirmedView
              order={confirmedOrder}
              onTrackOrder={handleTrackOrder}
              onContinueShopping={() => setActiveView('home')}
            />
          )}

          {activeView === 'order-tracking' && (trackingOrderId || confirmedOrder?.id) && (
            <OrderTrackingView
              orderId={trackingOrderId || confirmedOrder!.id}
              onBack={() => setActiveView('orders')}
              onOrderAgain={() => {
                if (selectedShop) setActiveView('shop');
                else setActiveView('home');
              }}
            />
          )}

          {activeView === 'orders' && (
            <OrdersListView
              onSelectOrder={handleTrackOrder}
              onExploreShops={() => setActiveView('home')}
              onOpenAuth={() => setActiveView('signup')}
            />
          )}

          {activeView === 'account' && (
            <AccountView
              onGoToOrders={() => setActiveView('orders')}
              onLogout={() => setActiveView('signup')}
            />
          )}
        </main>

        {/* Bottom Navigation - Hidden on auth, product-detail, checkout, and order-confirmed pages */}
        {!isAuthPage &&
          activeView !== 'product-detail' &&
          activeView !== 'checkout' &&
          activeView !== 'order-confirmed' && (
            <BottomNav
              activeTab={getNavTab()}
              onSelectTab={handleSelectTab}
            />
          )}

        {/* Global Modals */}
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainAppContent />
      </CartProvider>
    </AuthProvider>
  );
}
