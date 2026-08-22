import React from 'react';
import {
  Store,
  ArrowRight,
  Play,
  BadgePercent,
  ThumbsUp,
  QrCode,
  Headphones,
  FileText,
  Smartphone,
  ShoppingCart,
  ShoppingBag,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { ShopIllustration } from '../components/ShopIllustration';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-10">
      {/* 1. HERO SECTION (Clean, professional, without the dashboard mockup) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide">
              <Store className="w-3.5 h-3.5" />
              <span>Built for Local Retailers</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-[#1E1B4B] tracking-tight leading-[1.15]">
              Take Your Local Store Online with{' '}
              <span className="text-indigo-600">xyz.com</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed font-normal">
              Create your digital store, receive online orders, and grow your business with ease.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                id="hero-cta-register"
                onClick={() => onNavigate('/register')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-md hover:shadow-indigo-200 cursor-pointer group"
              >
                <span>Register Your Store</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-cta-how-it-works"
                onClick={() => onNavigate('/how-it-works')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-indigo-700 bg-white hover:bg-indigo-50/80 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                <span>See How It Works</span>
              </button>
            </div>

            {/* 4 Feature Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-purple-100/80">
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
                  <BadgePercent className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">No Setup Fee</h4>
                <p className="text-[11px] text-gray-500 leading-snug">Start your online store for free</p>
              </div>

              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
                  <ThumbsUp className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Easy to Use</h4>
                <p className="text-[11px] text-gray-500 leading-snug">Simple tools to manage your store</p>
              </div>

              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
                  <QrCode className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Your Own QR Code</h4>
                <p className="text-[11px] text-gray-500 leading-snug">Let customers find your store instantly</p>
              </div>

              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
                  <Headphones className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Quick Support</h4>
                <p className="text-[11px] text-gray-500 leading-snug">We're here to help you anytime</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Graphic (Clean Storefront Visual) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-sm bg-gradient-to-b from-indigo-50/80 to-white p-8 rounded-3xl border border-purple-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
              <ShopIllustration variant="hero" className="max-w-[240px]" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">Get Your Digital Storefront</h3>
                <p className="text-xs text-gray-500">
                  Unique store handle, instant QR code & digital catalog
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight">
            How <span className="text-indigo-600">xyz.com</span> Works
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Get your store online in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center relative group">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-4 shadow-xs">
              1
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
              <Store className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Register Your Store</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Fill in your store and owner details to get started.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center relative group">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-4 shadow-xs">
              2
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Complete Registration</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Add your store information and complete the registration.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center relative group">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-4 shadow-xs">
              3
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
              <QrCode className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Get Credentials & QR Code</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Receive your login credentials, store link and QR code.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center relative group">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-4 shadow-xs">
              4
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Go to Retailer App</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Login to the retailer app and start managing your store.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHAT YOU GET WITH XYZ.COM */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight">
            What You Get with <span className="text-indigo-600">xyz.com</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Powerful tools to help you run and grow your business
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {/* Card 1: Online Store */}
          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-indigo-600 mb-3">
              <Store className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Online Store</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Get your own online store with your unique name and link.
            </p>
          </div>

          {/* Card 2: Order Management */}
          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Order Management</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Receive and manage all customer orders in one place.
            </p>
          </div>

          {/* Card 3: Product Management */}
          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Product Management</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Add products, set prices and keep your catalog up to date.
            </p>
          </div>

          {/* Card 4: QR Code & Store Link */}
          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">QR Code & Store Link</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Share your QR code and unique store link to bring more customers.
            </p>
          </div>

          {/* Card 5: Delivery Management */}
          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Delivery Management</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Assign deliveries and manage your delivery operations easily.
            </p>
          </div>
        </div>
      </section>

      {/* 4. READY TO TAKE YOUR STORE ONLINE BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left with illustration */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-36 h-28 shrink-0 flex items-center justify-center">
                <ShopIllustration variant="hero" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E1B4B]">
                  Ready to Take Your Store Online?
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md">
                  Join thousands of local retailers who are growing their business with xyz.com
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-indigo-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Quick & Easy Registration</span>
                </div>
              </div>
            </div>

            {/* Right CTA button */}
            <div className="shrink-0 w-full sm:w-auto">
              <button
                id="banner-cta-register"
                onClick={() => onNavigate('/register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-md hover:shadow-indigo-200 cursor-pointer group"
              >
                <span>Register Your Store</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
