'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  Heart,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  MessageCircle,
  CheckCircle2,
  ChefHat,
  Flame,
} from 'lucide-react';
import { Shop } from '@/types/shop';
import { StorefrontTab } from '../StorefrontTabNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface StorefrontAboutTabProps {
  shop: Shop;
  onNavigateTab: (tab: StorefrontTab) => void;
}

const FALLBACK_STUDIO_IMG = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80';

export const StorefrontAboutTab: React.FC<StorefrontAboutTabProps> = ({
  shop,
  onNavigateTab,
}) => {
  const [imgError, setImgError] = useState(false);

  const addressParts = [
    shop.addressLine1 || shop.address,
    shop.area,
    shop.city,
    shop.district,
    shop.state,
  ].filter(Boolean);

  const fullAddress =
    addressParts.length > 0
      ? `${addressParts.join(', ')}${shop.pincode ? ` - ${shop.pincode}` : ''}`
      : `${shop.city || 'Pune'}, ${shop.state || 'Maharashtra'}`;

  const mainImage = !imgError && (shop.coverImageUrl || shop.imageUrl || shop.bannerUrl)
    ? (shop.coverImageUrl || shop.imageUrl || shop.bannerUrl)!
    : FALLBACK_STUDIO_IMG;

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* 1. Header Intro */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Story &amp; Craft</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-espresso">
          About <span className="text-brand-plum italic">{shop.businessName}</span>
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted max-w-2xl mx-auto leading-relaxed">
          {shop.businessCategory || 'Artisanal Bakery & Celebration Cake Studio'} based in {shop.city}, {shop.state}
        </p>
      </div>

      {/* 2. Story Section with Main Image */}
      <Card className="p-6 sm:p-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual Bakery Image */}
          <div className="lg:col-span-5 relative group">
            <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-border/80 shadow-soft bg-brand-cream">
              <img
                src={mainImage}
                alt={`${shop.businessName} kitchen studio`}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 shadow-sm flex items-center gap-1.5 text-[11px] font-bold text-brand-plum">
                <ChefHat className="w-3.5 h-3.5 text-brand-plum" />
                <span>Artisan Kitchen</span>
              </div>

              {/* Bottom Overlay Info */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-bold font-serif leading-tight line-clamp-1">{shop.businessName}</p>
                <p className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{shop.area ? `${shop.area}, ` : ''}{shop.city}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-plum uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>Behind the Oven</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-espresso">
              Handcrafting Sweet Memories
            </h2>
            <p className="text-sm sm:text-base text-brand-espresso/85 leading-relaxed">
              {shop.businessDescription ||
                shop.description ||
                `Welcome to ${shop.businessName}. We are dedicated to the art of fine baking, blending artisanal craft with the freshest ingredients to make every celebration memorable.`}
            </p>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              Every creation is prepared fresh to order in our sanitized kitchen studio on the morning of your event. We believe celebration cakes should not only look breathtaking but taste deeply satisfying.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-brand-blush text-brand-plum font-semibold border border-brand-blush-border flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Baked Fresh
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Sanitized Kitchen
              </span>
              {shop.isPureVeg && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-800 font-semibold border border-green-200 flex items-center gap-1">
                  🌱 100% Pure Veg (Eggless)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Badges and Highlights — Kitchen Standards */}
        <div className="mt-8 pt-8 border-t border-brand-border/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-brand-cream-light/60 border border-brand-border/40 space-y-1.5 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum mb-1">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-brand-espresso">
              {shop.yearsInBusiness ? `${shop.yearsInBusiness}+ Years Experience` : 'Artisanal Studio'}
            </h3>
            <p className="text-[11px] text-brand-muted">
              Mastery in textures, sponges, ganache, and bespoke design.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-cream-light/60 border border-brand-border/40 space-y-1.5 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-brand-espresso">
              {shop.fssaiRegistration ? `FSSAI: ${shop.fssaiRegistration}` : 'Verified Food Safety'}
            </h3>
            <p className="text-[11px] text-brand-muted">
              Strict hygiene and compliance with certified safety standards.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-cream-light/60 border border-brand-border/40 space-y-1.5 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-1">
              <Heart className="w-5 h-5 fill-rose-500/20" />
            </div>
            <h3 className="text-xs font-bold text-brand-espresso">
              100% Baked Fresh
            </h3>
            <p className="text-[11px] text-brand-muted">
              Never frozen stock. Baked fresh to order on the delivery date.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-cream-light/60 border border-brand-border/40 space-y-1.5 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-brand-espresso">
              Direct Kitchen Delivery
            </h3>
            <p className="text-[11px] text-brand-muted">
              Carefully boxed and dispatched in dedicated time slots.
            </p>
          </div>
        </div>
      </Card>

      {/* 3. Location, Coverage & Delivery Policy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-blush text-brand-plum flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-brand-espresso">
                Kitchen Location &amp; Service Radius
              </h3>
              <p className="text-xs text-brand-muted">Direct doorstep delivery across</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-cream-light/70 border border-brand-border/60 text-xs space-y-2">
            <p className="font-semibold text-brand-espresso">{fullAddress}</p>
            <p className="text-brand-muted">
              Coverage Area: {shop.area || shop.city || 'Local area'}, {shop.city}, {shop.state}
            </p>
          </div>

          <p className="text-xs text-brand-muted leading-relaxed">
            All cakes are hand-carried in temperature-controlled protective packaging to ensure your tiered structures and delicate frostings arrive in pristine condition.
          </p>
        </Card>

        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-brand-espresso">
                Fulfillment &amp; Booking Lead Time
              </h3>
              <p className="text-xs text-brand-muted">Fresh baking schedule</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-brand-espresso">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Signature Cakes:</strong> Standard orders available with same-day and next-day scheduled slots.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Custom Theme &amp; Tier Cakes:</strong> Minimum 24 to 48 hours advance notice recommended.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Payment Methods:</strong> Cash on Delivery (COD) and Instant Online Payment (Cards/UPI).
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* 5. Action Bar */}
      <div className="p-8 rounded-3xl bg-brand-cream border border-brand-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="text-lg font-serif font-bold text-brand-espresso">
            Ready to taste our artisanal creations?
          </h3>
          <p className="text-xs text-brand-muted mt-0.5">
            Browse our live menu or speak directly with our chef for bespoke events.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => onNavigateTab('shop')} className="font-bold">
            Browse Cake Menu
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigateTab('custom-cakes')}
            className="font-semibold"
          >
            Custom Cake Inquiry
          </Button>
        </div>
      </div>
    </div>
  );
};
