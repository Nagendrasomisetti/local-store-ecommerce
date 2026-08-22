import React from 'react';
import { useShop } from '../context/ShopContext';
import { Header } from '../components/common/Header';
import { TrendingUp, ShoppingBag, CheckCircle, IndianRupee, Clock, ArrowUpRight } from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const { counts, orders } = useShop();

  const salesToday = 12450;
  const averageOrderValue = Math.round(salesToday / 28);

  return (
    <div className="min-h-full pb-24 bg-[#F3F4F6]">
      <Header title="Reports & Analytics" />

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Main Sales Banner */}
        <div className="bg-[#7C3AED] text-white p-5 rounded-xl shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs text-purple-200 font-bold uppercase tracking-wider">
            <span>Today's Total Sales</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-white font-semibold">Live</span>
          </div>
          <div className="text-3xl font-bold tracking-tight">
            ₹{salesToday.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-200 pt-1">
            <TrendingUp className="w-4 h-4 text-emerald-300" />
            <span>+18% higher than yesterday</span>
          </div>
        </div>

        {/* 4-Grid Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-100 p-3.5 rounded-xl space-y-1 shadow-xs">
            <span className="text-xs font-semibold text-gray-500">Total Orders</span>
            <p className="text-xl font-bold text-gray-900">{counts.totalToday}</p>
            <span className="text-[11px] text-emerald-600 font-medium">92% completion rate</span>
          </div>

          <div className="bg-white border border-gray-100 p-3.5 rounded-xl space-y-1 shadow-xs">
            <span className="text-xs font-semibold text-gray-500">Delivered</span>
            <p className="text-xl font-bold text-gray-900">{counts.delivered}</p>
            <span className="text-[11px] text-gray-400 font-medium">Avg delivery 22 mins</span>
          </div>

          <div className="bg-white border border-gray-100 p-3.5 rounded-xl space-y-1 shadow-xs">
            <span className="text-xs font-semibold text-gray-500">Avg Order Value</span>
            <p className="text-xl font-bold text-gray-900">₹{averageOrderValue}</p>
            <span className="text-[11px] text-gray-400 font-medium">Per customer order</span>
          </div>

          <div className="bg-white border border-gray-100 p-3.5 rounded-xl space-y-1 shadow-xs">
            <span className="text-xs font-semibold text-gray-500">Active Fleet</span>
            <p className="text-xl font-bold text-[#7C3AED]">2 Online</p>
            <span className="text-[11px] text-gray-400 font-medium">Ravi, Kumar active</span>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-gray-800 tracking-tight">
            Top Performing Items Today
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="font-semibold text-gray-800">Chicken Breast (1 kg)</span>
              <span className="font-bold text-gray-900">14 Orders (₹4,480)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="font-semibold text-gray-800">Boneless Chicken (1 kg)</span>
              <span className="font-bold text-gray-900">10 Orders (₹3,500)</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="font-semibold text-gray-800">Chicken Curry Cut (1 kg)</span>
              <span className="font-bold text-gray-900">8 Orders (₹2,080)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
