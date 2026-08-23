import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Header } from '../components/common/Header';
import { Check, ChevronRight, Loader2 } from 'lucide-react';

export const PreparingScreen: React.FC = () => {
  const {
    currentOrder,
    activeOrderId,
    markOrderReady,
    isActionLoading,
    navigateTo,
  } = useShop();

  const order = currentOrder || {
    id: activeOrderId || '1025',
    customerName: 'Rahul',
    customerPhone: '9876543210',
    time: '12:15 PM',
    status: 'PREPARING',
    items: [
      {
        id: 'item-1',
        name: 'Chicken Breast',
        quantity: '1 kg',
        price: 320,
        checked: true,
      },
      {
        id: 'item-2',
        name: 'Boneless Chicken',
        quantity: '1 kg',
        price: 350,
        checked: true,
      },
    ],
    total: 710,
    note: '',
  };

  const [noteText, setNoteText] = useState(order.note || '');

  const handleMarkAsReady = async () => {
    await markOrderReady(order.id, noteText);
  };

  return (
    <div className="min-h-full pb-24 bg-white flex flex-col justify-between">
      <div>
        {/* Header matching Screen 3 */}
        <Header
          title={`Order #${order.id}`}
          showBack={true}
          onBack={() => navigateTo('dashboard')}
        />

        <main className="px-5 py-4 max-w-lg mx-auto space-y-4">
          {/* Status Badge */}
          <div className="flex justify-center pt-1 pb-1">
            <span
              id="order-status-badge-preparing"
              className="px-4 py-1 rounded-full bg-[#FEF3E8] text-[#D97706] text-xs font-semibold"
            >
              Preparing
            </span>
          </div>

          {/* Items Checklist */}
          <div className="space-y-3 pt-1">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-3">
                  {/* Green circular checkmark */}
                  <div className="w-6 h-6 rounded-full bg-[#22C55E] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {item.quantity}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>

          {/* Add Note Section */}
          <div className="space-y-2 pt-6">
            <label
              htmlFor="order-note-input"
              className="block text-sm font-bold text-gray-900"
            >
              Add Note (optional)
            </label>
            <input
              id="order-note-input"
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Don't call too early"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 text-xs font-medium focus:outline-hidden focus:border-[#6C38CC] transition-colors"
            />
          </div>
        </main>
      </div>

      {/* Bottom CTA Button: Mark as Ready */}
      <div className="p-4 max-w-lg mx-auto w-full">
        <button
          onClick={handleMarkAsReady}
          disabled={isActionLoading}
          id="mark-as-ready-btn"
          className="w-full py-3.5 px-4 bg-[#6C38CC] hover:bg-[#5B21B6] active:bg-[#4C1D95] text-white font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isActionLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <span>Mark as Ready</span>
          )}
        </button>
      </div>
    </div>
  );
};
