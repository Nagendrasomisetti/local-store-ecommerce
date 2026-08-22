import React, { useState } from 'react';
import {
  ChevronLeft,
  Phone,
  MessageSquare,
  MoreVertical,
  MapPin,
  FileText,
  Check,
  X,
  CreditCard,
  Bike,
  Navigation,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderInfoScreen: React.FC = () => {
  const {
    currentOrder,
    acceptOrder,
    rejectOrder,
    markOrderReady,
    assignDriver,
    markOrderDelivered,
    goBack,
    navigateTo,
    showToast,
  } = useShop();

  const [showMapModal, setShowMapModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Item out of stock');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const order = currentOrder;

  if (!order) {
    return (
      <div className="min-h-full bg-[#F6F5FC] p-6 text-center">
        <p className="text-sm font-bold text-gray-700">Order not found.</p>
        <button
          type="button"
          onClick={() => navigateTo('orders')}
          className="mt-4 px-4 py-2 bg-[#6C38CC] text-white rounded-xl text-xs font-bold"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F6F5FC] flex flex-col font-sans pb-4">
      {/* Top Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            className="p-1 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-gray-900 tracking-tight">
                Order #{order.id}
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  order.status === 'NEW'
                    ? 'bg-[#FEF3E8] text-[#D97706]'
                    : order.status === 'DELIVERED'
                    ? 'bg-purple-50 text-[#6C38CC] border border-purple-100'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {order.status === 'NEW'
                  ? 'New Order'
                  : order.status === 'DELIVERED'
                  ? 'Delivered'
                  : 'Accepted'}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              {order.orderDate || 'Today'}, {order.time}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="flex flex-col items-center text-gray-700 hover:text-[#6C38CC] cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span className="text-[9px] font-semibold mt-0.5">Call</span>
          </button>

          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="flex flex-col items-center text-gray-700 hover:text-[#6C38CC] cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[9px] font-semibold mt-0.5">Chat</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="flex flex-col items-center text-gray-700 hover:text-[#6C38CC] cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
              <span className="text-[9px] font-semibold mt-0.5">More</span>
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowMapModal(true);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-gray-700"
                >
                  View Delivery Map
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    showToast('Receipt printed successfully', 'success');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-gray-700"
                >
                  Print KOT / Invoice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowRejectModal(true);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600"
                >
                  Cancel / Reject Order
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-3.5 flex-1">
        {/* Customer & Delivery Card */}
        <section className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <h3 className="text-xs font-black text-gray-900">Customer & Delivery</h3>
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              className="text-xs font-bold text-[#6C38CC] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View on Map</span>
              <Navigation className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Left: Customer */}
            <div className="space-y-1.5 border-r border-gray-100 pr-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#6C38CC] font-bold text-xs">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-gray-900">{order.customerName}</span>
                  </div>
                  {order.isNewCustomer && (
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-bold">
                      New Customer
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium pt-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <span>{order.customerPhone}</span>
              </div>

              <div className="flex items-start gap-1.5 text-[11px] text-gray-400">
                <FileText className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                <span>{order.specialInstructions || 'No special instructions'}</span>
              </div>
            </div>

            {/* Right: Address */}
            <div className="space-y-1 pl-1">
              <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                <MapPin className="w-3.5 h-3.5 text-[#6C38CC]" />
                <span>Delivery Address</span>
              </div>
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                {order.address.street}
                {order.address.colony ? `, ${order.address.colony}` : ''}, {order.address.city},{' '}
                {order.address.state || 'Andhra Pradesh'}, {order.address.pincode}{' '}
                {order.address.country || 'India'}
              </p>
            </div>
          </div>
        </section>

        {/* Order Items Card */}
        <section className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <h3 className="text-xs font-black text-gray-900">
              Order Items ({order.items.length})
            </h3>
            <span className="text-xs font-bold text-[#6C38CC]">2 kg</span>
          </div>

          <div className="space-y-2.5">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=120&auto=format&fit=crop&q=80'
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900">{item.name}</h4>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {item.quantity}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-black text-gray-900">₹{item.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Order Summary Card */}
        <section className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 space-y-3">
          <h3 className="text-xs font-black text-gray-900 border-b border-gray-50 pb-2">
            Order Summary
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Left: Financial breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal ({order.items.length} Items)</span>
                <span>₹{order.subtotal || 670}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee || 40}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Packaging Fee</span>
                <span>₹{order.packagingFee || 0}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-black text-[#582C93]">
                <span>Total</span>
                <span className="text-base">₹{order.total || 710}</span>
              </div>
            </div>

            {/* Right: Payment & Delivery Method */}
            <div className="space-y-2 border-l border-gray-100 pl-3 text-xs">
              <div>
                <p className="text-[10px] text-gray-400 font-medium">Payment Method</p>
                <div className="flex items-center gap-1.5 text-gray-900 font-bold mt-0.5">
                  <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                  <span>{order.paymentMethod}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-medium">Payment Status</p>
                <span className="px-2 py-0.5 rounded-md bg-[#FEF3E8] text-[#D97706] text-[10px] font-bold inline-block mt-0.5">
                  {order.paymentStatus || 'Pending'}
                </span>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-medium">Order Type</p>
                <div className="flex items-center gap-1 text-gray-900 font-bold mt-0.5">
                  <Bike className="w-3.5 h-3.5 text-gray-500" />
                  <span>{order.orderType || 'Delivery'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order Timeline Card */}
        <section className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 space-y-3">
          <h3 className="text-xs font-black text-gray-900 border-b border-gray-50 pb-2">
            Order Timeline
          </h3>

          <div className="space-y-3 relative pl-3">
            <div className="absolute left-[5px] top-1.5 bottom-1.5 w-0.5 bg-purple-100" />

            {/* Step 1 */}
            <div className="flex items-start gap-3 relative">
              <span className="w-2.5 h-2.5 rounded-full bg-[#582C93] ring-4 ring-purple-100 shrink-0 mt-0.5 -ml-[3px]" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900">Order Placed</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#6C38CC] text-[9px] font-bold">
                    Current Status
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  {order.time} • {order.orderDate || 'Today'}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 relative">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-200 shrink-0 mt-0.5 -ml-[3px]" />
              <div>
                <span className="text-xs font-bold text-gray-600">Awaiting confirmation</span>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  Accept the order to start processing
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white border-t border-gray-100 p-3 shadow-md sticky bottom-0 z-20">
        <div className="flex items-center gap-2">
          {/* Contact */}
          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="flex-1 py-2.5 px-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
            <span>Contact</span>
          </button>

          {/* Reject button only for NEW orders */}
          {order.status === 'NEW' && (
            <button
              type="button"
              onClick={() => setShowRejectModal(true)}
              className="flex-1 py-2.5 px-3 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
            >
              <X className="w-3.5 h-3.5 text-red-600" />
              <span>Reject</span>
            </button>
          )}

          {/* Accept or Advance Status */}
          {order.status === 'NEW' ? (
            <button
              type="button"
              onClick={() => acceptOrder(order.id)}
              className="flex-[1.5] py-2.5 px-3 bg-[#582C93] hover:bg-[#4A154B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept Order</span>
            </button>
          ) : order.status === 'DELIVERED' ? (
            <div className="flex-[1.5] py-2.5 px-3 bg-purple-50 text-[#6C38CC] border border-purple-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#6C38CC]" />
              <span>Delivered</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => markOrderDelivered(order.id)}
              className="flex-[1.5] py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Delivered</span>
            </button>
          )}
        </div>
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Delivery Route & Location</h3>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Mock Map View */}
            <div className="w-full h-48 bg-slate-100 rounded-2xl overflow-hidden relative border border-gray-200 flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#6C38CC_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="text-center space-y-1 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#6C38CC] text-white flex items-center justify-center mx-auto shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-xs font-black text-gray-900">12 Main Street, Rajahmundry</p>
                <p className="text-[10px] text-gray-500 font-medium">Distance: 2.4 km (approx 15 mins)</p>
              </div>
            </div>

            <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl space-y-1">
              <p className="font-bold text-gray-900">Delivery Instructions:</p>
              <p className="text-[11px] text-gray-500">Ring doorbell twice upon arrival.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowMapModal(false)}
              className="w-full py-2 bg-[#6C38CC] text-white text-xs font-bold rounded-xl"
            >
              Close Map
            </button>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Contact {order.customerName}</h3>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Reach out to {order.customerName} regarding order #{order.id}.
            </p>
            <div className="space-y-2">
              <a
                href={`tel:${order.customerPhone}`}
                onClick={() => {
                  showToast(`Calling ${order.customerPhone}...`, 'info');
                  setShowContactModal(false);
                }}
                className="w-full py-2.5 bg-[#6C38CC] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call {order.customerPhone}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  showToast('Message sent to customer', 'success');
                  setShowContactModal(false);
                }}
                className="w-full py-2.5 bg-white border border-[#6C38CC] text-[#6C38CC] font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send SMS Message</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <h3 className="text-base font-bold text-red-600">Reject Order #{order.id}</h3>
            <p className="text-xs text-gray-600">Select reason for cancellation:</p>
            <div className="space-y-2">
              {[
                'Item out of stock',
                'Kitchen at full capacity',
                'Delivery address out of area',
                'Store closed',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 text-xs font-medium cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="modalRejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="text-[#6C38CC]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectOrder(order.id, rejectReason);
                  setShowRejectModal(false);
                  goBack();
                }}
                className="py-2 bg-red-600 text-white font-bold text-xs rounded-xl"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
