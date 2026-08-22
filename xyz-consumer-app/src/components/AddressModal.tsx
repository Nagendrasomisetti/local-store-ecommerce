import React, { useState } from 'react';
import { X, MapPin, Plus, Check } from 'lucide-react';
import { Address } from '../types';
import { useAuth } from '../context/AuthContext';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelected?: (address: Address) => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onAddressSelected,
}) => {
  const { user, addAddress, deleteAddress, selectedAddress, setSelectedAddress } = useAuth();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    mobile: user?.mobile || '',
    houseFlat: '',
    streetArea: '',
    city: 'Rajahmundry',
    pincode: '533101',
    tag: 'Home' as 'Home' | 'Work' | 'Other',
    isDefault: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim()) return setError('Please enter your full name');
    if (!formData.mobile.trim() || formData.mobile.length !== 10) {
      return setError('Please enter a valid 10-digit mobile number');
    }
    if (!formData.houseFlat.trim()) return setError('Please enter house / flat details');
    if (!formData.streetArea.trim()) return setError('Please enter street / area');
    if (!formData.city.trim()) return setError('Please enter city');
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      return setError('Please enter a valid 6-digit pincode');
    }

    try {
      setSaving(true);
      await addAddress(formData);
      setIsAddingNew(false);
      // Reset form
      setFormData({
        fullName: user?.name || '',
        mobile: user?.mobile || '',
        houseFlat: '',
        streetArea: '',
        city: 'Rajahmundry',
        pincode: '533101',
        tag: 'Home',
        isDefault: false,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (addr: Address) => {
    setSelectedAddress(addr);
    if (onAddressSelected) onAddressSelected(addr);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-neutral-900/60 backdrop-blur-xs animate-fade-in p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-100 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">
              {isAddingNew ? 'Add New Delivery Address' : 'Select Delivery Address'}
            </h3>
          </div>
          <button
            id="close-address-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {!isAddingNew ? (
            <div className="space-y-2.5">
              {user?.saved_addresses && user.saved_addresses.length > 0 ? (
                user.saved_addresses.map(addr => {
                  const isSelected = selectedAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelect(addr)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-red-600 bg-red-50/60 shadow-xs ring-1 ring-red-600'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
                            {addr.tag}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-100/70 px-2 py-0.5 rounded-md">
                              Default
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="mt-2 text-xs font-bold text-neutral-900">
                        {addr.fullName} • <span className="text-neutral-500 font-normal">{addr.mobile}</span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                        {addr.houseFlat}, {addr.streetArea}, {addr.city} - {addr.pincode}
                      </p>

                      <div className="mt-2 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px]">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            deleteAddress(addr.id);
                          }}
                          className="text-neutral-400 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                        <span className="text-red-600 font-semibold">
                          {isSelected ? 'Selected' : 'Deliver Here →'}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                  <MapPin className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
                  <p className="text-xs text-neutral-600 font-medium">No saved addresses found</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Add your delivery location to checkout fresh products
                  </p>
                </div>
              )}

              <button
                id="btn-add-new-address-toggle"
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-red-500 hover:bg-red-50/40 text-neutral-700 hover:text-red-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all mt-2"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFormData({ ...formData, tag })}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      formData.tag === tag
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-neutral-200 text-neutral-600 bg-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ravi Teja"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Mobile Number (10 digits)</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">House / Flat / Floor No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Sri Rama Nilayam"
                  value={formData.houseFlat}
                  onChange={e => setFormData({ ...formData, houseFlat: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Street / Area / Landmark</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12 Main Street, Danavaipeta"
                  value={formData.streetArea}
                  onChange={e => setFormData({ ...formData, streetArea: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Rajahmundry"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="533101"
                    value={formData.pincode}
                    onChange={e => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="addr-default-check"
                  checked={formData.isDefault}
                  onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <label htmlFor="addr-default-check" className="text-xs text-neutral-700">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
