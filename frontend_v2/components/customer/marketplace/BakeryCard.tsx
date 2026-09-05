'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Store, Star, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { Shop } from '@/types/shop';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/common/StatusBadge';

interface BakeryCardProps {
  shop: Shop;
}

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';

export const BakeryCard: React.FC<BakeryCardProps> = ({ shop }) => {
  const [coverSrc, setCoverSrc] = useState(shop.coverImageUrl || shop.imageUrl || FALLBACK_COVER);

  return (
    <Card hoverEffect className="h-full flex flex-col overflow-hidden border-brand-border/80 bg-white group p-0">
      {/* Bakery Cover Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-cream">
        <Image
          src={coverSrc}
          alt={shop.businessName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={() => setCoverSrc(FALLBACK_COVER)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <StatusBadge status={shop.status} />
            {shop.isPureVeg && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                🌱 Pure Veg
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-brand-espresso font-bold text-xs shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{shop.rating || 4.8}</span>
            {shop.reviewCount && (
              <span className="text-[10px] text-brand-muted font-normal">({shop.reviewCount})</span>
            )}
          </div>
        </div>

        {/* Floating Brand Avatar Logo */}
        <div className="absolute -bottom-4 left-5 w-12 h-12 rounded-2xl bg-white border-2 border-white shadow-elevated overflow-hidden flex items-center justify-center text-brand-plum font-serif font-bold text-lg shrink-0">
          {shop.logoUrl ? (
            <img src={shop.logoUrl} alt={shop.businessName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blush to-brand-cream text-brand-plum font-bold">
              {shop.businessName.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Bakery Details */}
      <div className="pt-6 p-5 flex flex-col flex-1">
        {/* Bakery Title */}
        <h3 className="font-serif font-bold text-lg text-brand-espresso line-clamp-1 group-hover:text-brand-plum transition-colors">
          {shop.businessName}
        </h3>

        {/* Location */}
        <div className="flex items-center text-xs text-brand-muted mt-1 gap-1">
          <MapPin className="w-3.5 h-3.5 text-brand-plum shrink-0" />
          <span className="line-clamp-1">
            {shop.area ? `${shop.area}, ` : ''}{shop.city}, {shop.state}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-brand-muted mt-2.5 line-clamp-2 flex-1 leading-relaxed">
          {shop.businessDescription || 'Artisanal cakes and gourmet desserts crafted fresh with premium ingredients.'}
        </p>

        {/* Meta Specs */}
        <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-cream text-brand-espresso/80 text-[11px] font-medium">
            {shop.businessCategory || shop.businessType?.replace(/_/g, ' ') || 'Artisanal Bakery'}
          </span>
          {shop.deliveryTimeMinutes && (
            <span className="text-[11px] text-brand-muted flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-plum" />
              {shop.deliveryTimeMinutes} mins
            </span>
          )}
        </div>

        {/* Direct CTA */}
        <div className="mt-4 pt-2">
          <Link href={`/shop/${shop.id}`} className="block">
            <Button variant="outline" size="sm" className="w-full justify-between group">
              <span className="inline-flex items-center">
                <Store className="w-3.5 h-3.5 mr-1.5 text-brand-plum" />
                Visit Storefront
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-plum transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
