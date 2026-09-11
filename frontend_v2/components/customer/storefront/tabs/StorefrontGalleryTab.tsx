'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Eye,
  X,
  ArrowRight,
  Cake,
  Tag,
} from 'lucide-react';
import { Shop } from '@/types/shop';
import { Product, Category } from '@/types/product';
import { StorefrontTab } from '../StorefrontTabNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface StorefrontGalleryTabProps {
  shop: Shop;
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  onNavigateTab: (tab: StorefrontTab) => void;
}

export const StorefrontGalleryTab: React.FC<StorefrontGalleryTabProps> = ({
  shop,
  products,
  categories,
  onSelectProduct,
  onNavigateTab,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [activeLightboxProduct, setActiveLightboxProduct] = useState<Product | null>(null);

  // Filter products that have valid image URLs
  const galleryProducts = products.filter(
    (p) => p.imageUrl && !p.imageUrl.includes('placeholder')
  );

  const displayProducts =
    selectedTag === 'ALL'
      ? galleryProducts
      : galleryProducts.filter((p) => {
          const categoryObj = categories.find((c) => c.id === p.categoryId);
          const catName = p.categoryName || categoryObj?.name || '';
          return catName.toLowerCase().includes(selectedTag.toLowerCase());
        });

  // Extract unique category names from available products
  const categoryNames = Array.from(
    new Set(
      galleryProducts
        .map((p) => {
          const categoryObj = categories.find((c) => c.id === p.categoryId);
          return p.categoryName || categoryObj?.name;
        })
        .filter(Boolean) as string[]
    )
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real Bakery Portfolio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-espresso">
          Pastry &amp; Celebration Cake Gallery
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted max-w-xl mx-auto leading-relaxed">
          Authentic creations handcrafted by {shop.businessName}. Tap any photo to view craftsmanship details or order.
        </p>
      </div>

      {/* Filter Tabs */}
      {categoryNames.length > 0 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedTag('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedTag === 'ALL'
                ? 'bg-brand-plum text-white shadow-xs'
                : 'bg-white text-brand-espresso border border-brand-border/60 hover:bg-brand-blush/40'
            }`}
          >
            All Creations ({galleryProducts.length})
          </button>
          {categoryNames.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedTag(name)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedTag === name
                  ? 'bg-brand-plum text-white shadow-xs'
                  : 'bg-white text-brand-espresso border border-brand-border/60 hover:bg-brand-blush/40'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      {displayProducts.length === 0 ? (
        <Card className="p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-cream flex items-center justify-center text-brand-plum mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-serif font-bold text-brand-espresso">No Gallery Photos Available</h2>
          <p className="text-xs text-brand-muted max-w-md mx-auto">
            {shop.businessName} is uploading their latest portfolio. In the meantime, browse the live cake menu or request a custom quote.
          </p>
          <div className="pt-2">
            <Button onClick={() => onNavigateTab('shop')} className="font-bold">
              Browse Menu
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-brand-border/80 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo Area */}
              <div
                className="aspect-square w-full relative overflow-hidden bg-brand-cream cursor-pointer"
                onClick={() => setActiveLightboxProduct(product)}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 sm:p-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </span>
                </div>
              </div>

              {/* Info & Action */}
              <div className="p-3.5 sm:p-4 space-y-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-brand-espresso line-clamp-1 group-hover:text-brand-plum transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-brand-muted line-clamp-1 mt-0.5">
                    {product.description || 'Artisanal creation'}
                  </p>
                </div>
                <div className="pt-2 border-t border-brand-border/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-espresso">
                    ₹{product.price}
                  </span>
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-plum hover:underline cursor-pointer"
                  >
                    <span>Order</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightboxProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveLightboxProduct(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-elevated border border-brand-border animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video sm:aspect-[16/10] w-full bg-brand-espresso overflow-hidden">
              <img
                src={activeLightboxProduct.imageUrl}
                alt={activeLightboxProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveLightboxProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-brand-espresso">
                    {activeLightboxProduct.name}
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    {activeLightboxProduct.description || 'Handcrafted fresh to order by ' + shop.businessName}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-serif font-bold text-brand-espresso">
                    ₹{activeLightboxProduct.price}
                  </div>
                  {activeLightboxProduct.isEggless && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      🌱 Eggless
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border/60 flex flex-wrap items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setActiveLightboxProduct(null)}
                  className="text-xs font-semibold"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    const prod = activeLightboxProduct;
                    setActiveLightboxProduct(null);
                    onSelectProduct(prod);
                  }}
                  className="text-xs font-bold"
                >
                  Customize &amp; Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
