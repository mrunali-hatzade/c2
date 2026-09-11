'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/common/Toast';

const FALLBACK_CAKE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80';

export const SavedCakesDrawer: React.FC = () => {
  const router = useRouter();
  const { savedCakes, isFavoritesOpen, setIsFavoritesOpen, removeFavorite, clearFavorites } = useFavorites();
  const { addItem, setIsCartOpen } = useCart();
  const toast = useToast();

  if (!isFavoritesOpen) return null;

  const handleQuickAdd = (item: any) => {
    const result = addItem({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: 1,
      imageUrl: item.product.imageUrl || FALLBACK_CAKE,
      isEggless: item.product.isEggless,
      shopId: item.shopId,
      shopName: item.shopName,
    });

    if (result.conflict) {
      toast.error('Cart contains items from another bakery. Clear cart first to order from here.');
      return;
    }

    toast.success(`Added "${item.product.name}" to basket!`);
    setIsFavoritesOpen(false);
    setIsCartOpen(true);
  };

  const handleNavigateToCake = (item: any) => {
    setIsFavoritesOpen(false);
    router.push(`/shop/${item.shopId}/product/${item.product.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsFavoritesOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col justify-between border-l border-brand-border/60">
          {/* Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-brand-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base sm:text-lg text-brand-espresso">
                  Saved Cakes ({savedCakes.length})
                </h2>
                <p className="text-[11px] text-brand-muted">Your celebration wishlist</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {savedCakes.length > 0 && (
                <button
                  onClick={clearFavorites}
                  className="text-xs text-brand-muted hover:text-rose-600 transition-colors px-2 py-1"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsFavoritesOpen(false)}
                className="p-2 rounded-full text-brand-muted hover:text-brand-espresso hover:bg-brand-cream/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
            {savedCakes.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-base text-brand-espresso">No saved cakes yet</h3>
                <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
                  Tap the heart icon on any artisan cake in the bakery catalog to save it to your wishlist.
                </p>
              </div>
            ) : (
              savedCakes.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 sm:p-4 rounded-3xl bg-white border border-brand-border/70 shadow-soft flex items-center gap-3.5 hover:border-brand-plum/40 transition-all group"
                >
                  {/* Photo */}
                  <div
                    onClick={() => handleNavigateToCake(item)}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-brand-cream border border-brand-border shrink-0 cursor-pointer"
                  >
                    <img
                      src={item.product.imageUrl || FALLBACK_CAKE}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_CAKE;
                      }}
                    />
                  </div>

                  {/* Info & Actions */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => handleNavigateToCake(item)}
                        className="font-serif font-bold text-xs sm:text-sm text-brand-espresso truncate cursor-pointer hover:text-brand-plum"
                      >
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFavorite(item.product.id)}
                        className="text-brand-muted hover:text-rose-600 transition-colors p-1"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#C5A880] font-medium">
                      {item.shopName}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-serif font-bold text-sm text-[#2C1A1D]">
                        ₹{item.product.price}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleQuickAdd(item)}
                          className="h-8 px-3 rounded-xl text-xs font-bold bg-[#5C1D2E] text-white hover:bg-[#4a1525]"
                        >
                          <ShoppingBag className="w-3 h-3 mr-1" />
                          <span>Add</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {savedCakes.length > 0 && (
            <div className="p-4 bg-white border-t border-brand-border/60">
              <Button
                onClick={() => setIsFavoritesOpen(false)}
                variant="outline"
                className="w-full font-bold text-xs"
              >
                Continue Browsing Menu
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
