import React from 'react';
import Link from 'next/link';
import { Cake, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-brand-border/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-plum text-white flex items-center justify-center">
                <Cake className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold text-brand-espresso">CakeStore</span>
            </div>
            <p className="text-xs text-brand-muted max-w-sm leading-relaxed">
              Empowering independent home bakers and boutique cake studios with digital storefronts, order management, and custom cake booking infrastructure.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>FSSAI Compliant Platform</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold text-brand-espresso uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <Link href="/explore" className="hover:text-brand-plum transition-colors">All Bakeries</Link>
              </li>
              <li>
                <Link href="/explore?businessType=HOME_BAKER" className="hover:text-brand-plum transition-colors">Home Bakers</Link>
              </li>
              <li>
                <Link href="/explore?businessType=CUSTOM_CAKE_STUDIO" className="hover:text-brand-plum transition-colors">Custom Cake Studios</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-brand-plum transition-colors">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* For Bakers */}
          <div>
            <h4 className="text-xs font-semibold text-brand-espresso uppercase tracking-wider mb-3">
              For Bakers
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <Link href="/for-owners" className="hover:text-brand-plum transition-colors">Why CakeStore?</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brand-plum transition-colors">Plans & Pricing</Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-brand-plum transition-colors">Register Your Bakery</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-plum transition-colors">Owner Portal Login</Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-brand-espresso uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <Link href="/contact" className="hover:text-brand-plum transition-colors">Contact & Support</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brand-plum transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-brand-plum transition-colors">How It Works</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-4">
          <p>© 2026 CakeStore SaaS Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted for artisanal bakers with <Heart className="w-3.5 h-3.5 text-brand-crimson fill-brand-crimson" />
          </p>
        </div>
      </div>
    </footer>
  );
};

