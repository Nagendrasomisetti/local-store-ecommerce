import React, { useState } from 'react';
import {
  Menu,
  Search,
  SlidersHorizontal,
  Plus,
  Phone,
  Bike,
  Star,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Navigation,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Driver } from '../types';

export const DriverScreen: React.FC = () => {
  const {
    drivers,
    toggleDriverStatus,
    addDriver,
    deleteDriver,
    navigateTo,
    counts,
    showToast,
  } = useShop();

  const [filterTab, setFilterTab] = useState<'All' | 'Online' | 'Offline'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDetailsDriver, setSelectedDetailsDriver] = useState<Driver | null>(null);
  const [activeMenuDriverId, setActiveMenuDriverId] = useState<string | null>(null);

  // New Driver ID State
  const [driverIdInput, setDriverIdInput] = useState('');

  const filteredDrivers = drivers.filter((driver) => {
    if (filterTab === 'Online' && driver.status !== 'Online') return false;
    if (filterTab === 'Offline' && driver.status !== 'Offline') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        driver.name.toLowerCase().includes(q) ||
        driver.phone.includes(q) ||
        driver.driverCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverIdInput.trim()) return;
    const success = addDriver(driverIdInput.trim());
    if (success) {
      setDriverIdInput('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="min-h-full bg-[#F6F5FC] flex flex-col font-sans pb-4">
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

        <h1 className="text-lg font-black text-gray-900 tracking-tight">Drivers</h1>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-1.5 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-1.5 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white px-4 border-b border-gray-100 sticky top-[53px] z-10">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
          {[
            { id: 'All' as const, label: 'All Drivers', count: counts.totalDrivers },
            { id: 'Online' as const, label: 'Online', count: counts.onlineDrivers },
            { id: 'Offline' as const, label: 'Offline', count: counts.offlineDrivers },
          ].map((tab) => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={`py-3 flex items-center gap-1.5 text-xs font-bold whitespace-nowrap relative cursor-pointer transition-colors ${
                  isActive ? 'text-[#6C38CC]' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-purple-100 text-[#6C38CC]' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C38CC] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 space-y-3.5 flex-1">
        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Total Drivers */}
          <div className="bg-white rounded-2xl p-3 shadow-2xs border border-gray-100 flex flex-col justify-between">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center mb-1">
              <Bike className="w-4 h-4 text-[#6C38CC]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500">Total Drivers</p>
              <p className="text-xl font-black text-gray-900 mt-0.5">{counts.totalDrivers}</p>
            </div>
          </div>

          {/* Online */}
          <div className="bg-white rounded-2xl p-3 shadow-2xs border border-gray-100 flex flex-col justify-between">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500">Online</p>
              <p className="text-xl font-black text-gray-900 mt-0.5">{counts.onlineDrivers}</p>
            </div>
          </div>

          {/* On Delivery */}
          <div className="bg-white rounded-2xl p-3 shadow-2xs border border-gray-100 flex flex-col justify-between">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center mb-1">
              <Navigation className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500">On Delivery</p>
              <p className="text-xl font-black text-gray-900 mt-0.5">{counts.onDeliveryDrivers}</p>
            </div>
          </div>
        </div>

        {/* Search & Add Driver Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drivers..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#6C38CC] shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#6C38CC] text-[#6C38CC] hover:bg-purple-50 rounded-xl text-xs font-bold shadow-2xs cursor-pointer active:scale-[0.98] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Driver</span>
          </button>
        </div>

        {/* Drivers List */}
        <div className="space-y-3">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              id={`driver-card-${driver.id}`}
              className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 hover:border-purple-200 transition-all space-y-3 relative"
            >
              {/* Driver Top Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                      <img
                        src={driver.avatar}
                        alt={driver.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        driver.status === 'Online' ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-gray-900">{driver.name}</h4>
                      <span className="text-[10px] font-bold text-gray-400">{driver.driverCode}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium">
                      Joined {driver.joinedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      driver.status === 'Online'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {driver.status}
                  </span>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuDriverId(
                          activeMenuDriverId === driver.id ? null : driver.id
                        )
                      }
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuDriverId === driver.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuDriverId(null);
                            toggleDriverStatus(driver.id);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-gray-700"
                        >
                          Set {driver.status === 'Online' ? 'Offline' : 'Online'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuDriverId(null);
                            deleteDriver(driver.id);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600"
                        >
                          Remove Driver
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Driver Stats & Status Info */}
              <div className="grid grid-cols-2 gap-2 bg-gray-50/80 p-2.5 rounded-xl text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                    <Bike className="w-3.5 h-3.5 text-[#6C38CC]" />
                    <span>Current: <strong className="text-gray-900">{driver.currentOrder}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{driver.rating.toFixed(1)} Rating</span>
                  </div>
                </div>

                <div className="space-y-0.5 text-right">
                  <p className="text-[11px] text-gray-500">
                    Total: <strong className="text-gray-900">{driver.totalDeliveries}</strong>
                  </p>
                  <p className="text-[11px] text-emerald-600 font-bold">
                    Completed: {driver.completedDeliveries}
                  </p>
                </div>
              </div>

              {/* Driver Actions Bottom */}
              <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                <a
                  href={`tel:${driver.phone}`}
                  onClick={() => showToast(`Calling ${driver.name} (${driver.phone})...`, 'info')}
                  className="flex-1 py-2 bg-white border border-gray-200 hover:bg-purple-50 hover:border-purple-200 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#6C38CC]" />
                  <span>Call</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedDetailsDriver(driver)}
                  className="flex-1 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-[#6C38CC] flex items-center justify-center gap-1"
                >
                  <span>Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleDriverStatus(driver.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 ${
                    driver.status === 'Online'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <span>{driver.status === 'Online' ? 'Go Offline' : 'Go Online'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Banner */}
        <div className="bg-[#F1EEFE] rounded-2xl p-3.5 border border-purple-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#6C38CC] shadow-2xs shrink-0">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#6C38CC]">Manage your delivery fleet</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Assign orders to online drivers for fast customer delivery.
            </p>
          </div>
        </div>
      </main>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Add New Driver</h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setDriverIdInput('');
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  Driver ID *
                </label>
                <input
                  type="text"
                  value={driverIdInput}
                  onChange={(e) => setDriverIdInput(e.target.value)}
                  placeholder="e.g. DRV-8942"
                  autoFocus
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6C38CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setDriverIdInput('');
                  }}
                  className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 bg-[#582C93] hover:bg-[#4A154B] text-white font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Driver Details Modal */}
      {selectedDetailsDriver && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Driver Profile</h3>
              <button
                type="button"
                onClick={() => setSelectedDetailsDriver(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl">
              <img
                src={selectedDetailsDriver.avatar}
                alt={selectedDetailsDriver.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div>
                <h4 className="text-sm font-black text-gray-900">{selectedDetailsDriver.name}</h4>
                <p className="text-xs text-gray-500 font-medium">{selectedDetailsDriver.driverCode}</p>
                <p className="text-xs text-[#6C38CC] font-bold mt-0.5">{selectedDetailsDriver.phone}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Vehicle Type</span>
                <span className="font-bold text-gray-900">{selectedDetailsDriver.vehicleType || 'Bike'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Vehicle Registration</span>
                <span className="font-bold text-gray-900">{selectedDetailsDriver.vehicleNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Joined Date</span>
                <span className="font-bold text-gray-900">{selectedDetailsDriver.joinedDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Completed Orders</span>
                <span className="font-bold text-emerald-600">{selectedDetailsDriver.completedDeliveries}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Customer Rating</span>
                <span className="font-bold text-amber-500">★ {selectedDetailsDriver.rating.toFixed(1)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDetailsDriver(null)}
              className="w-full py-2.5 bg-[#6C38CC] text-white font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
