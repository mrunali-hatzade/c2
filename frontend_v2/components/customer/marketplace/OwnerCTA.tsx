import React from 'react';
import Link from 'next/link';
import { Store, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const OwnerCTA: React.FC = () => {
  const benefits = [
    'Zero upfront setup fees',
    'Independent digital storefront branding',
    'Integrated delivery slot management',
    'Direct customer communication & custom requests',
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="relative rounded-3xl bg-brand-plum text-white overflow-hidden p-8 sm:p-14 shadow-elevated">
        {/* Background decorative tint */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-medium mb-4">
            <Store className="w-3.5 h-3.5 text-rose-300" />
            <span>Built for Artisanal Bakers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-snug">
            Scale Your Bakery with an Independent Digital Storefront
          </h2>

          <p className="mt-3 text-sm sm:text-base text-rose-100 font-light leading-relaxed">
            Stop relying on chaotic WhatsApp chats and spreadsheets. CakeStore equips boutique cake artists with automated delivery slots, structured orders, and online catalogs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-xs text-rose-100">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/onboarding">
              <Button size="lg" className="bg-white text-brand-plum hover:bg-rose-50 shadow-md">
                Register Your Bakery <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                Existing Owner Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
