"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight,
  Store
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plan = {
    name: "All-in-One Baker Plan",
    badge: "Complete Bakery Suite",
    priceMonthly: 350,
    priceYearly: 3500, // 2 months free
    description: "Everything you need to launch your bakery storefront, accept customer orders, and scale your business.",
    features: [
      "Custom branded online bakery storefront",
      "Unlimited cake products, sizes & flavor variants",
      "0% transaction fees (keep 100% of your earnings)",
      "Direct UPI & card payments to your bank account",
      "Delivery slot & advance date booking calendar",
      "Instant WhatsApp order notifications",
      "Custom cake reference photo uploader",
      "Verified local baker badge & customer reviews",
      "Priority listing on local marketplace search",
      "Dedicated WhatsApp & phone support",
    ],
    ctaText: "Get Started Now",
    ctaLink: "/onboarding",
  };

  const faqs = [
    {
      q: "What is included in the ₹350/month plan?",
      a: "Everything! You get your own full-featured digital bakery storefront, unlimited cake listings, kitchen order management, 0% transaction fees, and direct customer payments.",
    },
    {
      q: "Are there any hidden setup fees or commissions?",
      a: "No hidden charges. You only pay ₹350/month flat and keep 100% of your cake sales.",
    },
    {
      q: "How do customer payouts work?",
      a: "For online orders, customer payments are transferred directly into your linked bank account or UPI ID with zero deductions.",
    },
    {
      q: "Do I need technical skills to set up my shop?",
      a: "None at all! Our guided onboarding takes under 10 minutes. Upload your cake photos and prices, and your shop is ready to accept orders.",
    },
  ];

  const currentPrice = billingCycle === "monthly" ? plan.priceMonthly : Math.round(plan.priceYearly / 12);

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans flex flex-col">
      <Navbar selectedLocation="Akurdi" onSelectLocation={() => {}} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Title */}
        <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple, Affordable & Transparent</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-espresso tracking-tight whitespace-normal sm:whitespace-nowrap">
            Simple Plans to Grow Your <span className="text-brand-plum italic">Cake Business</span>
          </h1>

          <p className="text-base sm:text-lg text-brand-muted max-w-4xl w-full mx-auto leading-relaxed">
            Choose the right plan to bring your bakery storefront online, streamline your kitchen orders, and delight your local customers.
          </p>

          {/* Billing Cycle Switch */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-brand-border shadow-2xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-brand-plum text-white shadow-soft"
                  : "text-brand-muted hover:text-brand-espresso"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-brand-plum text-white shadow-soft"
                  : "text-brand-muted hover:text-brand-espresso"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-2xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Save 2 Months
              </span>
            </button>
          </div>
        </div>

        {/* Single Centered Pricing Card */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-brand-plum/30 shadow-card relative flex flex-col justify-between">
            {/* Top Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-plum text-white text-2xs font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{plan.badge}</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum">
                  <Store className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  0% Commission
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-brand-espresso">
                {plan.name}
              </h3>

              <p className="text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed">
                {plan.description}
              </p>

              {/* Price Display */}
              <div className="mt-6 mb-6 pb-6 border-b border-brand-border/60">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-extrabold font-serif text-brand-espresso">
                    ₹{currentPrice}
                  </span>
                  <span className="text-sm text-brand-muted font-medium">
                    / month
                  </span>
                </div>
                {billingCycle === "yearly" && (
                  <p className="text-xs text-emerald-700 font-bold mt-1.5">
                    Billed annually at ₹{plan.priceYearly}/year (Includes 2 months free!)
                  </p>
                )}
              </div>

              {/* Features List */}
              <div className="space-y-3.5">
                <p className="text-2xs font-bold text-brand-espresso uppercase tracking-wider">
                  Everything included in your plan:
                </p>
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-brand-espresso/80">
                    <div className="w-4 h-4 rounded-full bg-brand-blush text-brand-plum flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-6 border-t border-brand-border/60">
              <Link
                href={plan.ctaLink}
                className="w-full py-4 rounded-2xl bg-brand-plum hover:bg-brand-plum-hover text-white text-sm font-bold shadow-soft transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{plan.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-2xs text-center text-brand-muted mt-2.5">
                Cancel anytime. No setup fees or lock-in contracts.
              </p>
            </div>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="bg-white rounded-3xl p-8 border border-brand-border shadow-soft max-w-2xl mx-auto mb-16 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-serif text-brand-espresso">
              100% Risk-Free Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
              Try CakeStore for your bakery. If you are not completely satisfied, easily cancel your subscription anytime with zero questions asked.
            </p>
          </div>
        </div>

        {/* Pricing FAQs */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-brand-espresso">
              Pricing <span className="text-brand-plum italic">Questions</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              Common questions about the ₹350/month plan
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-brand-border shadow-2xs">
                <h4 className="font-bold text-sm text-brand-espresso mb-2 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-plum shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
