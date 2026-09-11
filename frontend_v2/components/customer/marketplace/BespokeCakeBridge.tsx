import React from 'react';
import Link from 'next/link';
import { Sparkles, Palette, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const BespokeCakeBridge: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="relative rounded-3xl bg-gradient-to-br from-brand-blush via-white to-brand-cream border border-brand-border/80 p-8 sm:p-12 shadow-soft overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-plum/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-blush-border text-brand-plum text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Celebration Studio</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-espresso tracking-tight leading-snug">
              Need a One-of-a-Kind <br className="hidden sm:inline" />
              <span className="text-brand-plum italic">Custom Designer Cake?</span>
            </h2>

            <p className="text-xs sm:text-sm text-brand-muted max-w-xl leading-relaxed">
              Planning a wedding, milestone birthday, or themed celebration? Connect directly with master pastry chefs and custom cake artists. Share reference photos, customize flavors, and receive personal estimates via WhatsApp.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-brand-espresso">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-brand-plum shrink-0 border border-brand-border/60 shadow-2xs">
                  <Palette className="w-4 h-4" />
                </div>
                <span className="font-medium">Any Theme or Photo</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-brand-espresso">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-brand-plum shrink-0 border border-brand-border/60 shadow-2xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="font-medium">Direct WhatsApp Quote</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-brand-espresso">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-brand-plum shrink-0 border border-brand-border/60 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="font-medium">Advance Slot Booking</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link href="/explore?businessType=CAKE_STUDIO">
                <Button size="md" className="gap-2 rounded-xl font-bold shadow-sm">
                  <span>Browse Custom Studios</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="md" className="rounded-xl font-semibold">
                  How Custom Orders Work
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-2xl bg-white border border-brand-border p-5 shadow-elevated space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                <span className="text-xs font-bold text-brand-espresso uppercase tracking-wider">How Bespoke Works</span>
                <span className="text-[10px] bg-brand-blush text-brand-plum px-2 py-0.5 rounded-full font-bold">3 Easy Steps</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-plum text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="font-semibold text-brand-espresso">Select an artisan bakery</p>
                    <p className="text-[11px] text-brand-muted">Find local studios specializing in theme cakes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-plum text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="font-semibold text-brand-espresso">Tap &quot;Request Custom Cake&quot;</p>
                    <p className="text-[11px] text-brand-muted">Send reference photos, flavor & event date.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-plum text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="font-semibold text-brand-espresso">Confirm quote & delivery</p>
                    <p className="text-[11px] text-brand-muted">Baker bakes fresh and delivers to your venue.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
