"use client";

import React from "react";
import { X, Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react";
import Image from "next/image";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  variantName?: string;
  addons?: string[];
  imageUrl?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: number, delta: number) => void;
  onCheckout: () => void;
}

/**
 * Skeleton reference component for Phase 4 Customer Cart.
 * Preserved for future checkout flow implementation.
 */
export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-brand-espresso/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-plum" />
            <h3 className="font-serif font-bold text-lg text-brand-espresso">Your Cake Basket</h3>
            <span className="text-xs bg-brand-blush text-brand-plum font-semibold px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-brand-muted hover:bg-brand-cream hover:text-brand-espresso transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-brand-muted space-y-2">
              <ShoppingCart className="w-12 h-12 mx-auto text-brand-muted/40" />
              <p className="text-sm font-medium">Your basket is empty</p>
              <p className="text-xs text-brand-muted/70">Add cakes from the bakery showcase to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-3 bg-brand-cream-light p-3 rounded-2xl border border-brand-border">
                {item.imageUrl && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-brand-espresso truncate">{item.name}</h4>
                  {item.variantName && <p className="text-3xs text-brand-muted">{item.variantName}</p>}
                  <p className="text-xs font-bold text-brand-plum mt-1">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-1.5 self-center">
                  <button
                    onClick={() => onUpdateQty(item.productId, -1)}
                    className="w-6 h-6 rounded-lg bg-white border border-brand-border flex items-center justify-center text-brand-espresso hover:bg-brand-cream"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQty(item.productId, 1)}
                    className="w-6 h-6 rounded-lg bg-white border border-brand-border flex items-center justify-center text-brand-espresso hover:bg-brand-cream"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-brand-border space-y-3 bg-white">
            <div className="flex justify-between text-sm font-bold text-brand-espresso">
              <span>Estimated Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3.5 rounded-full bg-brand-plum hover:bg-brand-plum-hover text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
