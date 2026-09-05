'use client';

import React, { useState } from 'react';
import { Store, SlidersHorizontal, MapPin } from 'lucide-react';
import { Shop } from '@/types/shop';
import { BakeryCard } from './BakeryCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { INDIAN_POPULAR_PLACES } from '@/lib/constants/indianLocations';

interface BakeryGridProps {
  shops: Shop[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  title?: string;
  subtitle?: string;
}

export const BakeryGrid: React.FC<BakeryGridProps> = ({
  shops,
  isLoading,
  error,
  onRetry,
  title = 'Featured Bakeries',
  subtitle = 'Discover verified artisanal cake bakers in your area',
}) => {
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'city'>('default');

  const sortedShops = [...shops].sort((a, b) => {
    if (sortBy === 'name') return a.businessName.localeCompare(b.businessName);
    if (sortBy === 'city') return a.city.localeCompare(b.city);
    return 0;
  });

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-brand-border/60 gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-espresso tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">{subtitle}</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <span className="text-xs font-medium text-brand-muted">
            {shops.length} {shops.length === 1 ? 'bakery' : 'bakeries'} available
          </span>



          <div className="flex items-center gap-1.5 text-xs text-brand-espresso border border-brand-border rounded-xl px-2.5 py-1.5 bg-white shadow-subtle">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-plum shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none text-xs text-brand-espresso cursor-pointer"
            >
              <option value="default">Default Order</option>
              <option value="name">Name (A-Z)</option>
              <option value="city">City</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading && <LoadingState message="Discovering certified artisanal bakeries..." />}

      {error && <ErrorState message={error} onRetry={onRetry} />}

      {!isLoading && !error && shops.length === 0 && (
        <EmptyState
          icon={<Store className="w-7 h-7" />}
          title="No Bakeries Found"
          description="We couldn't find any bakeries matching your criteria. Try adjusting your filters or location."
        />
      )}

      {!isLoading && !error && shops.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedShops.map((shop) => (
            <BakeryCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </section>
  );
};
