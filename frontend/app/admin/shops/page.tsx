"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Store, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { getAllAdminShops, AdminShopSummary } from '@/lib/api/admin';

export default function AdminShopsPage() {
  const [shops, setShops] = useState<AdminShopSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'SUSPENDED'>('ALL');

  const fetchShops = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await getAllAdminShops();
      setShops(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load shops';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const filteredShops = useMemo(() => {
    return shops.filter((s) => {
      const status = (s.shopStatus || '').toUpperCase();
      let matchesStatus = true;
      if (statusFilter === 'ACTIVE') matchesStatus = status === 'ACTIVE';
      else if (statusFilter === 'PENDING') matchesStatus = status === 'PENDING' || status === 'PENDING_APPROVAL';
      else if (statusFilter === 'SUSPENDED') matchesStatus = status === 'SUSPENDED' || status === 'INACTIVE';

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (s.businessName && s.businessName.toLowerCase().includes(q)) ||
        (s.ownerName && s.ownerName.toLowerCase().includes(q)) ||
        (s.ownerEmail && s.ownerEmail.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [shops, statusFilter, searchQuery]);

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
            Bakery Directory & Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Review onboarding submissions, authorize merchant storefronts, or manage tenant suspension.
          </p>
        </div>

        <button
          onClick={() => fetchShops(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-indigo-600' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* 2. Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by bakery name, owner name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['ALL', 'PENDING', 'ACTIVE', 'SUSPENDED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-3xs font-bold shrink-0 transition-colors cursor-pointer ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Bakeries' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loading bakery directory...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="text-sm font-bold text-slate-900">Failed to load directory</p>
            <p className="text-xs text-slate-500">{error}</p>
            <button
              onClick={() => fetchShops()}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="py-20 text-center space-y-3 px-4">
            <Store size={36} className="mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No bakeries found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No registered bakeries matched your search or status filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/70 text-3xs font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-5">Bakery / Brand</div>
              <div className="col-span-3">Merchant Contact</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            {filteredShops.map((shop) => (
              <div 
                key={shop.shopId}
                className="p-4 sm:px-6 sm:py-4.5 hover:bg-slate-50/70 transition-colors flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center text-xs"
              >
                <div className="col-span-5 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {shop.businessName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{shop.businessName}</p>
                      <p className="text-3xs text-slate-400">ID: #{shop.shopId} • Registered {formatDate(shop.registeredAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-3 min-w-0 text-slate-600 text-3xs">
                  <p className="font-semibold text-slate-900 truncate">{shop.ownerName || 'Verified Merchant'}</p>
                  <p className="truncate text-slate-400">{shop.ownerEmail || '—'}</p>
                </div>

                <div className="col-span-2 text-center">
                  {renderStatusBadge(shop.shopStatus)}
                </div>

                <div className="col-span-2 flex justify-end w-full md:w-auto">
                  <Link
                    href={`/admin/shops/${shop.shopId}`}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                  >
                    <span>Manage</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
