'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Check, Sparkles, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { ownerApi } from '@/lib/api/owner';
import { OwnerSubscription } from '@/types/owner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { useToast } from '@/components/common/Toast';

export default function OwnerSubscriptionPage() {
  const [sub, setSub] = useState<OwnerSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const toast = useToast();

  useEffect(() => {
    ownerApi.getSubscription().then((data) => {
      setSub(data);
      setLoading(false);
    });
  }, []);

  const plans = [
    {
      id: 'starter',
      name: 'Starter Home Baker',
      badge: 'Free Forever',
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
      badge: 'Most Popular',
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
      name: 'Multi-Outlet Bakery Chain',
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

  if (loading || !sub) return <LoadingState message="Loading subscription & billing details..." />;

  const usagePercent = Math.min(
    Math.round((sub.ordersProcessedThisMonth / sub.ordersLimit) * 100),
    100
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-owner-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-owner-heading">SaaS Subscription & Billing</h2>
            <Badge variant="success" size="sm">
              {sub.status}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-owner-muted mt-1">
            Manage your CakeStore platform license, view monthly order volume, and upgrade your tier.
          </p>
        </div>

        {/* Billing Switch */}
        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-owner-canvas border border-owner-border text-xs">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-owner-heading shadow-xs'
                : 'text-owner-muted hover:text-owner-heading'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              billingCycle === 'yearly'
                ? 'bg-white text-owner-heading shadow-xs'
                : 'text-owner-muted hover:text-owner-heading'
            }`}
          >
            <span>Annual</span>
            <span className="text-3xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
              Save 2 Mos
            </span>
          </button>
        </div>
      </div>

      {/* Active Plan Snapshot Card */}
      <Card className="p-6 border-2 border-brand-plum/30 bg-gradient-to-br from-white via-white to-brand-blush/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-plum" />
              <span className="text-xs uppercase tracking-wider font-bold text-brand-plum">Current Plan</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-owner-heading">{sub.planName}</h3>
            <p className="text-xs text-owner-muted">
              Auto-renews on <strong className="text-owner-heading">{sub.renewalDate}</strong> at ₹{sub.price}/month.
            </p>
          </div>

          {/* Usage Meter */}
          <div className="w-full md:w-72 bg-white p-4 rounded-xl border border-owner-border space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-owner-muted font-medium">Monthly Orders Used</span>
              <span className="font-bold text-owner-heading">
                {sub.ordersProcessedThisMonth} / {sub.ordersLimit}
              </span>
            </div>
            <div className="w-full h-2.5 bg-owner-canvas rounded-full overflow-hidden">
              <div
                style={{ width: `${usagePercent}%` }}
                className="h-full bg-brand-plum rounded-full transition-all duration-500"
              />
            </div>
            <p className="text-3xs text-owner-muted">
              {sub.ordersLimit - sub.ordersProcessedThisMonth} orders remaining before limit
            </p>
          </div>
        </div>
      </Card>

      {/* Plan Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((p) => {
          const price = billingCycle === 'monthly' ? p.priceMonthly : Math.round(p.priceYearly / 12);
          return (
            <Card
              key={p.id}
              className={`p-6 flex flex-col justify-between relative ${
                p.current ? 'border-2 border-brand-plum shadow-card' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xs uppercase tracking-wider font-extrabold text-brand-plum bg-brand-blush px-2.5 py-1 rounded-full border border-brand-blush-border">
                    {p.badge}
                  </span>
                  {p.current && (
                    <Badge variant="success" size="sm">
                      Active
                    </Badge>
                  )}
                </div>

                <h4 className="font-serif font-bold text-lg text-owner-heading">{p.name}</h4>
                <div className="my-4">
                  <span className="text-3xl font-serif font-bold text-owner-heading">₹{price}</span>
                  <span className="text-xs text-owner-muted ml-1">/ month</span>
                </div>
                <p className="text-xs text-owner-muted mb-4 pb-4 border-b border-owner-border">
                  {p.orderLimit}
                </p>

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-owner-heading/90 mb-6">
                  {p.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {p.current ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() =>
                      toast.success(`Upgrade request for "${p.name}" sent to account manager!`)
                    }
                  >
                    Upgrade Plan <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
