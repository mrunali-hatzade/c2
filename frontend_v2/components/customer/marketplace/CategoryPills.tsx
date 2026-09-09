'use client';

import React from 'react';
import { Cake, Sparkles, Heart, Store, Award, Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CategoryOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  businessType?: string;
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'ALL', label: 'All Bakeries', icon: <Store className="w-4 h-4" /> },
  { id: 'HOME_BAKERY', label: 'Home Bakers', icon: <Heart className="w-4 h-4" />, businessType: 'HOME_BAKERY' },
  { id: 'CAKE_STUDIO', label: 'Custom Studios', icon: <Sparkles className="w-4 h-4" />, businessType: 'CAKE_STUDIO' },
  { id: 'BAKERY_SHOP', label: 'Pastry Boutiques', icon: <Cake className="w-4 h-4" />, businessType: 'BAKERY_SHOP' },
  { id: 'ONLINE_CAKE_BUSINESS', label: 'Cloud Bakeries', icon: <Award className="w-4 h-4" />, businessType: 'ONLINE_CAKE_BUSINESS' },
  { id: 'EGGLESS', label: '100% Eggless', icon: <Star className="w-4 h-4" /> },
];

interface CategoryPillsProps {
  activeCategory: string;
  onSelectCategory: (category: CategoryOption) => void;
  className?: string;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  activeCategory,
  onSelectCategory,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none', className)}>
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 border',
              isActive
                ? 'bg-brand-plum text-white border-brand-plum shadow-sm scale-105'
                : 'bg-white text-brand-espresso/80 border-brand-border/80 hover:bg-brand-blush/60 hover:text-brand-plum hover:border-brand-plum/30'
            )}
          >
            {cat.icon && <span className={isActive ? 'text-white' : 'text-brand-plum'}>{cat.icon}</span>}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
