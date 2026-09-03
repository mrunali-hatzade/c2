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
    <section id="hero" className="relative overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20">
      {/* Washed-out Full Width Bakery Photo Background */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1920&q=80"
          alt="Bakery background"
          fill
          priority
          className="object-cover"
        />
        {/* Soft cream overlay to wash out the image as a subtle texture */}
        <div className="absolute inset-0 bg-[#FCFAF7]/85 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Hero Copy & Search Form */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold tracking-wide shadow-2xs animate-in fade-in slide-in-from-top-2 duration-300">
              <Sparkles className="w-3.5 h-3.5 text-brand-plum" />
              <span>Find the best cakes from trusted bakers</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-bold font-serif text-brand-espresso tracking-tight leading-[1.14]">
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
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl sm:rounded-2xl bg-brand-plum hover:bg-brand-plum-hover text-white text-sm font-semibold transition-all shadow-soft active:scale-95 flex-shrink-0"
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
                    className="px-2.5 py-1 rounded-full bg-brand-cream border border-brand-border/80 text-brand-espresso hover:border-brand-plum/40 hover:text-brand-plum transition-colors"
                  >
                    {loc}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic (Positioned higher, shifted right with subtle stylish tilt) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end -translate-y-4 sm:-translate-y-6 lg:-translate-y-10 lg:translate-x-6 xl:translate-x-10">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-blush/90 rounded-full blur-3xl -z-10" />

            {/* Cake Showcase Card with angle tilt */}
            <div className="relative w-full max-w-[270px] sm:max-w-[310px] aspect-square group rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
              <div className="relative w-full h-full rounded-3xl sm:rounded-4xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85"
                  alt="Delicious artisanal chocolate cake"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
                
                {/* Floating Tag */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-brand-border/60 shadow-card flex items-center justify-between">
                  <div>
                    <p className="text-2xs uppercase tracking-wider font-bold text-brand-plum">Fresh Today</p>
                    <p className="text-xs font-bold text-brand-espresso truncate max-w-[150px]">Artisan Berry Truffle</p>
                  </div>
                  <span className="text-xs font-extrabold text-brand-plum bg-brand-blush px-2.5 py-1 rounded-full">
                    ★ 4.9
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
