'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, ShieldCheck, Clock, Store, Mail, Phone, MessageCircle } from 'lucide-react';
import { Shop } from '@/types/shop';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/common/StatusBadge';

interface StorefrontBannerProps {
  shop: Shop;
}

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=80';

export const StorefrontBanner: React.FC<StorefrontBannerProps> = ({ shop }) => {
  const [coverSrc, setCoverSrc] = useState(
    shop.coverImageUrl && !shop.coverImageUrl.includes('example.com')
      ? shop.coverImageUrl
      : FALLBACK_COVER
  );

  const [logoSrc, setLogoSrc] = useState<string | null>(
    shop.logoUrl && !shop.logoUrl.includes('example.com') ? shop.logoUrl : null
  );

  const cleanPhone = (shop.phone || shop.businessPhone || '9876543210').replace(/\D/g, '');

  const addressParts = [
    shop.addressLine1 || shop.address,
    shop.area,
    shop.city,
    shop.state,
  ].filter(Boolean);

  const displayAddress =
    addressParts.length > 0
      ? `${addressParts.join(', ')}${shop.pincode ? ` - ${shop.pincode}` : ''}`
      : 'Akurdi Main Road, Pune, Maharashtra - 411035';

  return (
    <section className="bg-white border-b border-brand-border/60">
      {/* High-Resolution Hero Cover Photo */}
      <div className="h-48 sm:h-64 w-full relative overflow-hidden bg-brand-espresso">
        <Image
          src={coverSrc}
          alt={shop.businessName}
          fill
          priority
          className="object-cover object-center"
          onError={() => setCoverSrc(FALLBACK_COVER)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-14 sm:-mt-16">
          {/* Avatar and Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 flex-1 min-w-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-elevated flex items-center justify-center shrink-0 overflow-hidden relative z-10">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={shop.businessName}
                  className="w-full h-full object-cover"
                  onError={() => setLogoSrc(null)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-plum to-[#4a1525] text-white font-serif font-bold text-3xl shadow-inner">
                  {shop.businessName.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-espresso tracking-tight">
                  {shop.businessName}
                </h1>
                <StatusBadge status={shop.status} />
                {shop.isPureVeg && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                    🌱 100% Pure Veg
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-brand-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-plum shrink-0" />
                  <span className="font-medium">{displayAddress}</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-cream text-brand-espresso text-[11px] font-medium border border-brand-border/60">
                  {shop.businessCategory || shop.businessType?.replace(/_/g, ' ') || 'Artisanal Bakery'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Compliance, Operating Meta & Quick Contact */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            {/* WhatsApp Contact */}
            <a
              href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`}?text=Hi%20${encodeURIComponent(shop.businessName)},%20I%20am%20interested%20in%20ordering%20a%20custom%20cake.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>

            {shop.fssaiRegistration ? (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>FSSAI: {shop.fssaiRegistration}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-brand-cream border border-brand-border text-brand-espresso text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-brand-plum" />
                <span>Verified Kitchen</span>
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Accepting Orders</span>
            </div>
          </div>
        </div>

        {/* Bio / Description */}
        <div className="mt-6 pt-6 border-t border-brand-border/60 max-w-3xl">
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            {shop.businessDescription ||
              'Welcome to our digital boutique storefront. Every cake is handcrafted fresh for your celebration using premium couverture chocolate, pure butter, and authentic fillings.'}
          </p>
        </div>
      </div>
    </section>
  );
};
