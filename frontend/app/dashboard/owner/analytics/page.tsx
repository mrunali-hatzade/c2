"use client";

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  RefreshCw, 
  Award, 
  PieChart, 
  BarChart2, 
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { getOwnerAnalytics, DashboardAnalytics } from '@/lib/api/shopSettings';

export default function OwnerAnalyticsPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await getOwnerAnalytics();
      setAnalytics(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load analytics';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const salesByDay = analytics?.salesByDay || {};
  const dayValues = daysOrder.map((d) => Number(salesByDay[d] || 0));
  const maxSales = Math.max(...dayValues, 100);

  // Peak Day
  let peakDay = '—';
  let peakAmount = 0;
  Object.entries(salesByDay).forEach(([day, amount]) => {
    if (Number(amount) > peakAmount) {
      peakAmount = Number(amount);
      peakDay = day;
    }
  });

  // Top products
  const topProducts = Object.entries(analytics?.topSellingProducts || {})
    .sort((a, b) => b[1] - a[1]);
  const totalTopUnits = topProducts.reduce((sum, [, count]) => sum + count, 0);

  const totalOrders = analytics?.totalOrders || 0;
  const totalRevenue = Number(analytics?.totalRevenue || 0);
  const aov = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : '0';

  return (
    <div className="space-y-6">

      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Bakery Analytics
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Real-time sales velocity, product demand, and order performance.
          </p>
        </div>

        <button
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#A35742]' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 py-28 flex flex-col items-center justify-center space-y-3 shadow-2xs">
          <div className="w-8 h-8 border-3 border-[#C56E56] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Computing performance metrics...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center space-y-3 shadow-2xs">
          <AlertCircle size={32} className="mx-auto text-rose-500" />
          <p className="text-sm font-bold text-gray-900">Failed to load analytics</p>
          <p className="text-xs text-gray-500">{error}</p>
          <button
            onClick={() => fetchAnalytics()}
            className="px-4 py-2 rounded-xl bg-[#3D101E] text-white text-xs font-bold hover:bg-[#5B1C2E] transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {/* 2. Four KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Revenue</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <p className="text-3xs text-gray-400 mt-1 font-medium">Completed order payments</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Orders</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalOrders}</div>
                <p className="text-3xs text-gray-400 mt-1 font-medium">Lifetime order volume</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Average Order Value</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">₹{aov}</div>
                <p className="text-3xs text-gray-400 mt-1 font-medium">Average ticket size</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Peak Demand Day</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Calendar size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{peakDay}</div>
                <p className="text-3xs text-gray-400 mt-1 font-medium">₹{peakAmount.toFixed(0)} peak sales</p>
              </div>
            </div>

          </div>

          {/* 3. Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sales Velocity Bar Chart */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <BarChart2 size={18} className="text-[#A35742]" />
                    <span>Weekly Sales Velocity</span>
                  </h3>
                  <p className="text-3xs text-gray-400 mt-0.5">Daily breakdown across standard operating days</p>
                </div>
                <span className="text-3xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Real-time Aggregate
                </span>
              </div>

              {/* Bar visualization */}
              <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-2">
                {daysOrder.map((day) => {
                  const val = Number(salesByDay[day] || 0);
                  const heightPercent = Math.max((val / maxSales) * 100, 8);

                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-3xs font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{val.toFixed(0)}
                      </div>
                      <div 
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-[#3D101E] to-[#A35742] transition-all group-hover:brightness-110 shadow-2xs relative"
                      ></div>
                      <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider truncate">
                        {day.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Products Breakdown */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Award size={18} className="text-[#A35742]" />
                  <span>Top-Selling Creations</span>
                </h3>
                <p className="text-3xs text-gray-400 mt-0.5">Most ordered bakery signature items</p>
              </div>

              <div className="space-y-4 py-2">
                {topProducts.map(([name, count], idx) => {
                  const pct = totalTopUnits > 0 ? Math.round((count / totalTopUnits) * 100) : 0;
                  const colors = [
                    'bg-[#3D101E]',
                    'bg-[#A35742]',
                    'bg-[#C56E56]'
                  ];

                  return (
                    <div key={name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-800">{name}</span>
                        <span className="font-semibold text-gray-500 text-3xs">{count} sold ({pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full ${colors[idx % colors.length]}`}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/60 flex items-center justify-between text-3xs text-gray-600">
                <span className="font-medium">Total Signature Units Sold</span>
                <span className="font-bold text-gray-900 text-xs">{totalTopUnits} cakes</span>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
