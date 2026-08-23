import React from 'react';
import { useShop } from '../context/ShopContext';
import { Header } from '../components/common/Header';
import { Bike, User, ChevronRight, Store, CheckCircle2 } from 'lucide-react';

export const AssignDeliveryScreen: React.FC = () => {
  const { navigateTo, showToast, currentOrder, activeOrderId, assignManualDelivery, assignDeliveryAgent } = useShop();
  const orderId = currentOrder?.id || activeOrderId || '1025';

  const handleManualSelfDelivery = () => {
    assignManualDelivery(orderId);
  };

  const handleOwnDeliveryBoy = () => {
    navigateTo('own_delivery_boy');
  };

  const handleDeliveryAgent = () => {
    assignDeliveryAgent(orderId);
  };

  return (
    <div className="min-h-full pb-20 bg-white">
      {/* Header matching Screen 5 */}
      <Header
        title="5. Assign Delivery"
        showBack={true}
        onBack={() => navigateTo('ready')}
      />

      <main className="px-5 py-5 max-w-lg mx-auto space-y-4">
        <h2 className="text-sm font-bold text-gray-900 tracking-tight">
          Choose Delivery Option
        </h2>

        <div className="space-y-3 pt-1">
          {/* Option 1: Manual / Self Delivery (Deliver by Retailer) */}
          <div
            id="option-manual-delivery"
            onClick={handleManualSelfDelivery}
            className="bg-purple-50/50 border-2 border-purple-300 hover:border-[#6C38CC] rounded-2xl p-4 shadow-2xs flex items-center justify-between cursor-pointer transition-all duration-150 active:scale-[0.99] group"
          >
            <div className="flex items-center gap-3.5">
              {/* Store Icon in Purple Circle */}
              <div className="w-11 h-11 rounded-full bg-[#6C38CC] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Store className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-gray-900">
                    Manual / Self Delivery
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[#6C38CC] text-[10px] font-bold">
                    Direct
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Deliver directly without any delivery boy
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#6C38CC] group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Option 2: Own Delivery Boy */}
          <div
            id="option-own-delivery-boy"
            onClick={handleOwnDeliveryBoy}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs flex items-center justify-between cursor-pointer transition-all duration-150 active:scale-[0.99] hover:border-purple-200"
          >
            <div className="flex items-center gap-3.5">
              {/* Purple Circle Avatar with Delivery Boy Icon */}
              <div className="w-11 h-11 rounded-full bg-[#F1EEFE] text-[#6C38CC] flex items-center justify-center font-bold shrink-0">
                <Bike className="w-5 h-5 stroke-[2]" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Own Delivery Boy
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Assign to your delivery boy
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Option 3: Delivery Agent */}
          <div
            id="option-delivery-agent"
            onClick={handleDeliveryAgent}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs flex items-center justify-between cursor-pointer transition-all duration-150 active:scale-[0.99] hover:border-orange-200"
          >
            <div className="flex items-center gap-3.5">
              {/* Orange Circle Avatar with Agent Icon */}
              <div className="w-11 h-11 rounded-full bg-[#FEF3E8] text-[#D97706] flex items-center justify-center font-bold shrink-0">
                <User className="w-5 h-5 stroke-[2]" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Delivery Agent
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Find available agents
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </main>
    </div>
  );
};
