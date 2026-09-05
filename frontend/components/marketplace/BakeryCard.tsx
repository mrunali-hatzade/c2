import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, ArrowUpRight } from "lucide-react";
import { StorefrontShop } from "@/types/storefront";
import { RatingStars } from "@/components/ui/RatingStars";

interface BakeryCardProps {
  shop: StorefrontShop;
  onSelectBakery?: (shop: StorefrontShop) => void;
}

export const BakeryCard: React.FC<BakeryCardProps> = ({ shop, onSelectBakery }) => {
  return (
    <Link
      href={`/shop/${shop.id}`}
      onClick={() => onSelectBakery?.(shop)}
      className="group bg-white rounded-3xl overflow-hidden border border-brand-border/80 shadow-soft hover:shadow-card-hover hover:border-brand-plum/30 transition-all duration-300 flex flex-col cursor-pointer"
    >

      {/* Cover Image Container */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-brand-cream-dark">
        <Image
          src={
            shop.coverImageUrl ||
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
          }
          alt={shop.businessName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Featured Tag Badge */}
        {shop.featuredCategory && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-brand-border/60 text-2xs font-bold text-brand-plum shadow-2xs">
            {shop.featuredCategory}
          </div>
        )}

        {/* Quick View Floating Arrow */}
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-brand-espresso opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 shadow-sm">
          <ArrowUpRight className="w-4 h-4 text-brand-plum" />
        </div>
      </div>

      {/* Bakery Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Business Name */}
          <h3 className="text-lg font-bold text-brand-espresso group-hover:text-brand-plum transition-colors line-clamp-1">
            {shop.businessName}
          </h3>

          {/* Location Area */}
          <div className="flex items-center gap-1 text-xs text-brand-muted mt-1">
            <MapPin className="w-3.5 h-3.5 text-brand-plum/70 flex-shrink-0" />
            <span className="truncate">{shop.address || `${shop.city}, ${shop.state}`}</span>
          </div>
        </div>

        {/* Rating & Delivery Time Meta Bar (Real fields only) */}
        {(shop.rating !== undefined || shop.deliveryTime !== undefined) ? (
          <div className="flex items-center justify-between pt-3 border-t border-brand-border/60 text-xs">
            {shop.rating !== undefined ? (
              <RatingStars
                rating={shop.rating}
                count={shop.reviewCount}
                size={14}
              />
            ) : (
              <span className="text-2xs font-semibold text-brand-plum bg-brand-blush px-2.5 py-0.5 rounded-full">
                {shop.businessCategory || "Verified Baker"}
              </span>
            )}

            {shop.deliveryTime && (
              <div className="flex items-center gap-1 font-medium text-brand-muted">
                <Clock className="w-3.5 h-3.5 text-brand-plum/70" />
                <span>{shop.deliveryTime}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between pt-3 border-t border-brand-border/60 text-xs">
            <span className="text-2xs font-semibold text-brand-plum bg-brand-blush px-2.5 py-0.5 rounded-full">
              {shop.businessCategory || "Verified Baker"}
            </span>
            <span className="text-2xs text-brand-muted">
              {shop.city || "Local Baker"}
            </span>
          </div>
        )}

        {/* Category Tags (Real tags only) */}
        {shop.tags && shop.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {shop.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-3xs font-semibold px-2 py-0.5 rounded-md bg-brand-cream border border-brand-border/80 text-brand-espresso/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};
