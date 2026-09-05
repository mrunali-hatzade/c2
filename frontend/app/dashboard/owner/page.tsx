"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  DollarSign, 
  Cake, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  Eye, 
  Truck, 
  Calendar,
  AlertTriangle,
  CalendarClock,
  Star,
  ChevronDown
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  shopStatus: string;
  subscriptionStatus: string;
}

interface ShopDetails {
  id: number;
  businessName: string;
  businessCategory?: string;
  city?: string;
}

interface OrderItemSummary {
  productName: string;
  quantity: number;
}

interface OrderSummary {
  id: number;
  orderNumber: string;
  customerName?: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items?: OrderItemSummary[];
}

interface AnalyticsDashboard {
  totalOrders?: number;
  totalRevenue?: number;
  salesByDay?: Record<string, number>;
}

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [shop, setShop] = useState<ShopDetails | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.allSettled([
      apiClient<DashboardStats>('/api/shops/my-shop/stats'),
      apiClient<ShopDetails>('/api/shops/my-shop'),
      apiClient<OrderSummary[]>('/api/owner/orders'),
      apiClient<AnalyticsDashboard>('/api/owner/analytics/dashboard')
    ]).then(([statsRes, shopRes, ordersRes, analyticsRes]) => {
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (shopRes.status === 'fulfilled') setShop(shopRes.value);
      if (ordersRes.status === 'fulfilled') {
        const sorted = [...(ordersRes.value || [])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentOrders(sorted.slice(0, 5));
      }
      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value);
      setLoading(false);
    }).catch((err) => {
      setError(err.message || 'Failed to load dashboard data');
      setLoading(false);
    });
  }, []);

  // Format relative or concise time
  const formatTime = (isoString: string) => {
    if (!isoString) return 'recently';
    const date = new Date(isoString);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffMin < 60) return `${Math.max(1, diffMin)} mins ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  // Status chip styling
  const renderStatusChip = (status: string) => {
    const s = (status || '').toUpperCase();
    let colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';
    if (s === 'NEW') colorClasses = 'bg-blue-50 text-blue-700 border-blue-200/80';
    else if (s === 'CONFIRMED') colorClasses = 'bg-purple-50 text-purple-700 border-purple-200/80';
    else if (s === 'PREPARING') colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/80';
    else if (s === 'OUT_FOR_DELIVERY' || s === 'OUT FOR DELIVERY') colorClasses = 'bg-orange-50 text-orange-700 border-orange-200/80';
    else if (s === 'READY') colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
    else if (s === 'COMPLETED' || s === 'DELIVERED') colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    else if (s === 'CANCELLED') colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80';

    return (
      <span className={`text-3xs uppercase font-bold px-2 py-0.5 rounded-md border tracking-wide inline-block ${colorClasses}`}>
        {s.replace(/_/g, ' ')}
      </span>
    );
  };

  // Date range formatted string
  const today = new Date();
  const dateRangeStr = `${today.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} – ${today.toLocaleDateString('en-IN', { year: 'numeric' })}`;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-3 border-[#C56E56] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loading bakery dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 px-6 py-4 rounded-2xl shadow-2xs space-y-1">
        <h4 className="font-bold text-sm">Dashboard Notice</h4>
        <p className="text-xs">{error}</p>
      </div>
    );
  }

  // Chart data calculation
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const rawSales = analytics?.salesByDay || {};
  const chartValues = fullDays.map(d => rawSales[d] ?? 0);
  const maxVal = Math.max(...chartValues, 500);

  // SVG spline points
  const chartWidth = 500;
  const chartHeight = 180;
  const paddingX = 35;
  const paddingY = 20;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  const points = chartValues.map((val, idx) => {
    const x = paddingX + (idx / (chartValues.length - 1)) * usableWidth;
    const y = chartHeight - paddingY - (val / maxVal) * usableHeight;
    return { x, y };
  });

  const pathD = points.length > 0 
    ? points.reduce((acc, p, i, a) => {
        if (i === 0) return `M ${p.x},${p.y}`;
        const prev = a[i - 1];
        const cx1 = prev.x + (p.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (p.x - prev.x) / 2;
        const cy2 = p.y;
        return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${p.x},${p.y}`;
      }, '')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x},${chartHeight - paddingY} L ${points[0].x},${chartHeight - paddingY} Z`
    : '';

  const bakeryTitle = shop?.businessName || "Sweet Delight";

  return (
    <div className="space-y-6">

      {/* 1. Welcome Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
              Good morning, {bakeryTitle} 👋
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Here&apos;s what&apos;s happening with your bakery today.
          </p>
        </div>

        {/* Date Filter Badge & Quick Storefront Action */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200/80 text-gray-700 text-xs font-semibold shadow-2xs">
            <Calendar size={15} className="text-[#A35742]" />
            <span>{dateRangeStr}</span>
          </div>

          {shop?.id && (
            <Link
              href={`/shop/${shop.id}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Eye size={14} />
              <span className="hidden md:inline">View Storefront</span>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Quick Action Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Link
          href="/dashboard/owner/products"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200/80 text-gray-800 text-xs font-bold hover:border-[#A35742] hover:text-[#A35742] shadow-2xs transition-all shrink-0 cursor-pointer"
        >
          <Plus size={15} className="text-[#A35742]" />
          <span>Add New Cake</span>
        </Link>
        <Link
          href="/dashboard/owner/orders"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200/80 text-gray-800 text-xs font-bold hover:border-[#A35742] hover:text-[#A35742] shadow-2xs transition-all shrink-0 cursor-pointer"
        >
          <ShoppingBag size={15} className="text-[#A35742]" />
          <span>Manage Orders</span>
        </Link>
        <Link
          href="/dashboard/owner/delivery-slots"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200/80 text-gray-800 text-xs font-bold hover:border-[#A35742] hover:text-[#A35742] shadow-2xs transition-all shrink-0 cursor-pointer"
        >
          <Truck size={15} className="text-[#A35742]" />
          <span>Delivery Windows</span>
        </Link>
      </div>

      {/* 3. Four Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Total Orders */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={17} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {stats?.totalOrders ?? 0}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center text-3xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight size={12} /> +18%
              </span>
              <span className="text-3xs text-gray-400 font-medium">vs last week</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={17} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              ₹{Number(stats?.totalRevenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center text-3xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight size={12} /> +22%
              </span>
              <span className="text-3xs text-gray-400 font-medium">vs last week</span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Products */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Cakes</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Cake size={17} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {stats?.activeProducts ?? 0}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center text-3xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight size={12} /> Live
              </span>
              <span className="text-3xs text-gray-400 font-medium">{stats?.totalProducts ?? 0} total created</span>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Action Orders */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Pending Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={17} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {stats?.pendingOrders ?? 0}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center text-3xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                Needs Attention
              </span>
              <span className="text-3xs text-gray-400 font-medium">To prepare</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Middle Section: Recent Orders & Sales Overview Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Orders Table (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">Recent Orders</h3>
                <span className="text-3xs font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {recentOrders.length}
                </span>
              </div>
              <Link 
                href="/dashboard/owner/orders" 
                className="text-xs font-bold text-[#A35742] hover:text-[#7E3D2C] transition-colors"
              >
                View all
              </Link>
            </div>

            {/* Orders Listing */}
            {recentOrders.length === 0 ? (
              <div className="py-16 text-center text-gray-400 space-y-2">
                <ShoppingBag size={28} className="mx-auto text-gray-300" />
                <p className="text-xs font-medium">No recent orders yet</p>
                <p className="text-3xs text-gray-400">Orders placed by customers will appear here in real-time</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 overflow-x-auto">
                {recentOrders.map((order) => {
                  const customerDisplay = order.customerName || 'Guest Customer';
                  const orderNum = order.orderNumber.startsWith('ORD-') 
                    ? `#${order.orderNumber.replace('ORD-', '')}` 
                    : `#${order.orderNumber}`;

                  return (
                    <div key={order.id} className="py-3.5 flex items-center justify-between gap-3 text-xs hover:bg-gray-50/60 rounded-lg px-1 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono font-bold text-gray-900 shrink-0">
                          {orderNum}
                        </span>
                        <div className="min-w-0 truncate">
                          <p className="font-semibold text-gray-800 truncate">{customerDisplay}</p>
                          <p className="text-3xs text-gray-400">{formatTime(order.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-gray-900">
                          ₹{Number(order.totalAmount || 0).toFixed(0)}
                        </span>
                        {renderStatusChip(order.orderStatus)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <Link
              href="/dashboard/owner/orders"
              className="text-3xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Go to order fulfillment &rarr;
            </Link>
          </div>
        </div>

        {/* Right: Sales Overview Line Chart (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">Sales Overview</h3>
                <p className="text-3xs text-gray-400 font-medium">Revenue distribution across days</p>
              </div>

              {/* Time Range Selector */}
              <button 
                onClick={() => setTimeRange(timeRange === 'week' ? 'month' : 'week')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 text-3xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span>{timeRange === 'week' ? 'This Week' : 'This Month'}</span>
                <ChevronDown size={12} />
              </button>
            </div>

            {/* Custom SVG Spline Chart */}
            <div className="mt-2 w-full">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-44 overflow-visible"
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C56E56" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#C56E56" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#F1F3F5" strokeDasharray="3 3" />
                <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#F1F3F5" strokeDasharray="3 3" />
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#E9ECEF" />

                {/* Y-axis labels */}
                <text x={paddingX - 6} y={paddingY + 4} textAnchor="end" className="text-3xs fill-gray-400 font-mono">₹{maxVal >= 1000 ? `${(maxVal / 1000).toFixed(0)}K` : maxVal}</text>
                <text x={paddingX - 6} y={chartHeight / 2 + 3} textAnchor="end" className="text-3xs fill-gray-400 font-mono">₹{(maxVal / 2000).toFixed(0)}K</text>
                <text x={paddingX - 6} y={chartHeight - paddingY + 3} textAnchor="end" className="text-3xs fill-gray-400 font-mono">₹0</text>

                {/* Area Gradient Fill */}
                {areaD && (
                  <path d={areaD} fill="url(#salesGradient)" />
                )}

                {/* Line Path */}
                {pathD && (
                  <path 
                    d={pathD} 
                    fill="none" 
                    stroke="#A35742" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                )}

                {/* Coordinate Data Dots */}
                {points.map((pt, i) => (
                  <g key={i}>
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r="3.5" 
                      fill="#FFFFFF" 
                      stroke="#A35742" 
                      strokeWidth="2" 
                    />
                    {/* X-axis Day labels */}
                    <text 
                      x={pt.x} 
                      y={chartHeight - 4} 
                      textAnchor="middle" 
                      className="text-3xs fill-gray-400 font-semibold"
                    >
                      {daysOfWeek[i]}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-3xs text-gray-500">
            <span>Peak Day: <strong className="text-gray-800 font-bold">Saturday</strong></span>
            <span>Avg Daily: <strong className="text-gray-800 font-bold">₹{Math.round(chartValues.reduce((a, b) => a + b, 0) / 7)}</strong></span>
          </div>
        </div>

      </div>

      {/* 5. Bottom Row: Three Action / Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Low Stock Alert */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-center gap-4 hover:border-gray-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <AlertTriangle size={20} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-gray-900 leading-tight">Low Stock Alert</h4>
            <p className="text-3xs text-gray-500 mt-1 truncate">
              {(stats?.totalProducts ?? 0) - (stats?.activeProducts ?? 0) > 0
                ? `${(stats?.totalProducts ?? 0) - (stats?.activeProducts ?? 0)} cakes marked inactive`
                : "All products active & in stock"
              }
            </p>
          </div>
        </div>

        {/* Card 2: Upcoming Orders */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-center gap-4 hover:border-gray-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <CalendarClock size={20} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-gray-900 leading-tight">Upcoming Deliveries</h4>
            <p className="text-3xs text-gray-500 mt-1 truncate">
              {(stats?.pendingOrders ?? 0) > 0
                ? `${stats?.pendingOrders} orders queued in slot pipeline`
                : "No pending delivery slots scheduled"
              }
            </p>
          </div>
        </div>

        {/* Card 3: Customer Feedback */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-center gap-4 hover:border-gray-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Star size={20} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-gray-900 leading-tight">Customer Feedback</h4>
            <p className="text-3xs text-gray-500 mt-1 truncate">
              Reviews & rating center ready
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
