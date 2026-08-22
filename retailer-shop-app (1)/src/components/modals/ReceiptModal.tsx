import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Printer, X, Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';

export const ReceiptModal: React.FC = () => {
  const { receiptModalOrder, setReceiptModalOrder, shopProfile, showToast } = useShop();

  if (!receiptModalOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyBillText = () => {
    const text = `
*${shopProfile.shopName}*
------------------------------
Order #${receiptModalOrder.id}
Time: ${receiptModalOrder.time}
Customer: ${receiptModalOrder.customerName} (${receiptModalOrder.customerPhone})
Address: ${receiptModalOrder.address.street}, ${receiptModalOrder.address.city}
------------------------------
ITEMS:
${receiptModalOrder.items.map((i) => `• ${i.name} (${i.quantity}) - ₹${i.price}`).join('\n')}
------------------------------
GRAND TOTAL: ₹${receiptModalOrder.total}
Payment Mode: ${receiptModalOrder.paymentMethod}
Status: ${receiptModalOrder.status}
------------------------------
Thank you for ordering with ${shopProfile.shopName}!
`.trim();

    navigator.clipboard.writeText(text).then(() => {
      showToast('Bill text copied to clipboard! Ready to share.', 'success');
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#A78BFA]" />
            <h3 className="text-sm font-bold">Kitchen & Customer Bill</h3>
          </div>
          <button
            onClick={() => setReceiptModalOrder(null)}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Preview (Thermal style) */}
        <div className="p-5 overflow-y-auto bg-[#FBFBFA] border-b border-gray-200 text-gray-800 font-mono text-xs space-y-3">
          <div className="text-center space-y-1">
            <h2 className="text-base font-extrabold tracking-tight uppercase text-black font-sans">
              {shopProfile.shopName}
            </h2>
            <p className="text-[11px] text-gray-600 font-sans">
              {shopProfile.address}, {shopProfile.city}
            </p>
            <p className="text-[11px] text-gray-600 font-sans">
              Ph: +91 {shopProfile.phone}
            </p>
          </div>

          <div className="border-t border-b border-dashed border-gray-400 py-2 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="font-bold">KOT / Bill #:</span>
              <span>ORD-{receiptModalOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span>{receiptModalOrder.time}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold">{receiptModalOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{receiptModalOrder.customerPhone}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-1.5 py-1">
            <div className="flex justify-between font-bold border-b border-gray-300 pb-1 text-[11px]">
              <span>ITEM</span>
              <span>QTY / AMT</span>
            </div>
            {receiptModalOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-[11px]">
                <div className="pr-2">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-[10px] text-gray-500">{item.quantity}</p>
                </div>
                <span className="font-bold text-gray-900">₹{item.price}</span>
              </div>
            ))}
          </div>

          {/* Grand total */}
          <div className="border-t-2 border-gray-900 pt-2 space-y-1 text-sm">
            <div className="flex justify-between font-bold text-black">
              <span>GRAND TOTAL:</span>
              <span className="text-base">₹{receiptModalOrder.total}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Payment:</span>
              <span className="font-bold uppercase">{receiptModalOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Status:</span>
              <span className="font-bold text-[#7C3AED]">{receiptModalOrder.status}</span>
            </div>
          </div>

          {/* Address note */}
          <div className="bg-gray-100 p-2 rounded text-[10px] text-gray-700 space-y-0.5">
            <span className="font-bold">Delivery Location:</span>
            <p>{receiptModalOrder.address.street}, {receiptModalOrder.address.city} - {receiptModalOrder.address.pincode}</p>
          </div>

          <div className="text-center pt-2 text-[10px] text-gray-500 font-sans">
            *** Thank you for your business! ***
          </div>
        </div>

        {/* Modal footer with action buttons */}
        <div className="p-3 bg-white flex gap-2">
          <button
            onClick={handleCopyBillText}
            className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Text</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-purple-200"
          >
            <Printer className="w-4 h-4" />
            <span>Print Bill</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
