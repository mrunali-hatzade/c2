import React from 'react';
import { Store, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose a Verified Bakery',
      description: 'Explore certified artisanal kitchens, home bakers, and gourmet patisseries in your neighborhood.',
      icon: Store,
      badge: 'Local Discovery',
    },
    {
      number: '02',
      title: 'Customize Your Celebration',
      description: 'Choose cake weight with smart serving guides, select 100% eggless sponge, and add custom chocolate piping.',
      icon: Sparkles,
      badge: 'Bespoke Touch',
    },
    {
      number: '03',
      title: 'Fresh to Order Fulfillment',
      description: 'Your cake is freshly baked and set with temperature-controlled packaging for safe delivery or boutique pickup.',
      icon: ShieldCheck,
      badge: 'Oven-Fresh Guarantee',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-brand-cream/40 border-y border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blush border border-brand-border text-brand-plum text-xs font-semibold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Seamless Ordering Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-espresso tracking-tight">
            How CakeStore <span className="text-brand-plum italic">Works</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-brand-muted leading-relaxed">
            From local culinary discovery to your dining table in three simple, transparent steps.
          </p>
        </div>

        {/* 3 Step Connected Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white rounded-3xl p-6 sm:p-8 border border-brand-border/80 shadow-soft hover:shadow-elevated hover:border-brand-plum/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Step Top row: Icon + Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-blush text-brand-plum flex items-center justify-center group-hover:bg-brand-plum group-hover:text-white transition-colors duration-300 shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="font-serif font-extrabold text-3xl sm:text-4xl text-brand-border group-hover:text-brand-plum/20 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  {/* Badge */}
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-cream-light text-[11px] font-semibold text-brand-muted border border-brand-border mb-3">
                    {step.badge}
                  </span>

                  {/* Title & Description */}
                  <h3 className="text-base sm:text-lg font-bold text-brand-espresso mb-2 group-hover:text-brand-plum transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step Bottom Progress Indicator */}
                <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center justify-between text-2xs text-brand-muted font-medium">
                  <span>Step {idx + 1} of 3</span>
                  <span className="text-brand-plum font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {idx === 2 ? 'Enjoy celebration' : 'Next step'}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast CTA link */}
        <div className="mt-10 text-center">
          <p className="text-xs text-brand-muted">
            Are you a home baker or pastry chef?{' '}
            <Link
              href="/onboarding"
              className="text-brand-plum font-bold hover:underline inline-flex items-center gap-1"
            >
              Open your free store in 5 minutes
              <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
