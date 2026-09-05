'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Store, Phone } from 'lucide-react';
import { Shop } from '@/types/shop';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface StorefrontNavbarProps {
  shop: Shop;
}

export const StorefrontNavbar: React.FC<StorefrontNavbarProps> = ({ shop }) => {
  const { totalItems, totalPrice, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Bakery Brand Identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="p-2 -ml-2 rounded-xl text-brand-muted hover:text-brand-espresso hover:bg-brand-cream/60 transition-colors"
            title="Explore other bakeries"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-blush text-brand-plum flex items-center justify-center font-serif font-bold text-base shadow-sm">
              {shop.businessName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base text-brand-espresso leading-none">
                  {shop.businessName}
                </h1>
                <Badge variant="plum" size="sm">
                  Storefront
                </Badge>
              </div>
              <span className="text-[11px] text-brand-muted">
                {shop.city}, {shop.state}
              </span>
            </div>
          </div>
        </div>

        {/* In-Store Actions */}
        <div className="flex items-center gap-3">
          {shop.businessPhone && (
            <a
              href={`tel:${shop.businessPhone}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-brand-muted hover:text-brand-plum px-3 py-1.5 rounded-full border border-brand-border/80"
            >
              <Phone className="w-3.5 h-3.5 text-brand-plum" />
              <span>{shop.businessPhone}</span>
            </a>
          )}

          {/* In-Store Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-plum text-white text-xs sm:text-sm font-semibold hover:bg-brand-plum-hover transition-all shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Store Cart</span>
            {totalItems > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-brand-plum text-[10px] font-bold">
                {totalItems} • ₹{totalPrice}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
