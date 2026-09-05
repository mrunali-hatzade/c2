"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Search, Sparkles } from "lucide-react";
import { POPULAR_LOCATIONS } from "@/lib/constants/categories";

interface HeroSectionProps {
  locationQuery: string;
  onLocationChange: (loc: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  locationQuery,
  onLocationChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <section id="hero" className="relative isolate overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20">
      {/* Full Width Bakery & Cake Artists Photo Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/marketplace-hero-bakers.jpg"
          alt="Artisan bakers decorating cakes"
          fill
          priority
          className="object-cover object-right sm:object-center"
        />
        {/* Soft gradient overlay for crisp text readability on the left while showcasing bakers & cakes on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FCFAF7] via-[#FCFAF7]/75 sm:via-[#FCFAF7]/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Copy & Search Form */}
        <div className="max-w-2xl lg:max-w-3xl flex flex-col items-start space-y-6 py-4 lg:py-8">
          
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold tracking-wide shadow-2xs animate-in fade-in slide-in-from-top-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-brand-plum" />
            <span>Find the best cakes from trusted bakers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold font-serif text-brand-espresso tracking-tight leading-[1.14]">
            Celebrate Every Moment <br />
            <span className="text-brand-plum italic">with the Perfect Cake</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-brand-muted max-w-xl leading-relaxed">
            Discover amazing home bakers and boutique cake shops near you.
            Freshly baked with love, customized for any special occasion.
          </p>

          {/* Integrated Search Box */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-card flex flex-col sm:flex-row items-stretch gap-2 transition-all focus-within:border-brand-plum/40 focus-within:shadow-card-hover"
          >
            {/* Location Selector Input */}
            <div className="relative flex-1 flex items-center px-3 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-brand-border/60">
              <MapPin className="w-4 h-4 text-brand-plum flex-shrink-0 mr-2.5" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => onLocationChange(e.target.value)}
                onFocus={() => setIsLocationDropdownOpen(true)}
                placeholder="Enter your location..."
                className="w-full text-xs sm:text-sm font-medium text-brand-espresso placeholder:text-brand-muted/70 bg-transparent focus:outline-none"
              />

              {/* Autocomplete Dropdown */}
              {isLocationDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsLocationDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-brand-border rounded-xl shadow-card py-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-2xs font-bold uppercase tracking-wider text-brand-muted">
                      Popular Locations
                    </div>
                    {POPULAR_LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          onLocationChange(loc);
                          setIsLocationDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-brand-espresso hover:bg-brand-plum-light hover:text-brand-plum transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-3 h-3 text-brand-plum/60" />
                        {loc}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Cake Search Input */}
            <div className="flex-[1.4] flex items-center px-3 py-2 sm:py-0">
              <Search className="w-4 h-4 text-brand-muted flex-shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search cakes, flavors, occasions..."
                className="w-full text-xs sm:text-sm font-medium text-brand-espresso placeholder:text-brand-muted/70 bg-transparent focus:outline-none"
              />
            </div>

            {/* Search Action Button */}
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl sm:rounded-2xl bg-brand-plum hover:bg-brand-plum-hover text-white text-sm font-semibold transition-all shadow-soft active:scale-95 flex-shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Fast Location Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted pt-1">
            <span className="flex items-center gap-1 font-semibold text-brand-espresso">
              <MapPin className="w-3.5 h-3.5 text-brand-muted" />
              Popular:
            </span>
            {["Akurdi", "Ravet", "Baner", "Nigdi", "Bhandara", "Nagpur", "Wakad"].map(
              (loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    onLocationChange(loc);
                    onSearchSubmit();
                  }}
                  className="px-2.5 py-1 rounded-full bg-brand-cream border border-brand-border/80 text-brand-espresso hover:border-brand-plum/40 hover:text-brand-plum transition-colors cursor-pointer"
                >
                  {loc}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
