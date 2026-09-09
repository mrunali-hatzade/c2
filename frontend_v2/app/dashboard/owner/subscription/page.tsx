'use client';

import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Check,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Zap,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Download,
  FileText,
  Receipt,
} from 'lucide-react';
import { ownerApi } from '@/lib/api/owner';
import { SubscriptionRecord, OwnerPaymentRecord } from '@/types/owner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';

export default function OwnerSubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [payments, setPayments] = useState<OwnerPaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [renewing, setRenewing] = useState(false);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoadingPayments(true);
    try {
      const data = await ownerApi.getPayments();
      setPayments(data || []);
    } catch (err: any) {
      console.error('Failed to load payment history', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const fetchSubscription = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setErrorNotice(null);

    try {
      const data = await ownerApi.getCurrentSubscription();
      setSubscription(data);
      await fetchPayments();
    } catch (err: any) {
      setErrorNotice(err?.message || 'Failed to load subscription details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleRenewPayment = async (amount: number) => {
    setRenewing(true);
    setErrorNotice(null);
    setSuccessNotice(null);

    try {
      const result = await ownerApi.processMockSubscriptionPayment(amount);
      setSuccessNotice(
        `Payment verified (${result.paymentId}). Your bakery platform license has been extended by 30 days!`
      );
      await fetchSubscription(true);
    } catch (err: any) {
      setErrorNotice(err?.message || 'Payment simulation failed');
    } finally {
      setRenewing(false);
    }
  };

  const handleDownloadInvoice = async (paymentId: number) => {
    setDownloadingInvoiceId(paymentId);
    try {
      await ownerApi.downloadPaymentInvoice(paymentId);
    } catch (err: any) {
      alert(err?.message || 'Failed to download invoice. Please try again.');
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const isExpired =
    !subscription ||
    subscription.status === 'EXPIRED' ||
    subscription.status === 'SUSPENDED' ||
    (subscription.expiryDate && new Date(subscription.expiryDate).getTime() < Date.now());

  const daysRemaining = subscription?.expiryDate
    ? Math.max(
        0,
        Math.ceil((new Date(subscription.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      )
    : 30;

  const plans = [
    {
      id: 'starter',
      name: 'Starter Home Baker',
      badge: 'Free Pilot',
      priceMonthly: 0,
      priceYearly: 0,
      orderLimit: '50 orders/month',
      features: [
        'Branded digital storefront',
        'Up to 10 cake catalog items',
        'Kitchen order manager',
        'Standard customer support',
      ],
      current: false,
    },
    {
      id: 'pro-baker',
      name: 'Pro Baker Studio',
      badge: 'Active Suite',
      priceMonthly: 350,
      priceYearly: 3500,
      orderLimit: 'Unlimited orders',
      features: [
        'Custom branded online storefront',
        'Unlimited cake products & flavor variants',
        '0% transaction fees on all orders',
        'Instant WhatsApp notifications',
        'Custom delivery slot capacity controls',
        'Coupons & discount campaign manager',
        'Custom cake enquiry quotation suite',
        'Priority phone & WhatsApp support',
      ],
      current: true,
    },
    {
      id: 'enterprise',
      name: 'Multi-Outlet Chain',
      badge: 'Scalable Growth',
      priceMonthly: 999,
      priceYearly: 9990,
      orderLimit: 'Unlimited multi-branch orders',
      features: [
        'All Pro Baker features included',
        'Multi-kitchen branch dispatch management',
        'Dedicated account manager',
        'Custom domain setup (yourbakery.com)',
        'Staff role access controls',
      ],
      current: false,
    },
  ];

  if (loading) return <LoadingState message="Loading subscription & billing details..." />;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-owner-border shadow-soft">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-blush text-brand-plum text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Storefront SaaS Platform License</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-owner-heading tracking-tight">
            Subscription & Plans
          </h1>
          <p className="text-xs text-owner-muted">
            Manage your CakeStore merchant license, renewal dates, and commercial studio features
          </p>
        </div>

        <button
          onClick={() => fetchSubscription(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-owner-canvas hover:bg-brand-cream border border-owner-border text-xs font-semibold text-owner-heading transition-all disabled:opacity-60 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-plum ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Current Active Plan Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-plum/30 shadow-card relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant={isExpired ? 'error' : 'success'} size="md">
                {isExpired ? 'License Expired' : 'Active Plan'}
              </Badge>
              <span className="text-xs text-owner-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-plum" />
                <span>{daysRemaining} days remaining in billing cycle</span>
              </span>
            </div>

            <h2 className="text-2xl font-bold font-serif text-owner-heading">
              {subscription?.plan?.name || 'Pro Baker Studio Suite'}
            </h2>
            <p className="text-xs text-owner-muted max-w-xl leading-relaxed">
              Includes full access to custom storefront, unlimited catalog, order invoicing, direct UPI customer payouts, and zero platform sales commission.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="text-right sm:pr-4 sm:border-r border-owner-border">
              <p className="text-2xl font-extrabold font-serif text-brand-espresso">₹350</p>
              <p className="text-[11px] text-owner-muted">per month / 0% commission</p>
            </div>

            <Button
              onClick={() => handleRenewPayment(350)}
              isLoading={renewing}
              size="lg"
              className="gap-2 shadow-soft"
            >
              <Zap className="w-4 h-4" />
              <span>Renew Plan (Test Checkout)</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <h2 className="font-serif font-bold text-lg text-owner-heading">Available Studio Plans</h2>
          <p className="text-xs text-owner-muted">Choose the scale that matches your kitchen volume</p>
        </div>

        <div className="inline-flex p-1 rounded-2xl bg-white border border-owner-border shadow-soft">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-brand-plum text-white shadow-soft'
                : 'text-owner-muted hover:text-owner-heading'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'yearly'
                ? 'bg-brand-plum text-white shadow-soft'
                : 'text-owner-muted hover:text-owner-heading'
            }`}
          >
            <span>Yearly</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-extrabold">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;

          return (
            <Card
              key={plan.id}
              className={`p-6 flex flex-col justify-between transition-all ${
                plan.current
                  ? 'border-2 border-brand-plum shadow-card ring-2 ring-brand-plum/10'
                  : 'hover:border-owner-border/80'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-plum">
                    {plan.badge}
                  </span>
                  {plan.current && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Current Plan
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold font-serif text-owner-heading">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold font-serif text-brand-espresso">
                      ₹{price.toLocaleString()}
                    </span>
                    <span className="text-xs text-owner-muted">
                      {price === 0 ? '' : billingCycle === 'monthly' ? '/month' : '/year'}
                    </span>
                  </div>
                  <p className="text-[11px] text-owner-muted mt-1">{plan.orderLimit}</p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-owner-border/60">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-owner-heading">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-owner-border/60">
                {plan.current ? (
                  <Button
                    onClick={() => handleRenewPayment(plan.priceMonthly || 350)}
                    isLoading={renewing}
                    className="w-full"
                    size="sm"
                  >
                    Extend License (+30 Days)
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => alert(`Upgrading to ${plan.name} will be enabled in release build.`)}
                    className="w-full"
                    size="sm"
                  >
                    Switch Plan
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* C3 & C5: Billing & Payment History Section */}
      <div className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-blush text-brand-plum flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-owner-heading">Billing & Payment History</h2>
              <p className="text-xs text-owner-muted">
                Official platform license invoices, tax receipts, and payment transactions
              </p>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          {loadingPayments ? (
            <div className="p-8 text-center text-xs text-owner-muted">
              Loading payment history...
            </div>
          ) : payments.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-owner-canvas mx-auto flex items-center justify-center text-owner-muted">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-owner-heading">No payment records yet</p>
              <p className="text-xs text-owner-muted max-w-sm mx-auto">
                Once your license is renewed or upgraded, transaction details and GST tax invoices will be available here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-owner-border bg-owner-canvas/40 text-owner-muted uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Invoice / ID</th>
                    <th className="py-3.5 px-4">Plan / Description</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-owner-border">
                  {payments.map((p) => {
                    const statusUpper = (p.status || '').toUpperCase();
                    const isCompleted = statusUpper === 'COMPLETED';
                    const isFailed = statusUpper === 'FAILED';
                    const isPending = !isCompleted && !isFailed;
                    const dateStr = p.paidAt || p.createdAt;
                    const formattedDate = dateStr
                      ? new Date(dateStr).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—';

                    return (
                      <tr key={p.id} className="hover:bg-owner-canvas/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-medium text-brand-espresso">
                            {p.providerPaymentId || `#PAY-${p.id}`}
                          </div>
                          {p.providerOrderId && (
                            <div className="text-[10px] text-owner-muted font-mono">{p.providerOrderId}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-owner-heading">
                            {p.subscriptionPlanName || 'Pro Baker Studio'}
                          </div>
                          <div className="text-[10px] text-owner-muted">Platform Commercial License</div>
                        </td>
                        <td className="py-3.5 px-4 text-owner-muted">
                          {formattedDate}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-owner-heading">
                            ₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-owner-muted">{p.currency || 'INR'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {isCompleted ? (
                            <Badge variant="success" size="sm">Completed</Badge>
                          ) : isFailed ? (
                            <Badge variant="error" size="sm">Failed</Badge>
                          ) : (
                            <Badge variant="warning" size="sm">Pending</Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {p.invoiceAvailable ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={downloadingInvoiceId === p.id}
                              onClick={() => handleDownloadInvoice(p.id)}
                              className="gap-1.5 text-brand-plum hover:bg-brand-blush/40"
                            >
                              <Download className={`w-3.5 h-3.5 ${downloadingInvoiceId === p.id ? 'animate-bounce' : ''}`} />
                              <span>{downloadingInvoiceId === p.id ? 'Downloading...' : 'PDF Invoice'}</span>
                            </Button>
                          ) : (
                            <span className="text-owner-muted text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

