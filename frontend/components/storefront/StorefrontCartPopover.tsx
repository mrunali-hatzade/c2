"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight, Tag, ChevronDown, Check } from "lucide-react";
import { CartItemWithMeta } from "@/lib/hooks/useStorefrontCart";

interface StorefrontCartPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItemWithMeta[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode: string;
  onUpdateQuantity: (productId: number, qty: number) => void;
  onRemoveItem: (productId: number) => void;
  onCustomizeItem?: (item: CartItemWithMeta) => void;
  onProceedToCheckout?: () => void;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80";

export const StorefrontCartPopover: React.FC<StorefrontCartPopoverProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  deliveryFee,
  total,
  couponCode,
  onUpdateQuantity,
  onRemoveItem,
  onCustomizeItem,
  onProceedToCheckout,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const primaryItem = items[0];
  const secondaryItems = items.slice(1);

  // Tomorrow formatted for delivery preview
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="absolute right-0 top-full mt-3 z-50 animate-in fade-in zoom-in-95 duration-200">
      {/* Upward Pointer Caret */}
      <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-brand-border rotate-45 z-10" />

      {/* Popover Card */}
      <div
        ref={popoverRef}
        className="w-[360px] sm:w-[410px] bg-white rounded-3xl border border-brand-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border/70">
          <h3 className="font-bold text-base text-brand-espresso">
            Your Cart <span className="text-brand-muted font-normal">({items.length} {items.length === 1 ? "item" : "items"})</span>
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-brand-muted hover:bg-brand-cream hover:text-brand-espresso transition-colors"
            title="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-brand-border/60">
          {items.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-brand-cream flex items-center justify-center mx-auto text-brand-plum">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-brand-espresso">Your cart is empty</p>
              <p className="text-xs text-brand-muted max-w-[220px] mx-auto leading-relaxed">
                Add delicious handcrafted celebration cakes to get started!
              </p>
            </div>
          ) : (
            <>
              {/* Primary / Detailed Item (Top Item) */}
              {primaryItem && (
                <div className="pb-4 space-y-3">
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="relative w-18 h-18 rounded-2xl overflow-hidden bg-brand-cream-dark shrink-0 border border-brand-border/60">
                      <Image
                        src={primaryItem.imageUrl || FALLBACK_IMAGE}
                        alt={primaryItem.productName || "Cake"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-brand-espresso truncate">
                          {primaryItem.productName}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(primaryItem.productId)}
                          className="text-brand-muted hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-sm font-bold text-brand-espresso mt-0.5">
                        ₹{(primaryItem.unitPrice || 0).toLocaleString("en-IN")}
                      </p>

                      {/* Qty dropdown and Edit */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-brand-muted font-medium">
                          <span>Qty</span>
                          <div className="relative">
                            <select
                              value={primaryItem.quantity}
                              onChange={(e) => onUpdateQuantity(primaryItem.productId, Number(e.target.value))}
                              className="appearance-none bg-brand-cream border border-brand-border/80 rounded-lg px-2.5 py-1 pr-6 text-xs font-bold text-brand-espresso focus:outline-none cursor-pointer"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-3 h-3 text-brand-muted absolute right-1.5 top-2 pointer-events-none" />
                          </div>
                        </div>

                        {onCustomizeItem && (
                          <button
                            type="button"
                            onClick={() => onCustomizeItem(primaryItem)}
                            className="text-xs font-bold text-brand-plum underline hover:text-brand-plum-hover transition-colors"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Custom Message Tag & Eggless Badge */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {primaryItem.cakeMessage ? (
                      <div className="text-2xs font-medium px-2.5 py-1 rounded-md bg-[#FAF4ED] text-brand-espresso border border-brand-border/60">
                        <span className="font-semibold text-brand-muted">Message:</span> {primaryItem.cakeMessage}
                      </div>
                    ) : (
                      <div className="text-2xs font-medium px-2.5 py-1 rounded-md bg-[#FAF4ED] text-brand-espresso border border-brand-border/60">
                        <span className="font-semibold text-brand-muted">Message:</span> Happy Birthday!
                      </div>
                    )}

                    <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {primaryItem.dietaryPreference === "EGGLESS" ? "Eggless" : "Eggless Available"}
                    </span>
                  </div>
                </div>
              )}

              {/* Delivery Date & Subtotal Line */}
              <div className="py-3 space-y-2 text-xs">
                <div className="text-brand-muted font-medium">
                  Delivery Date: <span className="text-brand-espresso font-semibold">{formattedDate} | 10 AM - 12 PM</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold text-brand-espresso">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Secondary Items (Condensed List) */}
              {secondaryItems.length > 0 && (
                <div className="py-3 space-y-2.5">
                  {secondaryItems.map((secItem, idx) => (
                    <div key={secItem.productId} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-brand-muted font-semibold w-3 text-center">{idx + 2}</span>
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-brand-cream-dark shrink-0 border border-brand-border/50">
                          <Image
                            src={secItem.imageUrl || FALLBACK_IMAGE}
                            alt={secItem.productName || "Cake"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-bold text-brand-espresso truncate">
                          {secItem.productName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-espresso">
                          ₹{((secItem.unitPrice || 0) * (secItem.quantity || 1)).toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() => onRemoveItem(secItem.productId)}
                          className="text-brand-muted hover:text-rose-600 transition-colors"
                          title="Remove"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Breakdown: Coupon & Delivery Fee */}
              <div className="py-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-brand-muted">Coupon</span>
                    <span className="px-2 py-0.5 rounded bg-brand-blush text-brand-plum font-bold tracking-wide text-2xs border border-brand-blush-border">
                      &quot;{couponCode}&quot;
                    </span>
                  </div>
                  <span className="font-bold text-emerald-700">-₹{discount.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-brand-muted">Delivery Fee</span>
                  <span className="font-bold text-brand-espresso">₹{deliveryFee}</span>
                </div>
              </div>

              {/* Total Line */}
              <div className="pt-3 pb-1 flex justify-between items-center">
                <span className="text-base font-bold text-brand-espresso">Total</span>
                <span className="text-xl font-extrabold text-brand-espresso">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer CTA */}
        {items.length > 0 && (
          <div className="p-4 bg-[#FCFAF7] border-t border-brand-border/70">
            {onProceedToCheckout ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-2xl bg-[#C17A63] hover:bg-[#B06B55] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-[#C17A63] hover:bg-[#B06B55] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
