import React from 'react';
import { useShop } from '../context/ShopContext';
import { Header } from '../components/common/Header';
import { Check, Store, CheckCircle } from 'lucide-react';

export const DeliveryAssignedScreen: React.FC = () => {
  const { currentOrder, drivers, selectedDriverId, navigateTo, markOrderDelivered, activeOrderId } = useShop();

  const orderId = currentOrder?.id || activeOrderId || '1025';
  const isSelfDelivery =
    currentOrder?.assignedDriverId === 'self_retailer' ||
    currentOrder?.assignedDriverName?.includes('Self Delivery');

  const selectedBoy =
    drivers.find((b) => b.id === (currentOrder?.assignedDriverId || selectedDriverId)) ||
    drivers[0];

  const boyName = isSelfDelivery
    ? 'Retailer (Self Delivery)'
    : currentOrder?.assignedDriverName || selectedBoy?.name || 'Ravi';

  return (
    <div className="min-h-full pb-24 bg-white flex flex-col justify-between">
      <div>
        {/* Header matching Screen 7 */}
        <Header
          title={isSelfDelivery ? '7. Manual Delivery' : '7. Delivery Assigned'}
          showBack={true}
          onBack={() => navigateTo('assign_delivery')}
        />

        <main className="px-5 py-8 max-w-lg mx-auto flex flex-col items-center text-center space-y-6">
          {/* Subheading text */}
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#6C38CC] text-xs font-bold inline-block mb-2">
              {isSelfDelivery ? 'Manual / Direct Delivery' : 'Driver Assigned'}
            </span>
            <h2 className="text-base font-black text-gray-900 tracking-tight">
              {isSelfDelivery
                ? 'Assigned to Store (Deliver Manually)'
                : `Assigned to ${boyName}`}
            </h2>
          </div>

          {/* Large Green Check Circle Icon */}
          <div className="py-2">
            <div className="w-20 h-20 rounded-full bg-[#22C55E] text-white flex items-center justify-center shadow-md shadow-green-100">
              {isSelfDelivery ? (
                <Store className="w-10 h-10 stroke-[2.5]" />
              ) : (
                <Check className="w-10 h-10 stroke-[3.5]" />
              )}
            </div>
          </div>

          {/* Explanation text */}
          <div className="space-y-1 text-sm text-gray-700 font-normal max-w-xs">
            {isSelfDelivery ? (
              <>
                <p className="font-bold text-gray-900">No delivery boy required.</p>
                <p className="text-xs text-gray-500">
                  You can deliver the package directly to the customer and mark the order completed once delivered.
                </p>
              </>
            ) : (
              <>
                <p>{boyName} has received the order</p>
                <p className="text-xs text-gray-500">and will pick it up soon.</p>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Bottom Buttons */}
      <div className="p-4 max-w-lg mx-auto w-full space-y-2.5">
        {isSelfDelivery && (
          <button
            onClick={() => {
              markOrderDelivered(orderId);
              navigateTo('orders');
            }}
            id="manual-delivered-btn"
            className="w-full py-3.5 px-4 bg-[#6C38CC] hover:bg-[#5B21B6] text-white font-bold text-base rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Mark as Delivered Directly</span>
          </button>
        )}

        <button
          onClick={() => navigateTo('order_status')}
          id="view-order-status-btn"
          className="w-full py-3.5 px-4 bg-white border border-[#6C38CC] hover:bg-purple-50 text-[#6C38CC] font-semibold text-base rounded-xl transition-all flex items-center justify-center cursor-pointer"
        >
          <span>View Order Status</span>
        </button>
      </div>
    </div>
  );
};
