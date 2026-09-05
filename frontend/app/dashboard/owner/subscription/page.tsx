"use client";

import React, { useEffect, useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  RefreshCw, 
  Zap, 
  Clock, 
  Sparkles, 
  AlertCircle,
  ArrowRight,
  Store
} from 'lucide-react';
import { 
  getCurrentSubscription, 
  processMockSubscriptionPayment, 
  SubscriptionRecord 
} from '@/lib/api/subscription';

export default function OwnerSubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Renewal / Checkout state
  const [renewing, setRenewing] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [selectedPlanAmount, setSelectedPlanAmount] = useState(1499);

  const fetchSubscription = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await getCurrentSubscription();
      setSubscription(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load subscription';
      setError(msg);
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
    setError(null);
    setSuccessNotice(null);

    try {
      const result = await processMockSubscriptionPayment(amount);
      setSuccessNotice(`Payment successful (${result.paymentId}). Your bakery platform license has been extended by 30 days!`);
      await fetchSubscription(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment simulation failed';
      setError(msg);
    } finally {
      setRenewing(false);
    }
  };

  const isExpired = !subscription || 
    subscription.status === 'EXPIRED' || 
    subscription.status === 'SUSPENDED' ||
    (subscription.expiryDate && new Date(subscription.expiryDate).getTime() < Date.now());

  const daysRemaining = subscription?.expiryDate
    ? Math.max(0, Math.ceil((new Date(subscription.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

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

  const PLANS = [
    {
      id: 'starter',
      name: 'Artisan Starter',
      amount: 999,
      description: 'Essential toolkit for boutique home bakers',
      features: [
        'Up to 25 Product Listings',
        'Storefront & Location Search',
        'WhatsApp Enquiries & Leads',
        'Standard Delivery Windows',
      ]
    },
    {
      id: 'pro',
      name: 'Bakery Growth Pro',
      amount: 1499,
      popular: true,
      description: 'Complete operational OS for busy retail bakeries',
      features: [
        'Unlimited Cake Listings',
        'Full Order Management & Invoices',
        'Promotional Coupons & Discounts',
        'Real-time Sales Analytics & CRM',
        'Custom Cake Consultation Leads',
        'Priority Marketplace Placement'
      ]
    },
    {
      id: 'enterprise',
      name: 'Bakery Chain Enterprise',
      amount: 2999,
      description: 'Multi-outlet bakery operations and dedicated support',
      features: [
        'All Pro Features Included',
        'Multi-Kitchen Order Routing',
        'Custom Domain Integration',
        'Dedicated Account Manager',
        'Automated Direct Bank Settlements'
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl">

      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Subscription & Billing
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Manage your CakeStore SaaS platform license, renewal dates, and billing history.
          </p>
        </div>

        <button
          onClick={() => fetchSubscription(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#A35742]' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 py-24 flex flex-col items-center justify-center space-y-3 shadow-2xs">
          <div className="w-8 h-8 border-3 border-[#C56E56] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verifying bakery license status...</p>
        </div>
      ) : (
        <>
          {/* 2. Current Status Overview Banner */}
          <div className={`p-6 rounded-2xl border ${
            isExpired 
              ? 'bg-rose-50/80 border-rose-200 text-rose-900' 
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
          } shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isExpired ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {isExpired ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base">
                    {isExpired ? 'Subscription Inactive / Expired' : 'Active Platform License'}
                  </h3>
                  <span className={`text-3xs font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${
                    isExpired 
                      ? 'bg-rose-200 text-rose-800 border-rose-300' 
                      : 'bg-emerald-200 text-emerald-800 border-emerald-300'
                  }`}>
                    {subscription?.status || 'EXPIRED'}
                  </span>
                </div>
                <p className="text-xs opacity-80 max-w-xl">
                  {isExpired 
                    ? 'Your bakery operations license has expired. Public customers can still view your storefront, but dashboard order processing and inventory controls are locked until renewed.'
                    : `Your bakery SaaS license is active with full access to orders, enquiries, and inventory. Renews on ${formatDate(subscription?.expiryDate)} (${daysRemaining} days remaining).`
                  }
                </p>
              </div>
            </div>

            {isExpired && (
              <button
                onClick={() => handleRenewPayment(selectedPlanAmount)}
                disabled={renewing}
                className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shrink-0 transition-colors shadow-2xs disabled:opacity-60"
              >
                {renewing ? 'Processing Renewal...' : 'Renew License Now'}
              </button>
            )}
          </div>

          {/* 3. Subscription Details Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Current Plan Overview</h3>
                <p className="text-3xs text-gray-400 mt-0.5">SaaS tier agreement and billing cycle dates</p>
              </div>
              <span className="text-xs font-bold text-[#A35742] bg-[#FAF0F2] border border-[#A35742]/20 px-3 py-1 rounded-full">
                ₹{subscription?.amount || 1499} / month
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Plan Tier</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {subscription?.plan?.name || 'Bakery Growth Pro'}
                </p>
              </div>

              <div>
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Activation Date</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {formatDate(subscription?.startDate)}
                </p>
              </div>

              <div>
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Current Expiry</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {formatDate(subscription?.expiryDate)}
                </p>
              </div>

              <div>
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Auto-Renewal</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {subscription?.autoRenew ? 'Enabled' : 'Manual Renewal'}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Plan Selection & Payment Action */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-base font-serif font-bold text-gray-900">Available Subscription Tiers</h3>
              <p className="text-xs text-gray-500 font-medium">Select a plan to renew or upgrade your bakery platform access.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLANS.map((plan) => {
                const isSelected = selectedPlanAmount === plan.amount;

                return (
                  <div 
                    key={plan.id}
                    onClick={() => setSelectedPlanAmount(plan.amount)}
                    className={`rounded-2xl p-6 border transition-all flex flex-col justify-between cursor-pointer relative ${
                      plan.popular 
                        ? 'bg-[#FAF7F2] border-[#A35742] shadow-sm' 
                        : 'bg-white border-gray-200/80 shadow-2xs hover:border-gray-300'
                    } ${isSelected ? 'ring-2 ring-[#3D101E]' : ''}`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 right-6 bg-[#3D101E] text-white text-3xs uppercase font-bold px-3 py-1 rounded-full shadow-2xs">
                        Most Popular
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{plan.name}</h4>
                        <p className="text-3xs text-gray-400 mt-1">{plan.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{plan.amount}</span>
                        <span className="text-3xs text-gray-400 font-semibold">/ 30 days</span>
                      </div>

                      <ul className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-700">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenewPayment(plan.amount);
                        }}
                        disabled={renewing}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-60 cursor-pointer ${
                          plan.popular
                            ? 'bg-[#3D101E] hover:bg-[#5B1C2E] text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        <Zap size={14} />
                        <span>{renewing ? 'Processing...' : `Select & Pay ₹${plan.amount}`}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
