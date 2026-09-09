'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Sparkles, HelpCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    'Custom branded online bakery storefront',
    'Unlimited cake products, sizes and flavor variants',
    '0% transaction fees, keep 100% of your earnings',
    'Direct UPI and card payments to your bank account',
    'Delivery slot and advance date booking calendar',
    'Instant WhatsApp order notifications',
    'Custom cake reference photo uploader',
    'Verified local baker badge and customer reviews',
    'Priority listing on local marketplace search',
    'Dedicated WhatsApp and phone support',
  ];

  const faqs = [
    {
      q: 'What is included in the plan?',
      a: 'Everything. You get your own full-featured digital bakery storefront, unlimited cake listings, kitchen order management, 0% transaction fees, and direct customer payments.',
    },
    {
      q: 'Are there any hidden setup fees or commissions?',
      a: 'No hidden charges. You only pay the flat subscription and keep 100% of your cake sales.',
    },
    {
      q: 'How do customer payouts work?',
      a: 'For online orders, customer payments are transferred directly into your linked bank account or UPI ID with zero deductions.',
    },
    {
      q: 'Do I need technical skills to set up my shop?',
      a: 'None at all. Our guided onboarding takes under 10 minutes. Upload your cake photos and prices, and your shop is ready to accept orders.',
    },
  ];

  const monthlyPrice = 350;
  const yearlyPricePerMonth = 292;
  const currentPrice = billing === 'monthly' ? monthlyPrice : yearlyPricePerMonth;

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple, Honest Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-espresso tracking-tight">
            One Plan. <span className="text-brand-plum italic">Everything Included.</span>
          </h1>
          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            No complicated tiers. No hidden commissions. Just everything you need to run a thriving online bakery.
          </p>

          <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-white border border-brand-border shadow-sm">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                billing === 'monthly' ? 'bg-brand-plum text-white shadow-sm' : 'text-brand-muted hover:text-brand-espresso'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                billing === 'yearly' ? 'bg-brand-plum text-white shadow-sm' : 'text-brand-muted hover:text-brand-espresso'
              }`}
            >
              Yearly
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                billing === 'yearly' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
              }`}>Save 17%</span>
            </button>
          </div>
        </div>

        <div className="max-w-xl mx-auto mb-16">
          <div className="bg-white rounded-3xl border-2 border-brand-plum shadow-lg p-8 sm:p-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-plum">All-in-One Baker Plan</span>
                <h2 className="text-2xl font-bold font-serif text-brand-espresso mt-1">Complete Bakery Suite</h2>
              </div>
              <div className="text-right">
                <div className="text-4xl font-extrabold font-serif text-brand-espresso">
                  <span className="text-lg font-bold">₹</span>{currentPrice}
                </div>
                <div className="text-xs text-brand-muted">/month{billing === 'yearly' ? ', billed yearly' : ''}</div>
                {billing === 'yearly' && (
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">₹3,500/year (save ₹700)</div>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-sm text-brand-espresso">{f}</span>
                </div>
              ))}
            </div>

            <Link
              href="/onboarding"
              className="w-full inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-brand-plum hover:bg-brand-plum-hover text-white text-base font-bold shadow-sm transition-all active:scale-95"
            >
              <span>Start Free 14-Day Trial</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-brand-muted">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>No credit card needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>0% commission on orders</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-brand-espresso">
              Got <span className="text-brand-plum italic">Questions?</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-brand-cream-light/50 transition-colors"
                  >
                    <span className="font-bold text-sm text-brand-espresso">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-brand-plum shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-brand-muted leading-relaxed border-t border-brand-border/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
