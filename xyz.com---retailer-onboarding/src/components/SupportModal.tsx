import React from 'react';
import { X, Headphones, Phone, Mail, MessageSquare, Clock } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Retailer Support</h3>
                <p className="text-xs text-gray-500">We are here to assist your shop onboarding</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <div className="p-3.5 bg-indigo-50/70 rounded-xl flex items-start gap-3.5 border border-indigo-100/50">
              <Phone className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Toll-Free Helpline</p>
                <p className="text-sm font-semibold text-indigo-900">1800-890-XYZ (1800-890-999)</p>
                <p className="text-xs text-gray-500 mt-0.5">Available Mon-Sat (9 AM - 8 PM)</p>
              </div>
            </div>

            <div className="p-3.5 bg-purple-50/70 rounded-xl flex items-start gap-3.5 border border-purple-100/50">
              <MessageSquare className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">WhatsApp Support</p>
                <p className="text-sm font-semibold text-purple-900">+91 98765 43210</p>
                <p className="text-xs text-gray-500 mt-0.5">Instant chat assistance</p>
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl flex items-start gap-3.5 border border-gray-100">
              <Mail className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Assistance</p>
                <p className="text-sm font-semibold text-gray-900">support@xyz.com</p>
                <p className="text-xs text-gray-500 mt-0.5">Response within 2 hours</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-purple-50 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Typical response: under 5 mins</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
