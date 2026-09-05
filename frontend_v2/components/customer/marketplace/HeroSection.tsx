'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ShieldCheck, Heart, Clock } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryPills, CategoryOption } from './CategoryPills';

interface HeroSectionProps {
  onSearch: (params: { search: string; location: string }) => void;
  activeCategory: string;
  onSelectCategory: (category: CategoryOption) => void;
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  activeCategory,
  onSelectCategory,
  selectedLocation,
  onSelectLocation,
}) => {
  return (
    <section className="relative isolate overflow-hidden bg-brand-cream-light py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-brand-border/60">
      {/* Background Bakers & Cake Kitchen Artwork on the Right */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/marketplace-hero-bakers.jpg"
          alt="Artisanal bakers preparing custom celebration cakes in Indian bakery kitchens"
          fill
          priority
          className="object-cover object-right sm:object-center opacity-75"
        />
        {/* Soft Warm Cream Gradient Overlay for crisp text legibility without muddy blur */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cream-light via-brand-cream-light/95 sm:via-brand-cream-light/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream-light/50 via-transparent to-brand-cream-light" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold tracking-wide shadow-2xs mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-plum" />
          <span>Verified Indian Artisanal Bakery Network</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-brand-espresso leading-[1.15] max-w-4xl mx-auto">
          Handcrafted Cakes from <br className="hidden sm:inline" />
          <span className="text-brand-plum italic">Exceptional Local Bakeries</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-brand-muted max-w-2xl mx-auto font-normal leading-relaxed">
          Discover certified boutique bakers in Mumbai, Pune, Bengaluru, Delhi NCR and beyond. Order directly from their independent storefronts.
        </p>

        {/* Central Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <SearchBar
            initialLocation={selectedLocation}
            onSearch={onSearch}
            className="shadow-elevated"
          />
        </div>

        {/* Quick Category Filter Pills */}
        <div className="mt-6 flex justify-center">
          <CategoryPills
            activeCategory={activeCategory}
            onSelectCategory={onSelectCategory}
          />
        </div>

        {/* Trust Badges under Hero */}
        <div className="mt-10 pt-6 border-t border-brand-border/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-brand-muted font-medium">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>FSSAI Verified Kitchens</span>
          </span>
          <span className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>100% Handcrafted Small-Batch</span>
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Dedicated In-Store Fulfillment</span>
          </span>
        </div>
      </div>
    </section>
  );
};
