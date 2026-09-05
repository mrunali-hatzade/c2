'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { getPlatformStats, getAllShops } from '@/lib/api/admin';
import { DashboardStats, AdminShopSummary } from '@/types/admin';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentShops, setRecentShops] = useState<AdminShopSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setIsLoading(true);

    try {
      const [statsData, shopsData] = await Promise.all([
        getPlatformStats(),
        getAllShops(),
      ]);
      setStats(statsData);
      setRecentShops(shopsData.slice(0, 5));
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading platform intelligence..." />;
  }

  const formatCurrency = (val?: number) => {
    return `₹${(val || 0).toLocaleString('en-IN')}`;
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'ACTIVE') return <Badge variant="success" size="sm">Active</Badge>;
    if (s === 'PENDING' || s === 'PENDING_APPROVAL') return <Badge variant="warning" size="sm">Pending KYC</Badge>;
    if (s === 'SUSPENDED') return <Badge variant="error" size="sm">Suspended</Badge>;
    return <Badge variant="default" size="sm">{status}</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">
            Platform Intelligence & Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-tenant health, GMV volume, and bakery compliance status
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="self-start sm:self-auto gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </Button>
      </div>

      {/* Pending KYC Action Alert Banner */}
      {(stats?.pendingShops ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                {stats?.pendingShops} {stats?.pendingShops === 1 ? 'Bakery' : 'Bakeries'} Awaiting Verification
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                New tenant onboarding dossiers with FSSAI & KYC documentation require administrative compliance approval.
              </p>
            </div>
          </div>
          <Link href="/admin/shops">
            <Button variant="primary" size="sm" className="whitespace-nowrap bg-amber-600 hover:bg-amber-700 border-amber-700">
              Review Dossiers
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Bakeries */}
        <Card className="p-6 border-slate-200/80 shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Bakeries
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-serif text-slate-900 mt-3">
            {stats?.totalShops ?? 0}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-emerald-700 font-medium">
              {stats?.activeShops ?? 0} active
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-700 font-medium">
              {stats?.pendingShops ?? 0} pending
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-rose-700 font-medium">
              {stats?.suspendedShops ?? 0} suspended
            </span>
          </div>
        </Card>

        {/* Registered Users */}
        <Card className="p-6 border-slate-200/80 shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Platform Accounts
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-serif text-slate-900 mt-3">
            {stats?.totalUsers ?? 0}
          </p>
          <span className="text-xs text-purple-700 font-medium inline-flex items-center mt-2">
            Multi-role users registered
          </span>
        </Card>

        {/* Active Storefronts */}
        <Card className="p-6 border-slate-200/80 shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Storefronts
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-serif text-slate-900 mt-3">
            {stats?.activeShops ?? 0}
          </p>
          <span className="text-xs text-emerald-700 font-medium inline-flex items-center mt-2">
            Taking orders right now
          </span>
        </Card>

        {/* Platform Revenue / GMV */}
        <Card className="p-6 border-slate-200/80 shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Platform Volume (GMV)
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-serif text-slate-900 mt-3">
            {formatCurrency(stats?.totalRevenue)}
          </p>
          <span className="text-xs text-amber-700 font-medium inline-flex items-center mt-2">
            Cumulative order throughput
          </span>
        </Card>
      </div>

      {/* Quick Administration Modules Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link href="/admin/shops" className="group">
          <Card className="p-5 border-slate-200 hover:border-indigo-300 hover:shadow-card transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Bakery Moderation
                </h4>
                <p className="text-xs text-slate-500">Approve, reject, or audit bakeries</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>

        <Link href="/admin/plans" className="group">
          <Card className="p-5 border-slate-200 hover:border-indigo-300 hover:shadow-card transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  SaaS Subscription Plans
                </h4>
                <p className="text-xs text-slate-500">Configure tiers, pricing & quotas</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>

        <Link href="/admin/messages" className="group">
          <Card className="p-5 border-slate-200 hover:border-indigo-300 hover:shadow-card transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  System Broadcasts
                </h4>
                <p className="text-xs text-slate-500">Dispatch alerts & announcements</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>
      </div>

      {/* Recent Bakery Registrations Table */}
      <Card className="p-6 border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Recent Bakery Registrations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest tenants requesting access to the CakeStore marketplace
            </p>
          </div>
          <Link href="/admin/shops">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <span>View All Bakeries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-medium">
                <th className="py-3 px-4 rounded-l-xl">Bakery</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentShops.map((shop) => (
                <tr key={shop.shopId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {shop.businessName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{shop.businessName}</p>
                        <p className="text-[11px] text-slate-400">ID #{shop.shopId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-700">{shop.ownerName || '—'}</p>
                    <p className="text-[11px] text-slate-400">{shop.ownerEmail || '—'}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {shop.registeredAt
                      ? new Date(shop.registeredAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(shop.shopStatus)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/admin/shops/${shop.shopId}`}>
                      <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                        Inspect Dossier
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
