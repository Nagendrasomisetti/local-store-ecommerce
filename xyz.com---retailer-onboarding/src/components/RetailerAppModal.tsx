import React from 'react';
import { X, Smartphone, CheckCircle, ArrowRight, Store } from 'lucide-react';

interface RetailerAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  uniqueStoreName?: string;
  storeName?: string;
  temporaryPassword?: string;
}

export const RetailerAppModal: React.FC<RetailerAppModalProps> = ({
  isOpen,
  onClose,
  uniqueStoreName,
  storeName,
  temporaryPassword,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-purple-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                Next Step
              </span>
              <h3 className="text-xl font-bold text-white">Retailer Mobile & Web App</h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-1">
              <Store className="w-4 h-4 text-indigo-600" />
              <span>{storeName || 'Your Store'} is Ready!</span>
            </div>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Use your registered credentials below when logging into the Retailer App to start adding products and managing online orders.
            </p>

            {uniqueStoreName && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                  <span className="text-gray-400 block font-medium">Unique Store Name</span>
                  <span className="font-bold text-indigo-900 text-sm font-mono">{uniqueStoreName}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                  <span className="text-gray-400 block font-medium">Password</span>
                  <span className="font-bold text-indigo-900 text-sm font-mono">{temporaryPassword || '••••••••'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">What to do next:</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Download or bookmark your Store QR Code for in-store displays</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Share your store link with your WhatsApp customer groups</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Login to upload your catalog products and set store timings</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-purple-50 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
            <button
              onClick={() => {
                alert(`Redirecting with Store: ${uniqueStoreName || 'your-store'}. Retailer App modules will be configured in the next phase!`);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>Proceed to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
