import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export const OwnerCTA: React.FC = () => {
  const benefits = [
    "Get your own website",
    "Manage orders easily",
    "Grow your brand",
  ];

  return (
    <section id="owner-cta" className="py-14 sm:py-18 bg-brand-cream border-t border-brand-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-r from-brand-blush/80 via-white to-brand-blush/50 rounded-3xl sm:rounded-4xl p-8 sm:p-12 border border-brand-blush-border/80 shadow-card relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-plum-light/80 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Illustration / Baker Avatar */}
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden bg-white p-3 shadow-soft border border-brand-border flex items-center justify-center">
                <Image
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80"
                  alt="Pastry Chef Baker"
                  fill
                  className="object-cover rounded-2xl"
                  sizes="180px"
                />
              </div>
            </div>

            {/* Middle: Value Proposition & Checklist */}
            <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-plum-light text-brand-plum text-2xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>For Bakery Owners & Home Bakers</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-brand-espresso tracking-tight">
                Are you a <span className="text-brand-plum italic">Cake Baker</span>?
              </h3>

              <p className="text-sm sm:text-base text-brand-muted max-w-lg">
                Join CakeStore and transform your passion into a scalable business with your own branded storefront and automated kitchen order manager.
              </p>

              {/* Benefits Checklist */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-espresso"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-plum flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CTA Actions */}
            <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center space-y-3">
              <Link
                href="/for-owners"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-brand-plum hover:bg-brand-plum-hover text-white text-sm font-bold shadow-soft transition-all active:scale-95 text-center"
              >
                Register Your Bakery
              </Link>

              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-plum hover:text-brand-plum-hover transition-colors group"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
