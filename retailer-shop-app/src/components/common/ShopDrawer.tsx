import React from 'react';
import { useShop } from '../../context/ShopContext';
import {
  X,
  Store,
  MapPin,
  Phone,
  RotateCcw,
  LogOut,
  Package,
  Bike,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShopDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopDrawer: React.FC<ShopDrawerProps> = ({ isOpen, onClose }) => {
  const { shopProfile, logout, resetPrototype, navigateTo } = useShop();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          {/* Drawer Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="p-5 bg-[#7C3AED] text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="font-bold text-lg">{shopProfile.shopName}</h3>
                <p className="text-xs text-purple-200 font-medium">Shop ID: {shopProfile.shopId}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live & Accepting Orders
                </div>
              </div>

              {/* Shop Info Info */}
              <div className="p-4 space-y-3 border-b border-gray-100 text-xs text-gray-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                  <span>{shopProfile.address}, {shopProfile.city}, {shopProfile.pincode}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <span>+91 {shopProfile.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700 font-medium">Platform Verified Retailer</span>
                </div>
              </div>

              {/* Quick links */}
              <div className="p-3 space-y-1">
                <button
                  onClick={() => {
                    onClose();
                    navigateTo('products');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors cursor-pointer"
                >
                  <Package className="w-4 h-4 text-[#7C3AED]" />
                  <span>Manage Products</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigateTo('delivery');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors cursor-pointer"
                >
                  <Bike className="w-4 h-4 text-[#7C3AED]" />
                  <span>Delivery Fleet</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    resetPrototype();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-[#7C3AED]" />
                  <span>Reset Demo Orders</span>
                </button>
              </div>
            </div>

            {/* Footer Logout */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-sm hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
