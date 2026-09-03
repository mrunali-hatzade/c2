import React from "react";
import { ArrowRight, Sparkles, Cake } from "lucide-react";
import { Product } from "@/types/storefront";
import { CakeCard } from "./CakeCard";

interface FeaturedCakesProps {
  cakes: Product[];
  onAddToCart?: (cake: Product) => void;
  isLoading?: boolean;
}

export const FeaturedCakes: React.FC<FeaturedCakesProps> = ({
  cakes,
  onAddToCart,
  isLoading = false,
}) => {
  return (
    <section id="featured-cakes" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-plum mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trending Creations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-espresso tracking-tight">
              Featured Cakes
            </h2>
            <p className="text-sm sm:text-base text-brand-muted mt-1.5">
              Most loved creations and bestselling flavors from our premier bakeries
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert("Full cake catalog will be unlocked in Phase 3!")}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-plum hover:text-brand-plum-hover transition-colors group self-start sm:self-auto"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-brand-cream rounded-3xl h-80 animate-pulse border border-brand-border"
              />
            ))}
          </div>
        ) : cakes.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-brand-cream rounded-3xl border border-brand-border">
            <Cake className="w-12 h-12 text-brand-plum/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-brand-espresso">No Cakes Found</h3>
            <p className="text-sm text-brand-muted mt-1 max-w-md mx-auto">
              No cakes match the selected category or search. Try selecting &quot;All Cakes&quot; above!
            </p>
          </div>
        ) : (
          /* Cakes Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {cakes.map((cake) => (
              <CakeCard
                key={cake.id}
                cake={cake}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
