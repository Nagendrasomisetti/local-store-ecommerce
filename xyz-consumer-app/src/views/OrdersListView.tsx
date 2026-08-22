import React, { useState, useEffect } from 'react';
import { Package, Store, Clock, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface OrdersListViewProps {
  onSelectOrder: (orderId: string) => void;
  onExploreShops: () => void;
  onOpenAuth: () => void;
}

export const OrdersListView: React.FC<OrdersListViewProps> = ({
  onSelectOrder,
  onExploreShops,
  onOpenAuth,
}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    const sse = new EventSource(`/api/events?role=CONSUMER&userId=${user.id}`);
    sse.onmessage = () => {
      loadOrders();
    };
    return () => sse.close();
  }, [user?.id]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="pb-24 pt-16 px-6 max-w-md mx-auto text-center space-y-4 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-50 text-red-600 flex items-center justify-center">
          <Package className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-lg font-black text-neutral-900">Sign in to view your orders</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Track active deliveries and view previous orders from local shops.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-red-200 transition-all"
        >
          Login / Sign Up
        </button>
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status !== 'Delivered');
  const pastOrders = orders.filter(o => o.status === 'Delivered');
  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <div className="pb-28 px-4 pt-3 max-w-md mx-auto space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-black text-neutral-900 tracking-tight">Your Orders</h1>
        <span className="text-xs text-neutral-500 font-medium">
          {orders.length} total orders
        </span>
      </div>

      {/* Tabs */}
      <div className="flex bg-neutral-100 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'active'
              ? 'bg-white text-red-600 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Active Orders ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'past'
              ? 'bg-white text-red-600 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Past Orders ({pastOrders.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-32 bg-neutral-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200/80 p-6 space-y-3">
          <ShoppingBag className="w-12 h-12 mx-auto text-neutral-300" />
          <div>
            <h3 className="text-xs font-bold text-neutral-700">
              {activeTab === 'active' ? 'No active orders right now' : 'No past orders yet'}
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Order fresh chicken cuts from trusted local shops.
            </p>
          </div>
          <button
            onClick={onExploreShops}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-colors"
          >
            Explore Shops
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedOrders.map(order => {
            const dateStr = new Date(order.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                id={`order-card-${order.order_id}`}
                onClick={() => onSelectOrder(order.id)}
                className="p-4 bg-white rounded-3xl border border-neutral-200/80 hover:border-red-300 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-neutral-900 group-hover:text-red-600 transition-colors">
                      {order.order_id}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium">• {dateStr}</span>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-neutral-100 text-neutral-700'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100 animate-pulse'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-neutral-900 truncate">
                      {order.shop_name}
                    </h3>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {order.items.map(i => `${i.quantity}x ${i.product_name}`).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-neutral-500">Total: </span>
                    <span className="font-black text-neutral-900">₹{order.total}</span>
                    <span className="text-[10px] text-neutral-400 ml-1">({order.payment_method})</span>
                  </div>

                  <div className="text-xs font-bold text-red-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{order.status === 'Delivered' ? 'View Details' : 'Track Order'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
