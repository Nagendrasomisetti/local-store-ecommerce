import React from 'react';
import { useShop } from '../context/ShopContext';
import { Header } from '../components/common/Header';
import {
  Check,
  Clock,
  Home,
  Bike,
  Phone,
  MessageSquare,
  Printer,
  MapPin,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderStatusScreen: React.FC = () => {
  const {
    currentOrder,
    activeOrderId,
    updateOrderStatus,
    navigateTo,
    showToast,
    setReceiptModalOrder,
    shopProfile,
  } = useShop();

  const order = currentOrder;
  const currentStatus: OrderStatus = order?.status || 'DELIVERY_ASSIGNED';

  // Defined progression steps for order lifecycle
  const steps: { key: OrderStatus; label: string; description: string; time?: string }[] = [
    {
      key: 'NEW',
      label: 'Order Confirmed',
      description: 'Customer placed order via app/online',
      time: order?.time || '12:00 PM',
    },
    {
      key: 'PREPARING',
      label: 'Preparation & Packing',
      description: 'Fresh chicken cut, cleaned, packed & inspected',
    },
    {
      key: 'READY',
      label: 'Ready for Dispatch',
      description: 'Order sealed and kept in pickup bay',
    },
    {
      key: 'DELIVERY_ASSIGNED',
      label: 'Delivery Assigned',
      description: `Assigned to ${order?.assignedDeliveryBoyName || 'Ravi'}`,
    },
    {
      key: 'PICKED_UP',
      label: 'Picked Up by Driver',
      description: `${order?.assignedDeliveryBoyName || 'Ravi'} collected the order from shop`,
    },
    {
      key: 'OUT_FOR_DELIVERY',
      label: 'Out for Delivery',
      description: 'Driver on bike en route to customer doorstep',
    },
    {
      key: 'DELIVERED',
      label: 'Order Delivered',
      description: 'Successfully handed over to customer',
    },
  ];

  // Helper to determine step completion index
  const statusRank: Record<OrderStatus, number> = {
    NEW: 0,
    ACCEPTED: 1,
    PREPARING: 1,
    READY: 2,
    READY_FOR_PICKUP: 3,
    DELIVERY_ASSIGNED: 3,
    PICKED_UP: 4,
    OUT_FOR_DELIVERY: 5,
    DELIVERED: 6,
    CANCELLED: -1,
    REJECTED: -1,
  };

  const currentRank = statusRank[currentStatus] ?? 3;

  const handleAdvanceStatus = (nextStatus: OrderStatus) => {
    if (order) {
      updateOrderStatus(order.id, nextStatus);
      showToast(`Order #${order.id} updated to ${nextStatus.replace('_', ' ')}!`, 'success');
    }
  };

  const handleSendWhatsAppUpdate = () => {
    if (!order) return;
    const text = encodeURIComponent(
      `Update on your order #${order.id} from ${shopProfile.shopName}: Status is now ${order.status.replace(
        '_',
        ' '
      )}. Delivery Partner: ${order.assignedDeliveryBoyName || 'Ravi'}.`
    );
    window.open(`https://wa.me/91${order.customerPhone}?text=${text}`, '_blank');
    showToast('Opening WhatsApp to send live status update...', 'info');
  };

  return (
    <div className="min-h-full pb-28 bg-[#F3F4F6]">
      {/* Header */}
      <Header
        title={`Order #${order?.id || activeOrderId}`}
        showBack={true}
        onBack={() => navigateTo('dashboard')}
        rightAction={
          order ? (
            <button
              onClick={() => setReceiptModalOrder(order)}
              className="p-1.5 text-gray-600 hover:text-[#7C3AED] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-5 h-5" />
            </button>
          ) : null
        }
      />

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Customer & Driver Info Header Card */}
        {order && (
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Customer & Bill
                </span>
                <h2 className="text-base font-bold text-gray-900">
                  {order.customerName}
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  ₹{order.total} • {order.paymentMethod}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Driver
                </span>
                <p className="text-sm font-bold text-[#7C3AED] flex items-center gap-1 justify-end">
                  <Bike className="w-4 h-4" />
                  {order.assignedDeliveryBoyName || 'Ravi'}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold">Online & Active</p>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <a
                href={`tel:${order.customerPhone}`}
                className="py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-gray-200 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Call Customer</span>
              </a>

              <button
                onClick={handleSendWhatsAppUpdate}
                className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-emerald-200 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Live Status</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Delivery Route Visualization */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#7C3AED]" />
              Live Route & Transit Tracker
            </span>
            <span className="text-[11px] font-bold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-full">
              {currentStatus.replace('_', ' ')}
            </span>
          </div>

          {/* Graphical Route bar */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-[11px] font-semibold text-gray-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                {shopProfile.shopName} (Shop)
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
                <MapPin className="w-3 h-3" />
                Customer Destination
              </span>
            </div>

            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-[#7C3AED] transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, (currentRank / 6) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
            Order Lifecycle Events
          </h3>

          <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentRank;
              const isCurrent = idx === currentRank;

              return (
                <div key={`${step.label}-${idx}`} className="relative flex items-start gap-4">
                  {/* Step Node */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center relative z-10 shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-[#10B981] text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[#7C3AED] text-white ring-4 ring-purple-100 shadow-xs'
                        : 'bg-white border-2 border-gray-300 text-transparent'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    )}
                  </div>

                  {/* Step Details */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-sm font-bold ${
                          isCurrent
                            ? 'text-[#7C3AED]'
                            : isCompleted
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </h3>
                      {step.time && (
                        <span className="text-[11px] font-medium text-gray-400">
                          {step.time}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-0.5 ${
                        isCurrent
                          ? 'text-gray-700 font-semibold'
                          : isCompleted
                          ? 'text-gray-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Simulator Progression Controls */}
        <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-4 space-y-2.5">
          <span className="block text-xs font-bold text-gray-800">
            Simulate Live Status Progression:
          </span>
          <div className="flex flex-wrap gap-2">
            {currentRank < 4 && (
              <button
                onClick={() => handleAdvanceStatus('PICKED_UP')}
                className="px-3 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                1. Driver Picked Up from Shop
              </button>
            )}
            {currentRank < 5 && (
              <button
                onClick={() => handleAdvanceStatus('OUT_FOR_DELIVERY')}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                2. Out for Delivery
              </button>
            )}
            {currentRank < 6 && (
              <button
                onClick={() => handleAdvanceStatus('DELIVERED')}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                3. Delivered to Customer
              </button>
            )}
            {currentRank >= 6 && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Order successfully completed & delivered!</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Return to Dashboard */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xs border-t border-gray-100 z-20">
        <div className="max-w-lg mx-auto flex gap-2">
          <button
            onClick={() => order && setReceiptModalOrder(order)}
            className="py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={() => navigateTo('dashboard')}
            className="flex-1 py-3.5 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
