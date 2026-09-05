"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  ShoppingBag, 
  User, 
  MessageSquare, 
  Bell, 
  Cake, 
  Heart,
  ChevronDown
} from "lucide-react";
import { StorefrontCartPopover } from "./StorefrontCartPopover";
import { CartItemWithMeta } from "@/lib/hooks/useStorefrontCart";

interface StorefrontNavbarProps {
  bakeryName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  cartItems: CartItemWithMeta[];
  cartCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode: string;
  isCartOpen: boolean;
  onToggleCart: () => void;
  onCloseCart: () => void;
  onUpdateQuantity: (productId: number, qty: number) => void;
  onRemoveItem: (productId: number) => void;
  onCustomizeItem?: (item: CartItemWithMeta) => void;
  onProceedToCheckout?: () => void;
}

export const StorefrontNavbar: React.FC<StorefrontNavbarProps> = ({
  bakeryName,
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onSelectCategory,
  cartItems,
  cartCount,
  subtotal,
  discount,
  deliveryFee,
  total,
  couponCode,
  isCartOpen,
  onToggleCart,
  onCloseCart,
  onUpdateQuantity,
  onRemoveItem,
  onCustomizeItem,
  onProceedToCheckout,
}) => {
  // Default categories matching the mockup if none or generic are passed
  const displayCategories = categories.length > 0 ? categories : [
    "Birthday Cakes",
    "Wedding Cakes",
    "Pastries",
    "Custom Cakes",
    "Occasions",
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF7] border-b border-brand-border/80 shadow-2xs">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-white border border-brand-border flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform text-brand-plum">
              🧁
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-brand-espresso group-hover:text-brand-plum transition-colors">
                {bakeryName || "Sweet Delights Bakery"}
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search cakes, flavors..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-brand-border/90 text-xs sm:text-sm font-medium text-brand-espresso placeholder:text-brand-muted focus:outline-none focus:border-brand-plum/50 focus:ring-2 focus:ring-brand-plum/10 shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* Right Action Icons: User, Chat, Notifications, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Account Icon */}
            <Link
              href="/login"
              className="w-10 h-10 rounded-full flex items-center justify-center text-brand-espresso hover:bg-white hover:text-brand-plum border border-transparent hover:border-brand-border transition-all"
              title="Customer Login"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Chat / Enquiries Icon */}
            <button
              onClick={() => {
                const el = document.getElementById("showcase");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-brand-espresso hover:bg-white hover:text-brand-plum border border-transparent hover:border-brand-border transition-all"
              title="Message Bakery"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Notifications with alert dot */}
            <div className="relative">
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center text-brand-espresso hover:bg-white hover:text-brand-plum border border-transparent hover:border-brand-border transition-all"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#FCFAF7]" />
              </button>
            </div>

            {/* Cart Button with Count Badge & Popover anchor */}
            <div className="relative">
              <button
                onClick={onToggleCart}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#C17A63] hover:bg-[#B06B55] text-white shadow-soft transition-all active:scale-95 cursor-pointer"
                title="Open Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-bold tracking-tight">{cartCount}</span>
              </button>

              {/* Interactive Cart Popover */}
              <StorefrontCartPopover
                isOpen={isCartOpen}
                onClose={onCloseCart}
                items={cartItems}
                subtotal={subtotal}
                discount={discount}
                deliveryFee={deliveryFee}
                total={total}
                couponCode={couponCode}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
                onCustomizeItem={onCustomizeItem}
                onProceedToCheckout={onProceedToCheckout}
              />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Visible on small screens) */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search cakes, flavors..."
              className="w-full pl-11 pr-4 py-2 rounded-full bg-white border border-brand-border text-xs font-medium text-brand-espresso placeholder:text-brand-muted focus:outline-none focus:border-brand-plum/50"
            />
          </div>
        </div>
      </div>

      {/* Secondary Category Navigation Tabs */}
      <div className="border-t border-brand-border/60 bg-[#FAF6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto py-3 hide-scrollbar text-xs sm:text-sm font-semibold">
            <button
              onClick={() => onSelectCategory("all")}
              className={`pb-1 transition-all whitespace-nowrap cursor-pointer relative ${
                activeCategory === "all"
                  ? "text-brand-plum font-bold"
                  : "text-brand-espresso/80 hover:text-brand-plum"
              }`}
            >
              <span>All Cakes</span>
              {activeCategory === "all" && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-plum rounded-full" />
              )}
            </button>

            {displayCategories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`pb-1 transition-all whitespace-nowrap cursor-pointer relative flex items-center gap-1.5 ${
                    isSelected
                      ? "text-brand-plum font-bold"
                      : "text-brand-espresso/80 hover:text-brand-plum"
                  }`}
                >
                  <span>{cat}</span>
                  {isSelected && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-plum rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
