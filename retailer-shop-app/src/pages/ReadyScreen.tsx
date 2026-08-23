import React from 'react';
import { useShop } from '../context/ShopContext';
import { Header } from '../components/common/Header';
import { OrderReadyIllustration } from '../components/common/OrderIllustration';
import { Store, Bike } from 'lucide-react';

export const ReadyScreen: React.FC = () => {
  const { currentOrder, activeOrderId, navigateTo, assignManualDelivery } = useShop();
  const orderId = currentOrder?.id || activeOrderId || '1025';

  const handleAssignDelivery = () => {
    navigateTo('assign_delivery');
  };

  const handleManualSelfDelivery = () => {
    assignManualDelivery(orderId);
  };

  return (
    <div className="min-h-full pb-24 bg-white flex flex-col justify-between">
      <div>
        {/* Header matching Screen 4 */}
        <Header
          title={`4. Order #${orderId}`}
          showBack={true}
          onBack={() => navigateTo('dashboard')}
        />

        <main className="px-5 py-4 max-w-lg mx-auto flex flex-col items-center text-center space-y-6">
          {/* Status Badge */}
          <div className="pt-1">
            <span
              id="order-status-badge-ready"
              className="px-4 py-1 rounded-full bg-[#DBEAFE] text-[#2563EB] text-xs font-semibold"
            >
              Ready
            </span>
          </div>

          {/* Large Takeout Bag Illustration */}
          <div className="py-4 w-full flex items-center justify-center">
            <OrderReadyIllustration className="w-48 h-48" />
          </div>

          {/* Headline Text */}
          <div>
            <p className="text-sm font-medium text-gray-800 tracking-tight">
              Order is ready for delivery
            </p>
          </div>
        </main>
      </div>

      {/* Bottom CTA Buttons */}
      <div className="p-4 max-w-lg mx-auto w-full space-y-2.5">
        <button
          onClick={handleAssignDelivery}
          id="assign-delivery-btn"
          className="w-full py-3.5 px-4 bg-[#6C38CC] hover:bg-[#5B21B6] active:bg-[#4C1D95] text-white font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Bike className="w-5 h-5" />
          <span>Assign Delivery Options</span>
        </button>

        <button
          onClick={handleManualSelfDelivery}
          id="ready-manual-delivery-btn"
          className="w-full py-3 px-4 bg-purple-50 hover:bg-purple-100 text-[#6C38CC] border border-purple-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Store className="w-4 h-4" />
          <span>Deliver Manually (Retailer Direct)</span>
        </button>
      </div>
    </div>
  );
};
