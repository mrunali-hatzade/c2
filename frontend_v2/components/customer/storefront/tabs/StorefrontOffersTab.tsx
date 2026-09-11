'use client';

import React, { useEffect, useState } from 'react';
import { Tag, Copy, Check, Sparkles, Percent, ArrowRight, ShieldCheck } from 'lucide-react';
import { Shop } from '@/types/shop';
import { StorefrontTab } from '../StorefrontTabNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/common/Toast';
import { apiClient } from '@/lib/api/client';

interface PublicCoupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrderValue?: number;
  maxDiscountCap?: number;
  expiryDate?: string;
}

interface StorefrontOffersTabProps {
  shop: Shop;
  onNavigateTab: (tab: StorefrontTab) => void;
}

export const StorefrontOffersTab: React.FC<StorefrontOffersTabProps> = ({
  shop,
  onNavigateTab,
}) => {
  const toast = useToast();
  const [coupons, setCoupons] = useState<PublicCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchCoupons() {
      try {
        const data = await apiClient.get<PublicCoupon[]>(`/api/storefront/shops/${shop.id}/coupons`);
        if (isMounted) {
          setCoupons(data || []);
        }
      } catch {
        if (isMounted) setCoupons([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchCoupons();
    return () => {
      isMounted = false;
    };
  }, [shop.id]);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Coupon "${code}" copied to clipboard!`);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold">
          <Tag className="w-3.5 h-3.5" />
          <span>Exclusive Bakery Discounts</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-espresso">
          Coupons &amp; Special Offers
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
          Apply these verified discount codes at checkout to enjoy savings on your handcrafted celebration cakes.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-brand-muted">
          Checking available offers for {shop.businessName}...
        </div>
      ) : coupons.length === 0 ? (
        <Card className="p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-cream flex items-center justify-center text-brand-plum mx-auto">
            <Tag className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-serif font-bold text-brand-espresso">No Active Promo Codes Right Now</h2>
          <p className="text-xs text-brand-muted max-w-md mx-auto">
            {shop.businessName} currently offers standard honest bakery pricing with zero markups. Check back soon for seasonal promotions!
          </p>
          <div className="pt-2">
            <Button onClick={() => onNavigateTab('shop')} className="font-bold">
              <span>Browse Cake Menu</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {coupons.map((coupon) => (
            <Card
              key={coupon.code}
              className="p-6 relative overflow-hidden border-2 border-dashed border-brand-border hover:border-brand-plum/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-brand-plum uppercase tracking-wider">
                      Bakery Offer
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-brand-espresso mt-0.5">
                      {coupon.discountType === 'PERCENTAGE'
                        ? `${coupon.discountValue}% OFF`
                        : `₹${coupon.discountValue} FLAT OFF`}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum shrink-0">
                    <Percent className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1 text-xs text-brand-muted">
                  {coupon.minOrderValue && coupon.minOrderValue > 0 && (
                    <p>• Min order value: <strong>₹{coupon.minOrderValue}</strong></p>
                  )}
                  {coupon.maxDiscountCap && coupon.maxDiscountCap > 0 && (
                    <p>• Maximum savings cap: <strong>₹{coupon.maxDiscountCap}</strong></p>
                  )}
                  {coupon.expiryDate && (
                    <p>• Valid till: <strong>{new Date(coupon.expiryDate).toLocaleDateString()}</strong></p>
                  )}
                </div>
              </div>

              {/* Code Box & Action */}
              <div className="mt-5 pt-4 border-t border-brand-border/60 flex items-center justify-between gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-brand-cream-light font-mono text-xs font-bold text-brand-espresso border border-brand-border tracking-wider">
                  {coupon.code}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(coupon.code)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-plum text-white text-xs font-bold hover:bg-brand-plum-hover transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Terms Box */}
      <div className="p-5 rounded-2xl bg-brand-cream-light/60 border border-brand-border/60 text-xs text-brand-muted space-y-1.5">
        <div className="flex items-center gap-1.5 text-brand-espresso font-semibold">
          <ShieldCheck className="w-4 h-4 text-brand-plum" />
          <span>How to use coupons:</span>
        </div>
        <p>1. Copy any active promo code above.</p>
        <p>2. Add your favorite handcrafted celebration cakes to the in-store cart.</p>
        <p>3. Paste the code into the &ldquo;Discount Coupon&rdquo; box in your cart drawer to see immediate savings applied.</p>
      </div>
    </div>
  );
};
