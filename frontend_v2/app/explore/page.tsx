'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { storefrontApi } from '@/lib/api/storefront';
import { Shop } from '@/types/shop';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { SearchBar } from '@/components/common/SearchBar';
import { BakeryGrid } from '@/components/customer/marketplace/BakeryGrid';
import { CategoryPills, CategoryOption } from '@/components/customer/marketplace/CategoryPills';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialType = searchParams.get('businessType') || undefined;

  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>(initialType || 'ALL');
  const [activeBusinessType, setActiveBusinessType] = useState<string | undefined>(initialType);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [locationQuery, setLocationQuery] = useState<string>(initialLocation);

  const fetchShops = useCallback(async () => {
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
      setError(err.message || 'Failed to load bakeries');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, locationQuery, activeBusinessType]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const handleSearch = (params: { search: string; location: string }) => {
    setSearchQuery(params.search);
    setLocationQuery(params.location);
  };

  const handleSelectCategory = (category: CategoryOption) => {
    setActiveCategory(category.id);
    setActiveBusinessType(category.businessType);
  };

  const getTitle = () => {
    const locPrefix = locationQuery ? `in ${locationQuery}` : 'Across India';
    if (activeCategory !== 'ALL') {
      return `${activeCategory.replace(/_/g, ' ')} Bakeries ${locPrefix}`;
    }
    return `All Verified Bakeries ${locPrefix}`;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
      {/* Explorer Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-brand-espresso">
          Explore Artisanal Bakeries
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-2">
          Find independent pastry boutiques, home bakers, and custom cake studios in top Indian cities.
        </p>
      </div>

      {/* Dual Filter Search Bar */}
      <div className="max-w-2xl mx-auto mb-5">
        <SearchBar
          initialSearch={searchQuery}
          initialLocation={locationQuery}
          onSearch={handleSearch}
        />
      </div>



      {/* Category Pills */}
      <div className="flex justify-center mb-10">
        <CategoryPills
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      {/* Grid */}
      <BakeryGrid
        shops={shops}
        isLoading={isLoading}
        error={error}
        onRetry={fetchShops}
        title={getTitle()}
        subtitle={
          locationQuery
            ? `Showing verified kitchens delivering freshly baked celebration cakes in ${locationQuery}`
            : 'Connect directly with certified creators for custom quotes and order delivery across India'
        }
      />
    </main>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream-light">
      <Navbar />
      <Suspense fallback={<div className="p-16 text-center font-serif">Loading Bakeries...</div>}>
        <ExploreContent />
      </Suspense>
      <Footer />
    </div>
  );
}
