import React from 'react';
import { MapPin, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BrandHeaderProps {
  onOpenAccount: () => void;
  onOpenAddressSelect?: () => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  onOpenAccount,
  onOpenAddressSelect,
  title,
  showBack,
  onBack,
}) => {
  const { user, selectedAddress } = useAuth();

  const locationText = selectedAddress
    ? `${selectedAddress.tag} • ${selectedAddress.houseFlat}, ${selectedAddress.city}`
    : user?.saved_addresses?.[0]
    ? `${user.saved_addresses[0].tag} • ${user.saved_addresses[0].city}`
    : 'Deliver to • Rajahmundry';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-100 px-4 py-3 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {showBack ? (
          <div className="flex items-center gap-3">
            <button
              id="header-back-btn"
              onClick={onBack}
              className="p-1.5 -ml-1.5 text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-neutral-900 truncate tracking-tight">{title}</h1>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            {/* XYZ Brand Logo */}
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm font-black text-xs tracking-tighter">
                <span className="text-white font-extrabold text-sm">xyz</span>
              </div>
              <div className="flex flex-col -space-y-0.5">
                <span className="text-sm font-black tracking-tight text-neutral-900 flex items-center gap-1">
                  xyz<span className="text-red-600">.com</span>
                </span>
                <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
                  Fresh Delivered
                </span>
              </div>
            </div>

            {/* Location Selector */}
            <button
              id="header-location-btn"
              onClick={onOpenAddressSelect}
              className="flex items-center gap-1 px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/70 rounded-full text-left transition-colors max-w-[150px] sm:max-w-[200px]"
            >
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <div className="truncate text-xs font-medium text-neutral-800">
                {locationText}
              </div>
              <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
            </button>
          </div>
        )}

        {/* Profile icon */}
        <button
          id="header-profile-btn"
          onClick={onOpenAccount}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600 transition-colors border border-neutral-200/80"
          aria-label="User Account"
        >
          {user ? (
            <span className="text-xs font-bold text-red-600 uppercase">
              {user.name.slice(0, 2)}
            </span>
          ) : (
            <User className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
