'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search, Palette, CreditCard, Truck,
  Store, Sliders, BellRing, TrendingUp,
  CheckCircle2, ChevronDown, Sparkles, ArrowRight,
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<'customers' | 'bakers'>('customers');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const customerSteps = [
    {
      icon: Search,
      number: '01',
      title: 'Discover Local Bakers',
      description: 'Enter your location (state, district, city, or area) to explore top-rated artisan home bakers and boutique cake shops near you.',
    },
    {
      icon: Palette,
      number: '02',
      title: 'Customize Your Dream Cake',
      description: 'Pick your flavor, weight, eggless preferences, custom messages, and upload reference photos for personalized designs.',
    },
    {
      icon: CreditCard,
      number: '03',
      title: 'Confirm Delivery Slot',
      description: 'Choose your preferred delivery date and time (including midnight delivery options) and securely place your order.',
    },
    {
      icon: Truck,
      number: '04',
      title: 'Fresh Doorstep Delivery',
      description: 'Your cake is baked fresh on the day of your event, carefully boxed, and safely delivered to your celebration.',
    },
  ];

  const bakerSteps = [
    {
      icon: Store,
      number: '01',
      title: 'Create Your Storefront',
      description: 'Sign up in 5 minutes, pick your bakery name, enter your location, and showcase your brand with a cover image and logo.',
    },
    {
      icon: Sliders,
      number: '02',
      title: 'Add Products & Menu',
      description: 'Upload your cake portfolio, configure weights, set flavors, eggless options, and delivery preparation lead times.',
    },
    {
      icon: BellRing,
      number: '03',
      title: 'Receive & Manage Orders',
      description: 'Say goodbye to scattered WhatsApp messages. Receive organized order sheets with custom text, delivery dates, and slot details.',
    },
    {
      icon: TrendingUp,
      number: '04',
      title: 'Grow & Collect Reviews',
      description: 'Get verified badge status, collect genuine ratings from dessert lovers in your neighborhood, and grow your repeat customer base.',
    },
  ];

  const faqs = [
    {
      question: 'How far in advance should I order a custom cake?',
      answer: 'Most home bakers require at least 24-48 hours for customized artisan cakes. Many bakeries also offer same-day delivery for standard signature cakes ordered before 2:00 PM.',
    },
    {
      question: 'Are all cakes made fresh to order?',
      answer: 'Yes! Unlike mass-market bakeries, our home bakers and artisan studios bake your cake specifically for your event on the delivery day to ensure maximum freshness and flavor.',
    },
    {
      question: 'Can I request eggless or gluten-free cakes?',
      answer: 'Absolutely. Over 90% of bakeries on CakeStore offer dedicated pure-veg eggless options, and you can filter specifically for Eggless Only right on the explore and storefront pages.',
    },
    {
      question: 'How do bakers receive payment?',
      answer: 'Customers can pay via UPI, cards, or pay on delivery depending on the bakery settings. For online payments, funds are deposited directly into the baker linked bank account.',
    },
    {
      question: 'What if I need to cancel or change the delivery address?',
      answer: 'You can modify or request changes by contacting the bakery directly through the order confirmation page or by reaching out to CakeStore customer support before baking has started.',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple, Transparent and Sweet</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-espresso tracking-tight">
            How CakeStore <span className="text-brand-plum italic">Works</span>
          </h1>
          <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Connecting passionate home bakers and boutique studios with dessert lovers for celebrations that matter.
          </p>
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-white border border-brand-border shadow-sm">
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'customers' ? 'bg-brand-plum text-white shadow-sm' : 'text-brand-muted hover:text-brand-espresso'
              }`}
            >
              For Cake Lovers
            </button>
            <button
              onClick={() => setActiveTab('bakers')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'bakers' ? 'bg-brand-plum text-white shadow-sm' : 'text-brand-muted hover:text-brand-espresso'
              }`}
            >
              For Bakery Owners
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {(activeTab === 'customers' ? customerSteps : bakerSteps).map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-7 border border-brand-border shadow-sm hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum group-hover:bg-brand-plum group-hover:text-white transition-colors">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-extrabold font-serif text-brand-plum/20">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-brand-espresso mb-2">{step.title}</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{step.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center gap-1 text-[10px] font-bold text-brand-plum uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-brand-blush via-white to-brand-blush/60 rounded-3xl p-8 sm:p-12 border border-brand-border shadow-sm mb-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-brand-espresso">
              {activeTab === 'customers' ? 'Ready to order your perfect celebration cake?' : 'Ready to launch your online bakery storefront?'}
            </h2>
            <p className="text-sm text-brand-muted mt-2">
              {activeTab === 'customers' ? 'Browse handcrafted cakes from trusted neighborhood bakers.' : 'Join verified home bakers and start accepting orders in under 10 minutes.'}
            </p>
          </div>
          <Link
            href={activeTab === 'customers' ? '/explore' : '/for-owners'}
            className="shrink-0 inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-brand-plum hover:bg-brand-plum-hover text-white text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <span>{activeTab === 'customers' ? 'Explore Bakeries' : 'Register Your Bakery'}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-brand-espresso">
              Frequently Asked <span className="text-brand-plum italic">Questions</span>
            </h2>
            <p className="text-sm text-brand-muted mt-2">Everything you need to know about ordering and selling on CakeStore</p>
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
                    <span className="font-bold text-sm text-brand-espresso">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-brand-plum shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-brand-muted leading-relaxed border-t border-brand-border/40">
                      {faq.answer}
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
