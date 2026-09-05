'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Store } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';

export const CartDrawer: React.FC = () => {
  const {
    items,
    totalPrice,
    totalItems,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeItem,
    clearCart,
    currentShopName,
  } = useCart();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-elevated flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-brand-border/60 flex items-center justify-between bg-brand-cream-light/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-plum text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base text-brand-espresso leading-tight">
                  In-Store Basket
                </h2>
                {currentShopName && (
                  <p className="text-[11px] text-brand-muted flex items-center gap-1">
                    <Store className="w-3 h-3 text-brand-plum" />
                    <span>Ordering from: {currentShopName}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-brand-muted hover:text-brand-espresso hover:bg-brand-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-cream flex items-center justify-center text-brand-muted mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-sm text-brand-espresso">Your basket is empty</h3>
                <p className="text-xs text-brand-muted max-w-xs mt-1">
                  Select handcrafted cakes and confections from this bakery to begin your order.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-4 rounded-2xl border border-brand-border/80 bg-white shadow-subtle space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-cream shrink-0 border border-brand-border/60">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-plum">
                              <ShoppingBag className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-brand-espresso line-clamp-1">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-brand-muted">
                            {item.isEggless ? '🌱 Eggless' : 'Regular'} • ₹{item.price} each
                          </span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-sm text-brand-espresso shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    {item.customMessage && (
                      <p className="text-[11px] text-brand-plum bg-brand-blush/60 p-2 rounded-xl italic">
                        &quot;{item.customMessage}&quot;
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-brand-border/40">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border border-brand-border rounded-full px-2 py-0.5 bg-brand-cream-light/50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-0.5 text-brand-muted hover:text-brand-espresso"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-brand-espresso px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-0.5 text-brand-muted hover:text-brand-espresso"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-brand-muted hover:text-red-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-brand-border/60 bg-white space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-muted">Subtotal ({totalItems} items):</span>
                <span className="font-serif font-bold text-xl text-brand-espresso">
                  ₹{totalPrice}
                </span>
              </div>

              <div className="space-y-2">
                <Button onClick={handleProceedToCheckout} className="w-full" size="lg">
                  Order from this Bakery <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-brand-muted hover:text-red-600 py-1"
                >
                  Clear store basket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
