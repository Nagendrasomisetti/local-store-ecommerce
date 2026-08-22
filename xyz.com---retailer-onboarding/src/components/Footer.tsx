import React from 'react';
import { ShieldCheck, UserCheck, Headphones } from 'lucide-react';

interface FooterProps {
  onContactSupport?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onContactSupport }) => {
  return (
    <footer className="mt-auto border-t border-purple-100 bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 py-4 items-center justify-center border-b border-purple-50 pb-8">
          <div className="flex items-center justify-center sm:justify-start gap-3 text-gray-700">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">Secure & Trusted Platform</span>
          </div>

          <div className="flex items-center justify-center gap-3 text-gray-700">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">No Technical Skills Required</span>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-3 text-gray-700">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">Support in Your Language</span>
          </div>
        </div>

        {/* Bottom copyright & support trigger */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} xyz.com. All rights reserved. Empowering local retailers.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={onContactSupport}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer"
            >
              Contact Support
            </button>
            <span className="text-gray-300">•</span>
            <span>Privacy Policy</span>
            <span className="text-gray-300">•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
