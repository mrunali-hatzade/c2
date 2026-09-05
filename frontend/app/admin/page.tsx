"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Store, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getPlatformStats, getAllAdminShops, DashboardStats, AdminShopSummary } from '@/lib/api/admin';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [shops, setShops] = useState<AdminShopSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [statsData, shopsData] = await Promise.all([
        getPlatformStats(),
        getAllAdminShops(),
      ]);
      setStats(statsData);
      setShops(shopsData || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load platform data';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'ACTIVE') {
      return (
        <span className="text-3xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
          Active
        </span>
      );
    }
    if (s === 'PENDING' || s === 'PENDING_APPROVAL') {
      return (
        <span className="text-3xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase">
          Pending
        </span>
      );
    }
    return (
      <span className="text-3xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase">
        {s}
      </span>
    );
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">

      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Platform Operations Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Multi-tenant governance, bakery approvals, and platform subscription telemetry.
          </p>
        </div>

        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-indigo-600' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 py-24 flex flex-col items-center justify-center space-y-3 shadow-2xs">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aggregating platform metrics...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3 shadow-2xs">
          <AlertCircle size={32} className="mx-auto text-rose-500" />
          <p className="text-sm font-bold text-slate-900">Failed to load platform data</p>
          <p className="text-xs text-slate-500">{error}</p>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {/* 2. Platform KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Bakeries</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Store size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stats?.totalShops || 0}</div>
                <p className="text-3xs text-slate-400 mt-1 font-medium">{stats?.activeShops || 0} currently active</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Approvals</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-amber-600">{stats?.pendingShops || 0}</div>
                <p className="text-3xs text-slate-400 mt-1 font-medium">Awaiting administrator review</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Platform Users</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stats?.totalUsers || 0}</div>
                <p className="text-3xs text-slate-400 mt-1 font-medium">Owners & buyer accounts</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">SaaS Revenue</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  ₹{Number(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                </div>
                <p className="text-3xs text-slate-400 mt-1 font-medium">Total subscriptions collected</p>
              </div>
            </div>

          </div>

          {/* 3. Recent Bakeries Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Platform Bakeries Directory</h3>
                <p className="text-3xs text-slate-400 mt-0.5">Showing registered merchant shops and status</p>
              </div>

              <Link
                href="/admin/shops"
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <span>View All ({shops.length})</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/70 text-3xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-5">Bakery Business</div>
                <div className="col-span-3">Owner Contact</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              {shops.slice(0, 6).map((shop) => (
                <div 
                  key={shop.shopId}
                  className="p-4 sm:px-6 sm:py-4 hover:bg-slate-50/70 transition-colors flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center text-xs"
                >
                  <div className="col-span-5 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{shop.businessName}</p>
                    <p className="text-3xs text-slate-400">Registered: {formatDate(shop.registeredAt)}</p>
                  </div>

                  <div className="col-span-3 min-w-0 text-slate-600 text-3xs">
                    <p className="font-semibold text-slate-800 truncate">{shop.ownerName || 'Unknown'}</p>
                    <p className="truncate text-slate-400">{shop.ownerEmail || '—'}</p>
                  </div>

                  <div className="col-span-2 text-center">
                    {renderStatusBadge(shop.shopStatus)}
                  </div>

                  <div className="col-span-2 flex justify-end w-full md:w-auto">
                    <Link
                      href={`/admin/shops/${shop.shopId}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
