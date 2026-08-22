import React from 'react';
import {
  Store,
  FileText,
  QrCode,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ShopIllustration } from '../components/ShopIllustration';

interface HowItWorksPageProps {
  onNavigate: (path: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-20 py-8 sm:py-12">
      {/* 1. MAIN HEADER & INTRO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide">
          <Zap className="w-3.5 h-3.5" />
          <span>Simple 4-Step Process</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E1B4B] tracking-tight">
          How <span className="text-indigo-600">xyz.com</span> Works
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
          Get your store online in 4 simple steps
        </p>
      </section>

      {/* 2. 4-STEPS CONTAINER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Step 1 Card */}
          <div className="bg-white rounded-2xl p-7 border border-purple-100 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center relative group">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
              1
            </div>

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5 group-hover:scale-105 transition-transform">
              <Store className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Register Your Store</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Fill in your store and owner details to get started.
            </p>

            <div className="mt-4 pt-4 border-t border-purple-50 text-[11px] text-indigo-600 font-medium w-full">
              Takes less than 2 minutes
            </div>
          </div>

          {/* Step 2 Card */}
          <div className="bg-white rounded-2xl p-7 border border-purple-100 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center relative group">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
              2
            </div>

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5 group-hover:scale-105 transition-transform">
              <FileText className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Registration</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Add your store information and complete the registration.
            </p>

            <div className="mt-4 pt-4 border-t border-purple-50 text-[11px] text-indigo-600 font-medium w-full">
              Zero registration fee
            </div>
          </div>

          {/* Step 3 Card */}
          <div className="bg-white rounded-2xl p-7 border border-purple-100 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center relative group">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
              3
            </div>

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5 group-hover:scale-105 transition-transform">
              <QrCode className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Get Credentials & QR Code</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Receive your unique store name, password, store link and QR code.
            </p>

            <div className="mt-4 pt-4 border-t border-purple-50 text-[11px] text-indigo-600 font-medium w-full">
              Instant generation
            </div>
          </div>

          {/* Step 4 Card */}
          <div className="bg-white rounded-2xl p-7 border border-purple-100 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center relative group">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
              4
            </div>

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5 group-hover:scale-105 transition-transform">
              <Smartphone className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Go to Retailer App</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Login to the retailer app and start managing your store.
            </p>

            <div className="mt-4 pt-4 border-t border-purple-50 text-[11px] text-indigo-600 font-medium w-full">
              Start selling online
            </div>
          </div>
        </div>
      </section>

      {/* 3. READY TO TAKE YOUR STORE ONLINE BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-36 h-28 shrink-0 flex items-center justify-center">
                <ShopIllustration variant="hero" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E1B4B]">
                  Ready to Take Your Store Online?
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md">
                  Join thousands of local retailers who are growing their business with xyz.com
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-indigo-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Quick & Easy Registration</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-700">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Secure & Trusted Platform</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <button
                id="how-it-works-cta-register"
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
