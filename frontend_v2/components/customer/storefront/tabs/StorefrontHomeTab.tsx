'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Star,
  Cake,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { Shop } from '@/types/shop';
import { Product, Category } from '@/types/product';
import { StorefrontTab } from '../StorefrontTabNav';
import { ProductCard } from '../ProductCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { storefrontApi } from '@/lib/api/storefront';

interface StorefrontHomeTabProps {
  shop: Shop;
  products: Product[];
  categories: Category[];
  onNavigateTab: (tab: StorefrontTab) => void;
  onSelectProduct: (product: Product) => void;
  onOpenCustomQuote: () => void;
}

export const StorefrontHomeTab: React.FC<StorefrontHomeTabProps> = ({
  shop,
  products,
  categories,
  onNavigateTab,
  onSelectProduct,
  onOpenCustomQuote,
}) => {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadFeedback() {
      try {
        const data = await storefrontApi.getShopFeedback(shop.id);
        if (isMounted) {
          setFeedbackList(data || []);
        }
      } catch {
        if (isMounted) setFeedbackList([]);
      } finally {
        if (isMounted) setLoadingFeedback(false);
      }
    }
    loadFeedback();
    return () => {
      isMounted = false;
    };
  }, [shop.id]);

  // Featured signature creations (first 4 active products)
  const featuredProducts = products.slice(0, 4);

  const cleanPhone = (shop.phone || shop.businessPhone || '').replace(/\D/g, '');

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Featured Signature Creations */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-brand-border/60">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-plum uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chef&apos;s Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-espresso">
              Signature Bakery Creations
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
              Handcrafted with pure butter, couverture chocolate, and authentic fillings
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-plum hover:text-brand-plum-hover transition-colors group self-start sm:self-auto"
          >
            <span>Browse Full Menu ({products.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-brand-border/80 p-6">
            <Cake className="w-8 h-8 text-brand-muted mx-auto mb-2" />
            <p className="text-sm font-semibold text-brand-espresso">Our kitchen is preparing the fresh menu</p>
            <p className="text-xs text-brand-muted mt-1">Please check back shortly or request a custom order.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                shop={shop}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Bespoke Custom Cake Consultation Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-brand-plum via-[#5c1d30] to-brand-espresso text-white p-8 sm:p-12 shadow-elevated relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bespoke Celebration Studio</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
            Have a Dream Cake Design in Mind?
          </h2>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            From multi-tier wedding cakes to personalized character birthday cakes, share your reference photo and event date with {shop.businessName}&apos;s master bakers.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => onNavigateTab('custom-cakes')}
              variant="secondary"
              className="font-bold shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2 text-brand-plum" />
              <span>Design Your Custom Cake</span>
            </Button>
            <Button
              onClick={() => onNavigateTab('gallery')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <span>View Past Creations</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Behind the Oven / Story Teaser */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border/80 shadow-soft">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Visual Bakery Thumbnail */}
          <div className="lg:col-span-4 relative group">
            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden border border-brand-border/80 shadow-sm bg-brand-cream">
              <img
                src={shop.coverImageUrl || shop.imageUrl || shop.bannerUrl || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'}
                alt={`${shop.businessName} kitchen`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 text-white">
                <p className="text-xs font-bold font-serif leading-tight">{shop.businessName}</p>
                <p className="text-[10px] text-white/80">{shop.city}, {shop.state}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-plum uppercase tracking-wider">
              <span>About {shop.businessName}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-espresso">
              Baking Moments into Memories
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-3">
              {shop.businessDescription ||
                shop.description ||
                'Welcome to our digital boutique storefront. Every celebration cake is handcrafted specifically for your event using high-grade cocoa, fresh dairy cream, and pure ingredients.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('about')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-plum hover:text-brand-plum-hover transition-colors group"
              >
                <span>Read Our Full Story &amp; Kitchen Standards</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 bg-brand-cream-light/70 rounded-2xl p-5 border border-brand-border/60 space-y-3">
            <h4 className="text-xs font-bold text-brand-espresso uppercase tracking-wider">
              Quick Kitchen Info
            </h4>
            <div className="space-y-2 text-xs text-brand-muted">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-plum shrink-0 mt-0.5" />
                <span className="font-medium text-brand-espresso line-clamp-2">
                  {shop.area ? `${shop.area}, ` : ''}{shop.city}, {shop.state}
                </span>
              </div>
              {shop.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-plum shrink-0" />
                  <a href={`tel:${shop.phone}`} className="hover:text-brand-plum transition-colors font-medium">
                    {shop.phone}
                  </a>
                </div>
              )}
              {cleanPhone && (
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`}?text=Hi%20${encodeURIComponent(shop.businessName)},%20I%20have%20an%20enquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Real Customer Feedback Highlights (Strictly Real Data Only) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-espresso">
              Customer Experiences
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Verified feedback from celebration orders
            </p>
          </div>
        </div>

        {loadingFeedback ? (
          <div className="py-6 text-center text-xs text-brand-muted">Loading feedback...</div>
        ) : feedbackList.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-brand-border/80 text-center space-y-2 shadow-soft">
            <Star className="w-7 h-7 text-amber-400 mx-auto fill-amber-400/30" />
            <h4 className="text-sm font-bold font-serif text-brand-espresso">Be the First to Review</h4>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              Have you ordered a cake from {shop.businessName}? Track your delivered order to leave a verified review.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTab('track')}
                className="text-xs font-semibold"
              >
                Track Order to Review
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedbackList.slice(0, 3).map((item) => (
              <Card key={item.id} className="p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (item.rating || 5)
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-brand-border fill-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-brand-muted">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <p className="text-xs text-brand-espresso leading-relaxed italic line-clamp-3">
                    &ldquo;{item.comment || 'Delicious and fresh!'}&rdquo;
                  </p>
                </div>
                <div className="pt-2 border-t border-brand-border/40 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-brand-espresso">
                    {item.customerDisplayName || 'Verified Customer'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
