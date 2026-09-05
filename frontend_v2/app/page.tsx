'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { storefrontApi } from '@/lib/api/storefront';
import { Shop } from '@/types/shop';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HeroSection } from '@/components/customer/marketplace/HeroSection';
import { BakeryGrid } from '@/components/customer/marketplace/BakeryGrid';
import { TrustBadges } from '@/components/customer/marketplace/TrustBadges';
import { OwnerCTA } from '@/components/customer/marketplace/OwnerCTA';
import { CategoryOption } from '@/components/customer/marketplace/CategoryPills';

export default function HomePage() {
  const router = useRouter();

  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeBusinessType, setActiveBusinessType] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationQuery, setLocationQuery] = useState<string>('');

  const loadShops = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await storefrontApi.searchShops({
        search: searchQuery || undefined,
        location: locationQuery || undefined,
        businessType: activeBusinessType,
      });
      setShops(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to discover bakeries.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, locationQuery, activeBusinessType]);

  useEffect(() => {
    loadShops();
  }, [loadShops]);

  const handleHeroSearch = (params: { search: string; location: string }) => {
    setSearchQuery(params.search);
    setLocationQuery(params.location);
  };

  const handleSelectCategory = (category: CategoryOption) => {
    setActiveCategory(category.id);
    setActiveBusinessType(category.businessType);
  };

  // Dynamic grid title based on city and category
  const getGridTitle = () => {
    const isNearby = locationQuery.toLowerCase().includes('near');
    const locPrefix = isNearby
      ? 'Near You'
      : locationQuery
      ? `in ${locationQuery}`
      : 'Across India';

    if (activeCategory !== 'ALL') {
      return `${activeCategory.replace(/_/g, ' ')} Bakeries ${locPrefix}`;
    }
    return `Featured Artisanal Bakeries ${locPrefix}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream-light">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Bakery Background */}
        <HeroSection
          onSearch={handleHeroSearch}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          selectedLocation={locationQuery}
          onSelectLocation={(loc) => setLocationQuery(loc)}
        />

        {/* Featured Bakeries Grid */}
        <BakeryGrid
          shops={shops}
          isLoading={isLoading}
          error={error}
          onRetry={loadShops}
          title={getGridTitle()}
          subtitle={
            locationQuery.toLowerCase().includes('near')
              ? 'Showing verified kitchens delivering freshly baked celebration cakes closest to your location'
              : locationQuery
              ? `Showing verified kitchens delivering freshly baked celebration cakes in ${locationQuery}`
              : 'Direct ordering from verified kitchens with dedicated in-store fulfillment across Indian cities'
          }
        />

        {/* Trust & Food Safety Guarantees */}
        <TrustBadges />

        {/* Call to Action for Bakery Owners */}
        <OwnerCTA />
      </main>

      <Footer />
    </div>
  );
}
