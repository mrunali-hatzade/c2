import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-plum-deep text-white/90 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-brand-plum flex items-center justify-center text-xl shadow-xs">
                🧁
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Cake<span className="text-brand-blush">Store</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed">
              CakeStore is India&apos;s leading multi-tenant bakery platform. Discover verified artisan bakers, customize cakes, and empower local bakery entrepreneurs to build their digital presence.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {["Twitter", "Instagram", "Facebook", "LinkedIn"].map((platform) => (
                <span
                  key={platform}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/80 hover:bg-brand-plum hover:text-white transition-colors cursor-pointer"
                >
                  {platform[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Column 3: Customer Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blush">
              For Customers
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/70">
              <li>
                <Link href="#bakeries" className="hover:text-white transition-colors">
                  Explore Bakeries
                </Link>
              </li>
              <li>
                <Link href="#featured-cakes" className="hover:text-white transition-colors">
                  Browse Cakes
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Bakery Owners */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blush">
              For Bakery Owners
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/70">
              <li>
                <Link href="#owner-cta" className="hover:text-white transition-colors">
                  Register Bakery
                </Link>
              </li>
              <li>
                <Link href="#owner-cta" className="hover:text-white transition-colors">
                  Owner Dashboard
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition-colors">
                  SaaS Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="#owner-cta" className="hover:text-white transition-colors">
                  Storefront Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Platform & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blush">
              Platform
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/70">
              <li>
                <Link href="#about" className="hover:text-white transition-colors">
                  About CakeStore
                </Link>
              </li>
              <li>
                <Link href="#blog" className="hover:text-white transition-colors">
                  Bakery Growth Blog
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© 2026 CakeStore SaaS Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>for bakeries everywhere</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
