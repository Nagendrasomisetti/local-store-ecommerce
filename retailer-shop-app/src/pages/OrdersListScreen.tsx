import React, { useState } from 'react';
import {
  Menu,
  Search,
  SlidersHorizontal,
  User,
  Phone,
  Clock,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Check,
  X,
  Bike,
  Store,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

export const OrdersListScreen: React.FC = () => {
  const {
    orders,
    ordersFilter,
    setOrdersFilter,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    markOrderDelivered,
    assignManualDelivery,
    navigateTo,
    counts,
    showToast,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [activeMenuOrderId, setActiveMenuOrderId] = useState<string | null>(null);
  const [contactOrder, setContactOrder] = useState<Order | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('Item out of stock');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const tabs: { id: string; label: string; count: number }[] = [
    { id: 'New', label: 'New', count: counts.newOrders },
    { id: 'Preparing', label: 'Preparing', count: counts.preparing },
    { id: 'Assigned', label: 'Assigned to Driver', count: counts.assignedToDriver },
    { id: 'Delivered', label: 'Delivered', count: counts.deliveredOrders },
    { id: 'Rejected', label: 'Rejected', count: counts.rejectedOrders },
  ];

  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (ordersFilter === 'New' && order.status !== 'NEW') return false;
    if (ordersFilter === 'Preparing' && !['PREPARING', 'ACCEPTED'].includes(order.status)) return false;
    if (
      (ordersFilter === 'Assigned' || ordersFilter === 'Assigned to Driver') &&
      !['DELIVERY_ASSIGNED', 'OUT_FOR_DELIVERY'].includes(order.status) &&
      !order.assignedDriverId
    )
      return false;
    if (ordersFilter === 'Delivered' && order.status !== 'DELIVERED') return false;
    if (ordersFilter === 'Rejected' && !['REJECTED', 'CANCELLED'].includes(order.status)) return false;
    if (
      ordersFilter === 'Accepted' &&
      !['ACCEPTED', 'PREPARING', 'READY', 'DELIVERY_ASSIGNED', 'OUT_FOR_DELIVERY'].includes(order.status)
    )
      return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  const handleOrderClick = (orderId: string) => {
    navigateTo('order_info', orderId);
  };

  return (
    <div className="min-h-full bg-[#F7F5FD] flex flex-col font-sans select-none pb-4">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-20 bg-[#F7F5FD]/95 backdrop-blur-xs border-b border-purple-100/60 shadow-2xs">
        {/* Top Header */}
        <header className="px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateTo('dashboard')}
            className="p-1 text-gray-900 hover:text-gray-700 rounded-lg cursor-pointer"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 stroke-[2]" />
          </button>

          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Orders</h1>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="p-1.5 text-gray-900 hover:text-gray-700 rounded-lg cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={() => setShowFilterModal(true)}
              className="p-1.5 text-gray-900 hover:text-gray-700 rounded-lg cursor-pointer"
              aria-label="Filter"
            >
              <SlidersHorizontal className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </header>

        {/* Optional Search Bar */}
        {showSearchInput && (
          <div className="bg-white px-4 py-2 border-t border-b border-gray-100 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order #, customer, or phone..."
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#4F1990]"
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowSearchInput(false);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Horizontal Filter Tabs */}
        <div className="px-4 pt-1 pb-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2.5 min-w-max">
            {tabs.map((tab) => {
              const isActive = ordersFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`orders-tab-${tab.id.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => setOrdersFilter(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    isActive
                      ? 'bg-[#4F1990] text-white shadow-purple-900/10'
                      : 'bg-white text-gray-700 border border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-[#3E1174] text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <main className="p-4 space-y-3.5 flex-1">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-2xs space-y-3">
            <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center mx-auto text-[#6C38CC]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">No {ordersFilter} Orders</h3>
            <p className="text-xs text-gray-400">
              There are currently no orders under the "{ordersFilter}" tab.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              id={`order-card-${order.id}`}
              className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 hover:border-purple-200 transition-all space-y-3 relative"
            >
              {/* Order Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    onClick={() => handleOrderClick(order.id)}
                    className="text-base font-black text-gray-900 cursor-pointer hover:text-[#6C38CC]"
                  >
                    #{order.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.status === 'NEW'
                        ? 'bg-[#FEF3E8] text-[#D97706]'
                        : order.status === 'PREPARING'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : order.status === 'DELIVERY_ASSIGNED' || order.status === 'OUT_FOR_DELIVERY'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : order.status === 'DELIVERED'
                        ? 'bg-purple-50 text-[#6C38CC] border border-purple-100'
                        : order.status === 'REJECTED' || order.status === 'CANCELLED'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {order.status === 'NEW'
                      ? 'New'
                      : order.status === 'PREPARING'
                      ? 'Preparing'
                      : order.status === 'DELIVERY_ASSIGNED' || order.status === 'OUT_FOR_DELIVERY'
                      ? 'Assigned'
                      : order.status === 'DELIVERED'
                      ? 'Delivered'
                      : order.status === 'REJECTED' || order.status === 'CANCELLED'
                      ? 'Rejected'
                      : 'Accepted'}
                  </span>

                  {(order.assignedDriverId === 'self_retailer' || order.assignedDriverName?.includes('Self Delivery')) && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#6C38CC] flex items-center gap-1">
                      <Store className="w-2.5 h-2.5" />
                      Self Delivery
                    </span>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMenuOrderId(activeMenuOrderId === order.id ? null : order.id)
                    }
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-md cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* 3-dots Dropdown */}
                  {activeMenuOrderId === order.id && (
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuOrderId(null);
                          handleOrderClick(order.id);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-gray-700"
                      >
                        View Details
                      </button>
                      {order.status !== 'DELIVERED' && order.status !== 'REJECTED' && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuOrderId(null);
                            assignManualDelivery(order.id);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-[#6C38CC] font-semibold flex items-center gap-1.5"
                        >
                          <Store className="w-3.5 h-3.5" />
                          <span>Deliver Myself</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuOrderId(null);
                          setContactOrder(order);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-gray-700"
                      >
                        Contact Customer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuOrderId(null);
                          setRejectingOrder(order);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600"
                      >
                        Reject Order
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 3 Column Info Section */}
              <div
                onClick={() => handleOrderClick(order.id)}
                className="grid grid-cols-12 gap-2 cursor-pointer pt-1"
              >
                {/* Left Column: Customer & Time (4 cols) */}
                <div className="col-span-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-900">
                    <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-xs font-bold truncate">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-[11px] font-medium text-gray-600">{order.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-[11px] text-gray-500 font-medium">
                      {order.time} • {order.orderDate || 'Today'}
                    </span>
                  </div>
                </div>

                {/* Middle Column: Items (5 cols) */}
                <div className="col-span-5 space-y-1">
                  <span className="text-xs font-bold text-gray-900 block">
                    {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                  </span>
                  <div className="space-y-0.5">
                    {order.items.slice(0, 2).map((item) => (
                      <p key={item.id} className="text-[11px] text-gray-600 truncate font-medium">
                        • {item.name} {item.quantity.split('×')[0].trim()}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-[11px] text-gray-600 truncate font-medium">
                        • {order.items[2].name} {order.items[2].quantity.split('×')[0].trim()}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-[#6C38CC] flex items-center gap-0.5 mt-0.5 hover:underline">
                    View items <ChevronRight className="w-3 h-3 inline" />
                  </span>
                </div>

                {/* Right Column: Price & Delivery badge (3 cols) */}
                <div className="col-span-3 text-right flex flex-col justify-between items-end">
                  <div>
                    <p className="text-sm font-black text-gray-900">
                      ₹{order.total || order.subtotal}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Cash on Delivery</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6C38CC] text-[10px] font-bold mt-1">
                    {order.estimatedDeliveryMins || '15-20 min'}
                  </span>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                {order.status === 'NEW' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setContactOrder(order)}
                      className="flex-1 py-2 px-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span>Contact</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRejectingOrder(order)}
                      className="flex-1 py-2 px-3 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-bold text-gray-600 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <span>Reject</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => acceptOrder(order.id)}
                      className="flex-[1.5] py-2 px-3 bg-[#582C93] hover:bg-[#4A154B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <span>Accept Order</span>
                    </button>
                  </>
                ) : order.status === 'DELIVERED' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setContactOrder(order)}
                      className="flex-1 py-2 px-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span>Contact</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOrderClick(order.id)}
                      className="flex-1 py-2 px-3 bg-white border border-gray-200 hover:bg-purple-50 hover:text-[#6C38CC] rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <span>View Details</span>
                    </button>

                    <div className="flex-[1.2] py-2 px-3 bg-purple-50 text-[#6C38CC] border border-purple-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#6C38CC]" />
                      <span>Delivered</span>
                    </div>
                  </>
                ) : (
                  /* Accepted Order */
                  <>
                    <button
                      type="button"
                      onClick={() => setContactOrder(order)}
                      className="flex-1 py-2 px-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span>Contact</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOrderClick(order.id)}
                      className="flex-1 py-2 px-3 bg-white border border-gray-200 hover:bg-purple-50 hover:text-[#6C38CC] rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <span>View Details</span>
                    </button>

                    {order.assignedDriverId === 'self_retailer' || order.assignedDriverName?.includes('Self Delivery') ? (
                      <button
                        type="button"
                        onClick={() => markOrderDelivered(order.id)}
                        className="flex-[1.4] py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-[0.99]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Delivered</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigateTo('assign_delivery', order.id)}
                        className="flex-[1.4] py-2 px-3 bg-[#4F1990] hover:bg-[#3E1372] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-[0.99]"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Assign to Driver</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Contact Modal */}
      {contactOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Contact Customer</h3>
              <button
                type="button"
                onClick={() => setContactOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6C38CC] font-bold">
                {contactOrder.customerName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{contactOrder.customerName}</p>
                <p className="text-xs text-[#6C38CC] font-semibold">{contactOrder.customerPhone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${contactOrder.customerPhone}`}
                onClick={() => {
                  showToast(`Calling ${contactOrder.customerName}...`, 'info');
                  setContactOrder(null);
                }}
                className="py-2.5 bg-[#6C38CC] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  showToast(`Message sent to ${contactOrder.customerName}`, 'success');
                  setContactOrder(null);
                }}
                className="py-2.5 bg-white border border-[#6C38CC] text-[#6C38CC] font-bold text-xs rounded-xl"
              >
                Send SMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Order Confirmation Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-red-600">Reject Order #{rejectingOrder.id}</h3>
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Please select a reason for rejecting the order from {rejectingOrder.customerName}:
            </p>

            <div className="space-y-2">
              {[
                'Item out of stock',
                'Kitchen at full capacity',
                'Delivery address too far',
                'Store closing soon',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 text-xs font-medium cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="rejectReason"
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
                onClick={() => setRejectingOrder(null)}
                className="py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectOrder(rejectingOrder.id, rejectReason);
                  setRejectingOrder(null);
                }}
                className="py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Filter Orders</h3>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setOrdersFilter(t.id);
                        setShowFilterModal(false);
                      }}
                      className={`py-2 px-3 rounded-xl font-bold ${
                        ordersFilter === t.id
                          ? 'bg-[#6C38CC] text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
