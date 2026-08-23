import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product, Order } from '../../types';
import { X, Plus, Minus, ShoppingCart, User, Phone, MapPin, IndianRupee } from 'lucide-react';
import { motion } from 'motion/react';

export const CreateOrderModal: React.FC = () => {
  const {
    isCreateOrderModalOpen,
    setIsCreateOrderModalOpen,
    products,
    createNewOrder,
    shopProfile,
    showToast,
    setReceiptModalOrder,
    navigateTo,
  } = useShop();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState(shopProfile.city || 'Rajahmundry');
  const [pincode, setPincode] = useState(shopProfile.pincode || '533101');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Cash on Delivery');
  const [note, setNote] = useState('');
  const [isPickup, setIsPickup] = useState(false);

  // Item quantities map: productId -> count
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  if (!isCreateOrderModalOpen) return null;

  const handleQuantityChange = (productId: string, delta: number) => {
    setItemQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const selectedItemsList = products
    .filter((p) => (itemQuantities[p.id] || 0) > 0)
    .map((p) => ({
      product: p,
      quantityCount: itemQuantities[p.id],
    }));

  const totalAmount = selectedItemsList.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantityCount,
    0
  );

  const handleSubmit = (printReceiptDirectly: boolean = false) => {
    if (selectedItemsList.length === 0) {
      showToast('Please add at least 1 item to the order', 'error');
      return;
    }

    const order = createNewOrder({
      customerName: customerName.trim() || (isPickup ? 'Counter Walk-in' : 'Customer'),
      customerPhone: customerPhone.trim() || '9876500000',
      items: selectedItemsList,
      paymentMethod,
      street: isPickup ? 'Direct Counter Pickup' : street.trim() || 'Main Road',
      city,
      pincode,
      note,
    });

    setIsCreateOrderModalOpen(false);
    // Reset inputs
    setItemQuantities({});
    setCustomerName('');
    setCustomerPhone('');
    setStreet('');
    setNote('');

    if (printReceiptDirectly) {
      setReceiptModalOrder(order);
    } else {
      navigateTo('orders_list');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#7C3AED] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-base font-bold">New POS / Walk-in Order</h2>
          </div>
          <button
            onClick={() => setIsCreateOrderModalOpen(false)}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Order Type Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setIsPickup(false)}
              className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                !isPickup ? 'bg-white text-[#7C3AED] shadow-xs' : 'text-gray-600'
              }`}
            >
              🛵 Home Delivery
            </button>
            <button
              type="button"
              onClick={() => setIsPickup(true)}
              className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                isPickup ? 'bg-white text-[#7C3AED] shadow-xs' : 'text-gray-600'
              }`}
            >
              🏪 Counter Pickup / Takeaway
            </button>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 p-3 rounded-xl space-y-2 border border-gray-100">
            <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">
              Customer Details
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mb-1">
                  <User className="w-3 h-3 text-gray-400" /> Customer Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-[#7C3AED]"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mb-1">
                  <Phone className="w-3 h-3 text-gray-400" /> Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9848012345"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-[#7C3AED]"
                />
              </div>
            </div>

            {!isPickup && (
              <div>
                <label className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-gray-400" /> Delivery Address
                </label>
                <input
                  type="text"
                  placeholder="Street / Flat / Colony name"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-[#7C3AED]"
                />
              </div>
            )}
          </div>

          {/* Select Items from Menu */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">
                Select Menu Items ({products.length} Available)
              </span>
              <span className="text-[11px] text-purple-700 font-bold">
                {selectedItemsList.length} items added
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {products.map((product) => {
                const count = itemQuantities[product.id] || 0;
                return (
                  <div
                    key={product.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      count > 0
                        ? 'border-purple-300 bg-purple-50/40'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center overflow-hidden font-bold">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          '🍗'
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-[10px] text-gray-500 font-semibold">
                          ₹{product.price} / {product.unit}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2">
                      {count > 0 ? (
                        <div className="flex items-center gap-2 bg-white border border-purple-200 px-2 py-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product.id, -1)}
                            className="p-0.5 text-purple-700 hover:bg-purple-100 rounded cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-gray-900 min-w-4 text-center">{count}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product.id, 1)}
                            className="p-0.5 text-purple-700 hover:bg-purple-100 rounded cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(product.id, 1)}
                          className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-bold rounded-lg text-xs cursor-pointer"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">
              Payment Mode
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['Cash on Delivery', 'UPI / QR', 'Paid Online'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMethod(mode)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    paymentMethod === mode
                      ? 'border-[#7C3AED] bg-purple-50 text-[#7C3AED]'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {mode === 'Cash on Delivery' ? '💵 Cash' : mode === 'UPI / QR' ? '📱 UPI / QR' : '💳 Online'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Checkout Button */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-gray-500 font-medium">Grand Total</span>
            <p className="text-xl font-extrabold text-[#7C3AED]">₹{totalAmount}</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="py-2.5 px-3.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold rounded-xl text-xs cursor-pointer"
            >
              Print KOT
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="py-2.5 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-xs shadow-md shadow-purple-200 cursor-pointer"
            >
              Create Order (₹{totalAmount})
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
