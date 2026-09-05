"use client";

import React from "react";
import Link from "next/link";
import { X, MapPin, ShoppingBag } from "lucide-react";
import { POPULAR_LOCATIONS } from "@/lib/constants/categories";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  cartCount: number;
  activeSection?: string;
  onNavItemClick?: (item: { href: string; id: string; sectionId?: string }) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
  cartCount,
  activeSection = "home",
  onNavItemClick,
}) => {
  if (!isOpen) return null;

  const navLinks = [
    { label: "Home", href: "/", id: "home", sectionId: "hero" },
    { label: "Explore Bakeries", href: "/explore", id: "explore", sectionId: "bakeries" },
    { label: "How It Works", href: "/how-it-works", id: "how-it-works", sectionId: "how-it-works" },
    { label: "For Owners", href: "/for-owners", id: "for-owners", sectionId: "owner-cta" },
    { label: "Pricing", href: "/pricing", id: "pricing" },
    { label: "Contact Us", href: "/contact", id: "contact" },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-espresso/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎂</span>
              <span className="text-xl font-bold font-serif tracking-tight text-brand-espresso">
                Cake<span className="text-brand-plum">Store</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-plum-light hover:text-brand-espresso transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Location Selector */}
          <div className="mt-4 p-3 bg-brand-cream rounded-xl border border-brand-border">
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-plum" />
              Delivery Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                onSelectLocation(e.target.value);
                onClose();
              }}
              className="w-full bg-white border border-brand-border rounded-lg px-2.5 py-1.5 text-sm font-medium text-brand-espresso focus:outline-none focus:ring-2 focus:ring-brand-plum/20"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Nav Links with Active Highlighting */}
          <nav className="mt-6 flex flex-col space-y-1">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    onNavItemClick?.(item);
                    onClose();
                  }}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? "bg-brand-plum text-white font-bold shadow-2xs"
                      : "text-brand-espresso hover:bg-brand-plum-light hover:text-brand-plum"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-brand-border space-y-3">
          <Link
            href="/checkout"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-brand-border text-brand-espresso font-medium hover:bg-brand-cream transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-brand-plum" />
            <span>View Cart ({cartCount})</span>
          </Link>

          <Link
            href="/for-owners"
            onClick={onClose}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand-plum text-white text-sm font-semibold hover:bg-brand-plum-hover transition-colors shadow-soft"
          >
            Bakery Owner Login / Register
          </Link>
        </div>
      </div>
    </div>
  );
};
