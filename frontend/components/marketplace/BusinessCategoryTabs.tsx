"use client";

import React from "react";
import { Layers, Home, Store, Sparkles, Leaf } from "lucide-react";

export type BusinessCategory = "All Bakeries" | "Home Bakers 🏠" | "Cake Shops 🍰" | "Artisan Bakeries ✨" | "Dessert Studios 🍰";

interface BusinessCategoryTabsProps {
  selectedCategory: BusinessCategory;
  onSelectCategory: (category: BusinessCategory) => void;
  isPureVeg: boolean;
  onTogglePureVeg: () => void;
}

export const BusinessCategoryTabs: React.FC<BusinessCategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  isPureVeg,
  onTogglePureVeg,
}) => {
  const tabs: { label: BusinessCategory; icon: React.ReactNode }[] = [
    { label: "All Bakeries", icon: <Layers className="w-4 h-4" /> },
    { label: "Home Bakers 🏠", icon: <Home className="w-4 h-4" /> },
    { label: "Cake Shops 🍰", icon: <Store className="w-4 h-4" /> },
    { label: "Artisan Bakeries ✨", icon: <Sparkles className="w-4 h-4" /> },
    { label: "Dessert Studios 🍰", icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
          {tabs.map((tab) => {
            const isSelected = selectedCategory === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => onSelectCategory(tab.label)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-brand-plum text-white shadow-soft"
                    : "bg-white border border-brand-border text-brand-espresso hover:bg-brand-cream-dark"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 100% Pure Veg Toggle */}
        <button
          onClick={onTogglePureVeg}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shrink-0 border ${
            isPureVeg
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-white border-brand-border text-brand-muted hover:bg-brand-cream"
          }`}
        >
          <Leaf className={`w-4 h-4 ${isPureVeg ? "text-green-600 fill-green-600" : ""}`} />
          100% Pure Veg
        </button>
      </div>
    </section>
  );
};
