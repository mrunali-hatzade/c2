'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Store,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  FileText,
  CreditCard,
  ShoppingBag,
  Cake,
  Activity,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { getShopDetails, updateShopStatus } from '@/lib/api/admin';
import { AdminShopDetails } from '@/types/admin';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { useToast } from '@/components/common/Toast';

export default function AdminShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = Number(params?.id);

  const [details, setDetails] = useState<AdminShopDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const toast = useToast();

  const loadShop = React.useCallback(async (isManual = false) => {
    if (!shopId) return;
    if (isManual) setRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await getShopDetails(shopId);
      setDetails(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch bakery dossier');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [shopId, toast]);

  useEffect(() => {
    loadShop();
  }, [loadShop]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!shopId) return;
    setIsMutating(true);
    try {
      await updateShopStatus(shopId, newStatus);
      toast.success(`Bakery #${shopId} status changed to ${newStatus}`);
      // Optimistic update
      if (details) {
        setDetails({
          ...details,
          shop: {
            ...details.shop,
            status: newStatus,
          },
          activityLogs: [
            {
              id: Date.now(),
              action: 'STATUS_CHANGE',
              details: `Super Admin changed shop status to ${newStatus}`,
              createdAt: new Date().toISOString(),
            },
            ...(details.activityLogs || []),
          ],
        });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update shop status');
    } finally {
      setIsMutating(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Inspecting bakery dossier & compliance logs..." />;
  }

  if (!details) {
    return (
      <div className="text-center py-16 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Bakery Dossier Not Found</h2>
        <p className="text-xs text-slate-500">The requested bakery tenant ID could not be loaded.</p>
        <Link href="/admin/shops">
          <Button variant="outline" size="sm">Back to Bakery Directory</Button>
        </Link>
      </div>
    );
  }

  const { shop, subscriptions = [], payments = [], activityLogs = [] } = details;

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'ACTIVE') return <Badge variant="success">Active Storefront</Badge>;
    if (s === 'PENDING' || s === 'PENDING_APPROVAL') return <Badge variant="warning">Pending KYC Review</Badge>;
    if (s === 'SUSPENDED') return <Badge variant="error">Suspended</Badge>;
    if (s === 'REJECTED') return <Badge variant="default">Rejected</Badge>;
    return <Badge variant="default">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/shops"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bakery Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadShop(true)}
            disabled={refreshing}
            className="gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Main Dossier Header Banner */}
      <Card className="p-6 border-slate-200 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-serif text-2xl font-bold shrink-0 border border-indigo-100">
              {shop.businessName.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                  {shop.businessName}
                </h1>
                {getStatusBadge(shop.status)}
                {shop.isPureVeg && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    🌱 100% Pure Veg
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                <span className="font-mono text-slate-400">Tenant ID #{shop.id}</span>
                <span>•</span>
                <span>Registered: {new Date(shop.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </p>
            </div>
          </div>

          {/* Moderation Status Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {shop.status !== 'ACTIVE' && (
              <Button
                variant="primary"
                size="sm"
                disabled={isMutating}
                onClick={() => handleStatusUpdate('ACTIVE')}
                className="bg-emerald-600 hover:bg-emerald-700 border-emerald-700 gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Activate</span>
              </Button>
            )}

            {shop.status === 'ACTIVE' && (
              <Button
                variant="danger"
                size="sm"
                disabled={isMutating}
                onClick={() => handleStatusUpdate('SUSPENDED')}
                className="gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Suspend Storefront</span>
              </Button>
            )}

            {shop.status !== 'PENDING' && (
              <Button
                variant="outline"
                size="sm"
                disabled={isMutating}
                onClick={() => handleStatusUpdate('PENDING')}
                className="gap-1.5 text-amber-700 hover:bg-amber-50"
              >
                <Clock className="w-4 h-4" />
                <span>Mark Under Review</span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Catalog Products</span>
            <Cake className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold font-serif text-slate-900 mt-2">{details.totalProducts}</p>
          <span className="text-xs text-slate-500 mt-1 block">Live menu items</span>
        </Card>

        <Card className="p-5 border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-serif text-slate-900 mt-2">{details.totalOrders}</p>
          <span className="text-xs text-slate-500 mt-1 block">Lifetime orders placed</span>
        </Card>

        <Card className="p-5 border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">FSSAI Status</span>
            <ShieldCheck className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-sm font-bold text-slate-900 mt-2 font-mono truncate">
            {shop.fssaiRegistration || 'Not Submitted'}
          </p>
          <span className="text-xs text-purple-600 mt-1 block">
            {shop.fssaiRegistration ? 'License Registered' : 'Missing KYC Document'}
          </span>
        </Card>

        <Card className="p-5 border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Plan</span>
            <CreditCard className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-sm font-bold text-slate-900 mt-2 truncate">
            {subscriptions[0]?.planName || 'Starter Bakery'}
          </p>
          <span className="text-xs text-amber-600 mt-1 block">
            {subscriptions[0]?.status || 'Trial Period'}
          </span>
        </Card>
      </div>

      {/* Two Column Layout: Business KYC vs Activity & Subscription History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Business & KYC Profile */}
        <Card className="p-6 border-slate-200/80 shadow-soft space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="font-serif font-bold text-base text-slate-900">
              Bakery KYC & Profile Audit
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">About & Bio</span>
              <p className="text-slate-700 mt-1 leading-relaxed">
                {shop.description || 'No description provided by bakery.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Phone</span>
                  <p className="text-slate-800 font-medium">{shop.phone || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Email</span>
                  <p className="text-slate-800 font-medium truncate">{shop.email || '—'}</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-[10px] font-semibold uppercase">Address & Location</span>
              </div>
              <p className="text-slate-800 font-medium pl-6">
                {shop.address || '—'}
              </p>
              <p className="text-slate-500 pl-6">
                {[shop.city, shop.state, shop.pincode].filter(Boolean).join(', ') || '—'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-700 uppercase">
                  FSSAI Food License
                </span>
                <span className="text-[10px] font-semibold text-emerald-600">Compliance Audit</span>
              </div>
              <p className="text-base font-bold font-mono text-indigo-950">
                {shop.fssaiRegistration || 'MISSING_KYC_DOC'}
              </p>
            </div>
          </div>
        </Card>

        {/* Right Column: Subscriptions & Activity Log */}
        <div className="space-y-6">
          {/* Subscriptions Card */}
          <Card className="p-6 border-slate-200/80 shadow-soft">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <h3 className="font-serif font-bold text-base text-slate-900">
                Subscription & Invoicing
              </h3>
            </div>

            {subscriptions.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No subscription history recorded.</p>
            ) : (
              <div className="space-y-3">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{sub.planName}</p>
                      <p className="text-[11px] text-slate-400">
                        {sub.startDate} to {sub.endDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹{sub.amount}</p>
                      <Badge variant="success" size="sm">
                        {sub.status || 'Active'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Activity Logs Card */}
          <Card className="p-6 border-slate-200/80 shadow-soft">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif font-bold text-base text-slate-900">
                Security & Audit Trail
              </h3>
            </div>

            {activityLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No activity logs recorded.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 font-mono text-[11px]">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{log.details}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
