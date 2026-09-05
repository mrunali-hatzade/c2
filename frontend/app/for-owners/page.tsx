"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, ArrowRight, Store, TrendingUp, ShieldCheck, Sparkles } from "lucide-react";

export default function ForOwnersPage() {
  const perks = [
    "Dedicated custom bakery website & domain",
    "Digital menu builder with real-time stock & prices",
    "Automated kitchen order alerts & delivery slot control",
    "Direct online customer payments via UPI & Cards",
    "Verified local bakery badge to boost trust",
    "Zero technical experience needed — live in 10 minutes",
  ];

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans flex flex-col">
      <Navbar selectedLocation="Akurdi" onSelectLocation={() => {}} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CakeStore Partner Program</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-espresso tracking-tight whitespace-normal sm:whitespace-nowrap">
            Take Your Cake Business <span className="text-brand-plum italic">Online Today</span>
          </h1>

          <p className="text-base sm:text-lg text-brand-muted max-w-4xl w-full mx-auto leading-relaxed">
            Whether you bake delicious cakes from home or run a boutique cake studio, CakeStore gives you all the tools to accept orders, manage your kitchen, and delight customers.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-brand-plum hover:bg-brand-plum-hover text-white text-base font-bold shadow-soft transition-all active:scale-95 text-center"
            >
              <span>Register Your Bakery</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white border border-brand-border text-brand-espresso text-base font-semibold hover:bg-brand-cream transition-colors text-center"
            >
              View Pricing & Plans
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-7 border border-brand-border shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum mb-4">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-brand-espresso mb-2.5">Your Own Storefront</h3>
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              Showcase your cakes with beautiful photos, custom cake flavors, weight options, and dietary preferences.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-brand-border shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-brand-espresso mb-2.5">Automate Orders</h3>
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              Say goodbye to messy WhatsApp chats. Get organized order sheets with custom cake messages and delivery dates.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-brand-border shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-brand-espresso mb-2.5">Build Local Trust</h3>
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              Gather genuine verified reviews from dessert lovers in your neighborhood and get featured in local searches.
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-brand-border shadow-soft">
          <h2 className="text-xl font-bold font-serif text-brand-espresso mb-6 text-center sm:text-left">
            Everything you need to run your cake shop smoothly
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {perks.map((perk, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-plum shrink-0 mt-0.5" />
                <span className="text-sm text-brand-espresso font-medium">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
