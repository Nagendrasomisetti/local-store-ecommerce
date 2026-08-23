import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { DeliveryBoy } from '../../types';
import { X, Bike, User, Phone, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface AddDeliveryBoyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDeliveryBoyModal: React.FC<AddDeliveryBoyModalProps> = ({ isOpen, onClose }) => {
  const { addDriver, showToast } = useShop();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<DeliveryBoy['vehicleType']>('Bike');
  const [vehicleNumber, setVehicleNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter delivery boy name', 'error');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    addDriver({
      name: name.trim(),
      phone: phone.trim(),
      vehicleType,
      vehicleNumber: vehicleNumber.trim() || 'AP 05 AB 1234',
    });

    setName('');
    setPhone('');
    setVehicleNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="bg-[#7C3AED] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="w-5 h-5" />
            <h3 className="text-sm font-bold">Add Delivery Partner</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div>
            <label className="text-gray-600 font-semibold mb-1 block">Full Name</label>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#7C3AED] focus-within:bg-white">
              <User className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. Ramesh Varma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600 font-semibold mb-1 block">Phone Number</label>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#7C3AED] focus-within:bg-white">
              <Phone className="w-4 h-4 text-gray-400" />
              <input
                type="tel"
                placeholder="e.g. 9848012345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600 font-semibold mb-1 block">Vehicle Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Bike', 'Scooter', 'EV'] as const).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setVehicleType(type)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    vehicleType === type
                      ? 'border-[#7C3AED] bg-purple-50 text-[#7C3AED]'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  {type === 'Bike' ? '🏍️ Bike' : type === 'Scooter' ? '🛵 Scooter' : '⚡ EV'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-600 font-semibold mb-1 block">Vehicle Reg. Number (Optional)</label>
            <input
              type="text"
              placeholder="e.g. AP 05 BR 5678"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-[#7C3AED] focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-200 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Register Delivery Partner</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
