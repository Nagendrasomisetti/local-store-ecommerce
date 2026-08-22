import React from 'react';
import { Check, Clock, PackageCheck, ChefHat, Bike, Gift, AlertCircle } from 'lucide-react';
import { OrderStatus, OrderStatusHistoryItem } from '../types';

interface StatusStepperProps {
  currentStatus: OrderStatus;
  history?: OrderStatusHistoryItem[];
}

const STEPS: { status: OrderStatus; label: string; icon: React.FC<{ className?: string }> }[] = [
  { status: 'Order Placed', label: 'Order Confirmed', icon: Check },
  { status: 'Shop Accepted', label: 'Shop Accepted', icon: Clock },
  { status: 'Preparing', label: 'Preparing Fresh Cuts', icon: ChefHat },
  { status: 'Packed', label: 'Packed & Sealed', icon: PackageCheck },
  { status: 'Out for Delivery', label: 'Out for Delivery', icon: Bike },
  { status: 'Delivered', label: 'Delivered', icon: Gift },
];

export const StatusStepper: React.FC<StatusStepperProps> = ({ currentStatus, history = [] }) => {
  const currentIndex = STEPS.findIndex(s => s.status === currentStatus);

  const getTimestampForStatus = (status: OrderStatus) => {
    const entry = history.find(h => h.status === status);
    if (!entry) return null;
    const date = new Date(entry.timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="py-2">
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200">
        {STEPS.map((step, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;
          const time = getTimestampForStatus(step.status);
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative flex items-start group">
              {/* Step indicator circle */}
              <div
                className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs transition-all ring-4 ring-white ${
                  isPassed
                    ? 'bg-emerald-500 shadow-xs'
                    : isCurrent
                    ? 'bg-emerald-600 shadow-md ring-emerald-100 animate-pulse'
                    : 'bg-neutral-300 text-neutral-500'
                }`}
              >
                {isPassed ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isCurrent ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>

              {/* Status details */}
              <div className="ml-3 flex-1 flex items-baseline justify-between">
                <div>
                  <div
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-emerald-700 font-extrabold text-sm'
                        : isPassed
                        ? 'text-neutral-800'
                        : 'text-neutral-400'
                    }`}
                  >
                    {step.label}
                  </div>
                  {isCurrent && (
                    <span className="text-[11px] text-emerald-600 font-medium inline-block mt-0.5">
                      In progress right now...
                    </span>
                  )}
                </div>

                {/* Time or state */}
                {time && (
                  <span className="text-[10px] font-semibold text-neutral-400">
                    {time}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
