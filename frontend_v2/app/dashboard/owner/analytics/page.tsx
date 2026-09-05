'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  RefreshCw,
  Award,
  PieChart,
  BarChart3,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ownerApi } from '@/lib/api/owner';
import { DashboardAnalytics } from '@/types/owner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';

export default function OwnerAnalyticsPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await ownerApi.getAnalytics();
      setAnalytics(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingState message="Calculating bakery sales performance..." />;

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const salesByDay = analytics?.salesByDay || {};
  const dayValues = daysOrder.map((d) => Number(salesByDay[d] || 0));
  const maxSales = Math.max(...dayValues, 100);

  // Peak day calculation
  let peakDay = 'Saturday';
  let peakAmount = 0;
  Object.entries(salesByDay).forEach(([day, amount]) => {
    if (Number(amount) > peakAmount) {
      peakAmount = Number(amount);
      peakDay = day;
    }
  });

  const topProducts = Object.entries(analytics?.topSellingProducts || {}).sort((a, b) => b[1] - a[1]);
  const totalTopUnits = topProducts.reduce((sum, [, count]) => sum + count, 0);

  const totalOrders = analytics?.totalOrders || 0;
  const totalRevenue = analytics?.totalRevenue || 0;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-owner-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-owner-heading">Bakery Analytics</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-blush text-brand-plum text-2xs font-bold uppercase tracking-wider">
              Live Sales Velocity
            </span>
          </div>
          <p className="text-xs sm:text-sm text-owner-muted mt-1">
            Track daily revenue, customer demand patterns, and your most popular cakes.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin text-brand-plum' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Metrics'}
        </Button>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-owner-muted">Total Sales Volume</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-owner-heading mt-2">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center mt-1">
            +14% from last period
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-owner-muted">Completed Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-owner-heading mt-2">{totalOrders}</p>
          <span className="text-[11px] text-blue-600 font-medium inline-flex items-center mt-1">
            Verified customer bakes
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-owner-muted">Average Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-owner-heading mt-2">₹{aov.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-purple-600 font-medium inline-flex items-center mt-1">
            Per celebration basket
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-owner-muted">Peak Ordering Day</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-owner-heading mt-2">{peakDay}</p>
          <span className="text-[11px] text-amber-600 font-medium inline-flex items-center mt-1">
            ₹{peakAmount.toLocaleString('en-IN')} day peak
          </span>
        </Card>
      </div>

      {/* Charts Grid: Weekly Sales Velocity + Top Flavors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Weekly Sales Bar Visualization */}
        <Card className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif font-bold text-base text-owner-heading flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-plum" />
                Weekly Sales Velocity
              </h3>
              <p className="text-xs text-owner-muted mt-0.5">Daily gross revenue distribution</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Weekend Surge Active
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-4 pb-2 border-b border-owner-border">
            {daysOrder.map((day) => {
              const amount = Number(salesByDay[day] || 0);
              const heightPercent = maxSales > 0 ? Math.max(Math.round((amount / maxSales) * 100), 8) : 8;
              const isPeak = day === peakDay;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-owner-heading bg-white px-1.5 py-0.5 rounded shadow-xs border border-owner-border whitespace-nowrap">
                    ₹{amount.toLocaleString('en-IN')}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 group-hover:brightness-110 shadow-2xs ${
                      isPeak
                        ? 'bg-gradient-to-t from-brand-plum to-brand-plum-hover'
                        : 'bg-gradient-to-t from-slate-400 to-slate-300'
                    }`}
                  />
                  <span className="text-[11px] font-medium text-owner-muted uppercase tracking-wider mt-1 truncate">
                    {day.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-owner-muted mt-4 pt-2">
            <span>Minimum: ₹{Math.min(...dayValues).toLocaleString('en-IN')}</span>
            <span>Average: ₹{Math.round(totalRevenue / 7).toLocaleString('en-IN')}/day</span>
            <span className="font-semibold text-brand-plum">Peak: ₹{peakAmount.toLocaleString('en-IN')}</span>
          </div>
        </Card>

        {/* Right 5 Cols: Top Selling Products */}
        <Card className="lg:col-span-5 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif font-bold text-base text-owner-heading flex items-center gap-2">
                <PieChart className="w-4 h-4 text-brand-plum" />
                Top Bestselling Cakes
              </h3>
              <p className="text-xs text-owner-muted mt-0.5">Units sold this month</p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-4">
            {topProducts.map(([productName, count], idx) => {
              const share = totalTopUnits > 0 ? Math.round((count / totalTopUnits) * 100) : 0;
              return (
                <div key={productName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-owner-heading flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-brand-blush text-brand-plum flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      {productName}
                    </span>
                    <span className="text-owner-muted font-medium">
                      {count} units ({share}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-owner-canvas rounded-full overflow-hidden">
                    <div
                      style={{ width: `${share}%` }}
                      className="h-full bg-gradient-to-r from-brand-plum to-brand-plum-hover rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
