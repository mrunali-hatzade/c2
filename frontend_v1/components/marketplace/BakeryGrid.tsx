import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Store } from "lucide-react";
import { StorefrontShop } from "@/types/storefront";
import { BakeryCard } from "./BakeryCard";

interface BakeryGridProps {
  bakeries: StorefrontShop[];
  onSelectBakery?: (shop: StorefrontShop) => void;
  isLoading?: boolean;
}

export const BakeryGrid: React.FC<BakeryGridProps> = ({
  bakeries,
  onSelectBakery,
  isLoading = false,
}) => {
  return (
    <section id="bakeries" className="py-16 sm:py-20 bg-brand-cream-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-plum mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Local Bakers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-brand-espresso tracking-tight">
              Top Rated <span className="text-brand-plum italic">Bakeries</span> Near You
            </h2>
            <p className="text-sm sm:text-base text-brand-muted mt-1.5">
              Handpicked bakeries loved by customers for taste, design and timely delivery
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-plum hover:text-brand-plum-hover transition-colors group self-start sm:self-auto"
          >
            <span>View All Bakeries</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl h-80 animate-pulse border border-brand-border"
              />
            ))}
          </div>
        ) : bakeries.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-brand-border">
            <Store className="w-12 h-12 text-brand-plum/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-brand-espresso">No Bakeries Found</h3>
            <p className="text-sm text-brand-muted mt-1 max-w-md mx-auto">
              We couldn&apos;t find any bakeries matching your exact search. Try selecting &quot;Pune, Maharashtra&quot; or searching for &quot;Akurdi&quot;!
            </p>
          </div>
        ) : (
          /* Bakery Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {bakeries.map((shop) => (
              <BakeryCard
                key={shop.id}
                shop={shop}
                onSelectBakery={onSelectBakery}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
