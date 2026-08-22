import React from 'react';
import { useShop } from '../context/ShopContext';
import { Header } from '../components/common/Header';
import { Loader2 } from 'lucide-react';

export const OwnDeliveryBoyScreen: React.FC = () => {
  const {
    drivers,
    selectedDriverId,
    setSelectedDriverId,
    currentOrder,
    activeOrderId,
    assignDriver,
    isActionLoading,
    navigateTo,
    showToast,
  } = useShop();

  const selectedBoy = drivers.find((b) => b.id === selectedDriverId) || drivers[0];
  const orderId = currentOrder?.id || activeOrderId || '1025';

  const handleAssign = async () => {
    if (!selectedBoy) {
      showToast('Please select a driver', 'error');
      return;
    }
    await assignDriver(orderId, selectedBoy.id);
  };

  return (
    <div className="min-h-full pb-24 bg-white flex flex-col justify-between">
      <div>
        {/* Header matching Screen 6 */}
        <Header
          title="6. Own Delivery Boy"
          showBack={true}
          onBack={() => navigateTo('assign_delivery')}
        />

        <main className="px-5 py-5 max-w-lg mx-auto space-y-4">
          <h2 className="text-sm font-bold text-gray-900 tracking-tight">
            My Delivery Boys
          </h2>

          <div className="space-y-4 pt-1">
            {drivers.map((boy) => {
              const isSelected = (selectedDriverId || drivers[0]?.id) === boy.id;
              const isOnline = boy.status === 'Online';

              return (
                <div
                  key={boy.id}
                  id={`delivery-boy-item-${boy.id}`}
                  onClick={() => setSelectedDriverId(boy.id)}
                  className="flex items-center justify-between cursor-pointer py-1"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100">
                      <img
                        src={boy.avatar}
                        alt={boy.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {boy.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOnline ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                          }`}
                        />
                        <span className="text-xs text-gray-500 font-medium">
                          {boy.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Radio Selection Indicator */}
                  <div className="pr-1">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-2 border-[#2563EB] bg-white'
                          : 'border-2 border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Bottom CTA Button: Assign to Ravi */}
      <div className="p-4 max-w-lg mx-auto w-full">
        <button
          onClick={handleAssign}
          disabled={isActionLoading}
          id="assign-to-boy-btn"
          className="w-full py-3.5 px-4 bg-[#6C38CC] hover:bg-[#5B21B6] active:bg-[#4C1D95] text-white font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isActionLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Assigning...</span>
            </>
          ) : (
            <span>Assign to {selectedBoy?.name || 'Ravi'}</span>
          )}
        </button>
      </div>
    </div>
  );
};
