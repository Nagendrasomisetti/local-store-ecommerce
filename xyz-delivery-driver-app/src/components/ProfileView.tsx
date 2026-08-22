import React, { useState } from 'react';
import { useDriver } from '../context/DriverContext';
import { VehicleType } from '../types';
import { 
  User, 
  Bike, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Star, 
  LogOut, 
  Edit3, 
  KeyRound, 
  History, 
  Wallet, 
  HelpCircle, 
  RotateCcw, 
  Check, 
  Users,
  Sparkles
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    currentDriver, 
    registeredDrivers, 
    updateProfile, 
    switchDriverAccount, 
    logout, 
    setActiveTab,
    resetDemoData
  } = useDriver();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentDriver?.full_name || '');
  const [editMobile, setEditMobile] = useState(currentDriver?.mobile || '');
  const [editCity, setEditCity] = useState(currentDriver?.city || 'Rajahmundry');
  const [editVehicleType, setEditVehicleType] = useState<VehicleType>(currentDriver?.vehicle_type || 'Bike');
  const [editVehicleNumber, setEditVehicleNumber] = useState(currentDriver?.vehicle_number || 'AP 05 AB 1234');
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  if (!currentDriver) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: editName,
      mobile: editMobile,
      city: editCity,
      vehicle_type: editVehicleType,
      vehicle_number: editVehicleNumber,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Driver Profile
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Account details and delivery preferences
        </p>
      </div>

      {/* Driver Identity Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center relative overflow-hidden">
        {/* Avatar */}
        <div className="relative inline-block mx-auto mb-3">
          <div className="w-20 h-20 rounded-full bg-slate-100 border-3 border-blue-600 overflow-hidden flex items-center justify-center text-slate-700 font-bold text-2xl shadow-md">
            {currentDriver.avatar_url ? (
              <img src={currentDriver.avatar_url} alt={currentDriver.full_name} className="w-full h-full object-cover" />
            ) : (
              currentDriver.full_name.charAt(0)
            )}
          </div>
          <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
            currentDriver.online_status ? 'bg-emerald-500' : 'bg-slate-400'
          }`} />
        </div>

        <h2 className="text-lg font-extrabold text-slate-900">
          {currentDriver.full_name}
        </h2>
        <p className="text-xs font-bold text-blue-600 mt-0.5">
          @{currentDriver.username}
        </p>

        {/* Rating & Deliveries Badge */}
        <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{currentDriver.rating} Rating</span>
          </div>

          <div className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
            <span>{currentDriver.total_deliveries_count} Deliveries</span>
          </div>
        </div>
      </div>

      {/* Account Information List */}
      {!isEditing ? (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Profile Information
            </h3>
            <button
              onClick={() => {
                setEditName(currentDriver.full_name);
                setEditMobile(currentDriver.mobile);
                setEditCity(currentDriver.city);
                setEditVehicleType(currentDriver.vehicle_type);
                setEditVehicleNumber(currentDriver.vehicle_number);
                setIsEditing(true);
              }}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Mobile
              </span>
              <span className="font-bold text-slate-900">{currentDriver.mobile}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email
              </span>
              <span className="font-bold text-slate-900">{currentDriver.email}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                City
              </span>
              <span className="font-bold text-slate-900">{currentDriver.city}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 text-slate-400" />
                Vehicle
              </span>
              <span className="font-bold text-slate-900">
                {currentDriver.vehicle_type} ({currentDriver.vehicle_number})
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Profile Form */
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase">Edit Profile</h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              value={editMobile}
              onChange={(e) => setEditMobile(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vehicle Type</label>
              <select
                value={editVehicleType}
                onChange={(e) => setEditVehicleType(e.target.value as VehicleType)}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              >
                <option value="Bike">Bike</option>
                <option value="Scooter">Scooter</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Vehicle Plate Number</label>
            <input
              type="text"
              value={editVehicleNumber}
              onChange={(e) => setEditVehicleNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Action Options List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
        <button
          onClick={() => setActiveTab('earnings')}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-slate-700 font-bold">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>Driver Earnings</span>
          </div>
          <span className="text-slate-400">→</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-slate-700 font-bold">
            <History className="w-4 h-4 text-blue-600" />
            <span>Delivery History</span>
          </div>
          <span className="text-slate-400">→</span>
        </button>

        <button
          onClick={() => setShowSwitchModal(true)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-slate-700 font-bold">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Switch Driver Account (Demo)</span>
          </div>
          <span className="text-slate-400">→</span>
        </button>

        <button
          onClick={resetDemoData}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-amber-700 font-bold">
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Reset Demo Data</span>
          </div>
          <span className="text-amber-500">Reset</span>
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full py-3.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout from XYZ Driver</span>
      </button>

      {/* Switch Driver Account Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">Switch Registered Driver</h3>
            <p className="text-xs text-slate-500 mb-3">Choose an account to test different driver perspectives:</p>

            <div className="space-y-2 mb-4">
              {registeredDrivers.map((driver) => (
                <div
                  key={driver.driver_id}
                  onClick={() => {
                    switchDriverAccount(driver.driver_id);
                    setShowSwitchModal(false);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    driver.driver_id === currentDriver.driver_id
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{driver.full_name}</h4>
                    <p className="text-[11px] text-slate-500">@{driver.username} • {driver.city} ({driver.vehicle_type})</p>
                  </div>
                  {driver.driver_id === currentDriver.driver_id && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSwitchModal(false)}
              className="w-full py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
