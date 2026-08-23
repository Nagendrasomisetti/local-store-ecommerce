import React, { useState } from 'react';
import {
  Menu,
  Store,
  Clock,
  MapPin,
  CreditCard,
  Bell,
  Globe,
  Volume2,
  VolumeX,
  Moon,
  Headphones,
  FileText,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Pencil,
  Camera,
  User,
  Phone,
  Building2,
  Check,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SettingsScreen: React.FC = () => {
  const {
    shopProfile,
    updateShopProfile,
    isShopOpen,
    toggleShopStatus,
    soundEnabled,
    toggleSound,
    logout,
    navigateTo,
    showToast,
  } = useShop();

  const [language, setLanguage] = useState('English');
  const [showLangModal, setShowLangModal] = useState(false);
  const [showTimingModal, setShowTimingModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Edit Profile Form State
  const [editShopName, setEditShopName] = useState(shopProfile.shopName || 'Sun Chicken');
  const [editOwnerName, setEditOwnerName] = useState(shopProfile.ownerName || 'Venkatesh Rao');
  const [editPhone, setEditPhone] = useState(shopProfile.phone || '9876501234');
  const [editAddress, setEditAddress] = useState(shopProfile.address || '12 Main Street');
  const [editColony, setEditColony] = useState(shopProfile.colony || 'Raghavendra Colony');
  const [editCity, setEditCity] = useState(shopProfile.city || 'Rajahmundry');
  const [editPincode, setEditPincode] = useState(shopProfile.pincode || '533101');
  const [editFssai, setEditFssai] = useState(shopProfile.fssaiNumber || '10123456789012');
  const [editGstin, setEditGstin] = useState(shopProfile.gstin || '37AAAAA0000A1Z5');
  const [editLogo, setEditLogo] = useState(
    shopProfile.logo || 'https://images.unsplash.com/photo-1548869206-93b036288d7e?w=140&auto=format&fit=crop&q=80'
  );

  const handleOpenEditModal = () => {
    setEditShopName(shopProfile.shopName || 'Sun Chicken');
    setEditOwnerName(shopProfile.ownerName || 'Venkatesh Rao');
    setEditPhone(shopProfile.phone || '9876501234');
    setEditAddress(shopProfile.address || '12 Main Street');
    setEditColony(shopProfile.colony || 'Raghavendra Colony');
    setEditCity(shopProfile.city || 'Rajahmundry');
    setEditPincode(shopProfile.pincode || '533101');
    setEditFssai(shopProfile.fssaiNumber || '10123456789012');
    setEditGstin(shopProfile.gstin || '37AAAAA0000A1Z5');
    setEditLogo(
      shopProfile.logo || 'https://images.unsplash.com/photo-1548869206-93b036288d7e?w=140&auto=format&fit=crop&q=80'
    );
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editShopName.trim()) {
      showToast('Please enter shop name', 'error');
      return;
    }
    updateShopProfile({
      shopName: editShopName.trim(),
      ownerName: editOwnerName.trim(),
      phone: editPhone.trim(),
      address: editAddress.trim(),
      colony: editColony.trim(),
      city: editCity.trim(),
      pincode: editPincode.trim(),
      fssaiNumber: editFssai.trim(),
      gstin: editGstin.trim(),
      logo: editLogo,
    });
    setShowEditProfileModal(false);
  };

  return (
    <div className="min-h-full bg-[#F6F5FC] flex flex-col font-sans pb-6">
      {/* Top Header */}
      <header className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20 shadow-2xs">
        <button
          type="button"
          onClick={() => navigateTo('dashboard')}
          className="p-1 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-black text-gray-900 tracking-tight">Settings</h1>

        <div className="w-6" />
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-3.5 flex-1">
        {/* Store Profile Card */}
        <section className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-100 bg-purple-50 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src={shopProfile.logo || "https://images.unsplash.com/photo-1548869206-93b036288d7e?w=140&auto=format&fit=crop&q=80"}
                  alt={shopProfile.shopName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-black text-gray-900 truncate">
                  {shopProfile.shopName || 'Sun Chicken'}
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Shop ID: <span className="font-bold text-gray-700">{shopProfile.shopId}</span>
                </p>
                <p className="text-[11px] text-gray-400 font-medium truncate">
                  {shopProfile.address ? `${shopProfile.address}${shopProfile.colony ? `, ${shopProfile.colony}` : ''}` : '12 Main Street'}
                </p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              type="button"
              id="edit-retailer-profile-btn"
              onClick={handleOpenEditModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#6C38CC] rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-[0.97] border border-purple-100"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">Store Operational Status</span>
            <button
              type="button"
              onClick={toggleShopStatus}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isShopOpen
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
              }`}
            >
              <span>{isShopOpen ? 'Store Open' : 'Store Closed'}</span>
            </button>
          </div>
        </section>

        {/* Section 1: Store Management */}
        <section className="bg-white rounded-2xl p-3 shadow-2xs border border-gray-100 space-y-1">
          <h3 className="text-xs font-black text-gray-400 px-3 py-1.5">
            Store Management
          </h3>

          {/* Store Timing */}
          <div
            onClick={() => setShowTimingModal(true)}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6C38CC]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Store Timing & Hours</h4>
                <p className="text-[11px] text-gray-500 font-medium">{shopProfile.timings || '07:00 AM - 09:00 PM'}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Delivery Settings */}
          <div
            onClick={() => setShowDeliveryModal(true)}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6C38CC]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Delivery Radius & Charges</h4>
                <p className="text-[11px] text-gray-500 font-medium">Within 5.0 km • ₹40 base fee</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Payment & Payouts */}
          <div
            onClick={() => {}}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6C38CC]">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Payment & Bank Account</h4>
                <p className="text-[11px] text-gray-500 font-medium">HDFC Bank • Daily Payout</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </section>

        {/* Section 2: App Preferences */}
        <section className="bg-white rounded-2xl p-3 shadow-2xs border border-gray-100 space-y-1">
          <h3 className="text-xs font-black text-gray-400 px-3 py-1.5">
            App Preferences
          </h3>

          {/* Language */}
          <div
            onClick={() => setShowLangModal(true)}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6C38CC]">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Language</h4>
                <p className="text-[11px] text-gray-500 font-medium">{language}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Sound Alerts */}
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6C38CC]">
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Order Alert Sound</h4>
                <p className="text-[11px] text-gray-500 font-medium">
                  {soundEnabled ? 'Loud Chime Enabled' : 'Muted'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                soundEnabled ? 'bg-[#582C93]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Section 3: Help & Support */}
        <section className="bg-white rounded-2xl p-3 shadow-2xs border border-gray-100 space-y-1">
          <h3 className="text-xs font-black text-gray-400 px-3 py-1.5">
            Help & Support
          </h3>

          <div
            onClick={() => setShowSupportModal(true)}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6C38CC]">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Partner Helpdesk & WhatsApp</h4>
                <p className="text-[11px] text-gray-500 font-medium">+91 98765 43210 (24x7)</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div
            onClick={() => {}}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6C38CC]">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Terms & Retailer Agreement</h4>
                <p className="text-[11px] text-gray-500 font-medium">Standard terms & commission</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </section>

        {/* Logout Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={logout}
            className="w-full py-3 px-4 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from Store</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-[11px] text-gray-400 font-medium">Retailer Shop v1.0.0 • Connected</p>
        </div>
      </main>

      {/* Language Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <h3 className="text-base font-bold text-gray-900">Select App Language</h3>
            <div className="space-y-2">
              {['English', 'తెలుగు (Telugu)', 'हिंदी (Hindi)', 'தமிழ் (Tamil)'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setLanguage(lang);
                    setShowLangModal(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-bold border transition-colors ${
                    language === lang
                      ? 'border-[#6C38CC] bg-purple-50 text-[#6C38CC]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Partner Helpdesk</h3>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Need assistance with orders, inventory, or driver assignments?
            </p>
            <div className="space-y-2">
              <a
                href="tel:9876543210"
                className="w-full py-2.5 bg-[#6C38CC] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Headphones className="w-4 h-4" />
                <span>Call Partner Hotline (+91 98765 43210)</span>
              </a>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Retailer Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Edit Retailer Profile</h3>
                <p className="text-xs text-gray-400 font-medium">Update store details and contact information</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              {/* Logo / Avatar Preview & Selector */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Shop Photo / Logo</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-purple-200 bg-purple-50 shrink-0 shadow-2xs">
                    <img
                      src={editLogo}
                      alt="Shop Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="url"
                      value={editLogo}
                      onChange={(e) => setEditLogo(e.target.value)}
                      placeholder="Image URL (e.g. https://...)"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium text-gray-800 text-xs"
                    />
                    <p className="text-[10px] text-gray-400">Paste an image link or leave default photo</p>
                  </div>
                </div>
              </div>

              {/* Shop Name */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Store / Shop Name *</label>
                <input
                  type="text"
                  value={editShopName}
                  onChange={(e) => setEditShopName(e.target.value)}
                  placeholder="e.g. Sun Chicken"
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-900 text-sm focus:outline-none focus:border-[#6C38CC]"
                />
              </div>

              {/* Owner Name & Phone */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={editOwnerName}
                    onChange={(e) => setEditOwnerName(e.target.value)}
                    placeholder="e.g. Venkatesh Rao"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="10-digit phone"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium text-gray-900"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Street Address / Door No.</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="e.g. 12 Main Street"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium text-gray-900"
                />
              </div>

              {/* Colony / Locality */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Colony / Locality</label>
                <input
                  type="text"
                  value={editColony}
                  onChange={(e) => setEditColony(e.target.value)}
                  placeholder="e.g. Raghavendra Colony"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium text-gray-900"
                />
              </div>

              {/* City & Pincode */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder="e.g. Rajahmundry"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={editPincode}
                    onChange={(e) => setEditPincode(e.target.value)}
                    placeholder="533101"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium text-gray-900"
                  />
                </div>
              </div>

              {/* Business Registration Details */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">FSSAI Number</label>
                  <input
                    type="text"
                    value={editFssai}
                    onChange={(e) => setEditFssai(e.target.value)}
                    placeholder="14-digit FSSAI"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={editGstin}
                    onChange={(e) => setEditGstin(e.target.value)}
                    placeholder="15-digit GSTIN"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-700 text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 bg-[#6C38CC] hover:bg-[#5B21B6] text-white font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
