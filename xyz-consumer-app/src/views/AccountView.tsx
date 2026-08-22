import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Package, LogOut, ChevronRight, Plus, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AddressModal } from '../components/AddressModal';
import { AuthModal } from '../components/AuthModal';

interface AccountViewProps {
  onGoToOrders: () => void;
  onLogout?: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ onGoToOrders, onLogout }) => {
  const { user, logout, deleteAddress } = useAuth();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    if (onLogout) onLogout();
  };

  if (!user) {
    return (
      <div className="pb-24 pt-16 px-6 max-w-md mx-auto text-center space-y-4 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-50 text-red-600 flex items-center justify-center">
          <User className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-lg font-black text-neutral-900">Your xyz.com Profile</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Log in to manage delivery addresses and view order history.
          </p>
        </div>
        <button
          id="btn-account-login"
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-red-200 transition-all"
        >
          Login / Sign Up
        </button>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="pb-28 px-4 pt-3 max-w-md mx-auto space-y-4 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/80 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-red-200 uppercase">
          {user.name.slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-black text-neutral-900 truncate">{user.name}</h2>
          <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
            <Phone className="w-3 h-3 text-neutral-400 shrink-0" />
            <span>+91 {user.mobile}</span>
          </div>
          {user.email && (
            <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
              <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation Items */}
      <div className="bg-white rounded-3xl p-2 shadow-sm border border-neutral-200/80 space-y-1">
        <button
          id="btn-account-my-orders"
          onClick={onGoToOrders}
          className="w-full p-3 hover:bg-neutral-50 rounded-2xl flex items-center justify-between text-left transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                My Orders
              </div>
              <div className="text-[10px] text-neutral-400">View active and past orders</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button
          id="btn-account-manage-addresses"
          onClick={() => setIsAddressModalOpen(true)}
          className="w-full p-3 hover:bg-neutral-50 rounded-2xl flex items-center justify-between text-left transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                Saved Addresses ({user.saved_addresses?.length || 0})
              </div>
              <div className="text-[10px] text-neutral-400">Manage delivery locations</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      {/* Saved Addresses Preview */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-neutral-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-neutral-600">
            Delivery Addresses
          </span>
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        </div>

        {user.saved_addresses && user.saved_addresses.length > 0 ? (
          <div className="space-y-2">
            {user.saved_addresses.map(addr => (
              <div
                key={addr.id}
                className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/60 flex items-start justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-neutral-200 text-neutral-700 rounded">
                      {addr.tag}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-700 mt-1 leading-tight">
                    {addr.houseFlat}, {addr.streetArea}, {addr.city} - {addr.pincode}
                  </p>
                </div>
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-[11px] text-neutral-400 hover:text-red-600 font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-400 text-center py-2">No saved addresses yet</p>
        )}
      </div>

      {/* Trust & Guarantee Info */}
      <div className="bg-neutral-50 rounded-3xl p-4 border border-neutral-200/60 space-y-2 text-xs text-neutral-600">
        <div className="flex items-center gap-2 font-bold text-neutral-800">
          <ShieldCheck className="w-4 h-4 text-red-600" />
          <span>xyz.com Consumer Promise</span>
        </div>
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          100% genuine fresh cuts sourced strictly from authorized local poultry retailers. Zero preservatives, hygienic preparation, and direct store-to-door delivery.
        </p>
      </div>

      {/* Logout Button */}
      <button
        id="btn-account-logout"
        onClick={handleLogout}
        className="w-full py-3.5 px-4 bg-white hover:bg-red-50 border border-neutral-200 hover:border-red-200 text-red-600 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-xs"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout from xyz.com</span>
      </button>

      {/* Modals */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
};
