'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Cake, Plus, Sparkles, Clock } from 'lucide-react';
import { Product } from '@/types/product';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const FALLBACK_CAKE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [imgSrc, setImgSrc] = useState(product.imageUrl || FALLBACK_CAKE);

  return (
    <Card hoverEffect className="flex flex-col overflow-hidden bg-white border-brand-border/80 h-full group p-0 rounded-2xl">
      {/* Product Image with Dietary Badge */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream/60">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={() => setImgSrc(FALLBACK_CAKE)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Dietary Pill (Pure Veg / Eggless Indicator) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs shadow-xs text-[10px] font-semibold">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              product.isEggless ? 'bg-emerald-600 ring-1 ring-emerald-600/20' : 'bg-amber-600'
            }`}
          />
          <span className={product.isEggless ? 'text-emerald-800' : 'text-amber-900'}>
            {product.isEggless ? 'Eggless' : 'Contains Egg'}
          </span>
        </div>

        {/* Price Pill */}
        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-brand-espresso/90 text-white font-serif font-bold text-xs shadow-soft backdrop-blur-xs">
          ₹{product.price}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1">
        {/* Category Label */}
        {(product.categoryName || product.category) && (
          <span className="text-[9px] uppercase font-bold tracking-wider text-brand-plum">
            {product.categoryName || product.category?.replace(/_/g, ' ').toLowerCase()}
          </span>
        )}

        {/* Title */}
        <h3 className="font-serif font-bold text-sm sm:text-base text-brand-espresso mt-0.5 line-clamp-1 group-hover:text-brand-plum transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-[11px] text-brand-muted mt-1 line-clamp-2 flex-1 leading-relaxed">
          {product.description || 'Delicious handcrafted artisan creation made with premium fresh ingredients.'}
        </p>

        {/* Meta Specs */}
        <div className="mt-2.5 pt-2 border-t border-brand-border/60 flex items-center justify-between text-[11px] text-brand-muted">
          {product.weightGrams ? (
            <span className="text-[10px] text-brand-espresso/80 font-medium">
              {product.weightGrams >= 1000 ? `${product.weightGrams / 1000} kg` : `${product.weightGrams}g`}
            </span>
          ) : (
            <span className="text-[10px] text-brand-espresso/80 font-medium">Fresh Baked</span>
          )}

          {product.preparationTimeHours && (
            <span className="flex items-center gap-1 text-[10px]">
              <Clock className="w-2.5 h-2.5 text-brand-plum" />
              {product.preparationTimeHours}h notice
            </span>
          )}
        </div>

        {/* In-Store Action */}
        <div className="mt-3">
          <Button
            onClick={() => onSelect(product)}
            className="w-full justify-center gap-1 text-xs py-1.5 h-8"
            size="sm"
          >
            <Plus className="w-3 h-3" />
            <span>Customize & Order</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
