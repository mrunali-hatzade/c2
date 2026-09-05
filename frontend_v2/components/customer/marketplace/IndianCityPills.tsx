'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { INDIAN_POPULAR_CITIES } from '@/lib/constants/indianLocations';

interface IndianCityPillsProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  className?: string;
}

export const IndianCityPills: React.FC<IndianCityPillsProps> = ({
  selectedCity,
  onSelectCity,
  className = '',
}) => {
  const cities = ['ALL', ...INDIAN_POPULAR_CITIES.map((c) => c.name)];

  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none ${className}`}>
      {cities.map((cityName) => {
        const isSelected = selectedCity.toLowerCase() === cityName.toLowerCase() || (cityName === 'ALL' && !selectedCity);

        return (
          <button
            key={cityName}
            type="button"
            onClick={() => onSelectCity(cityName === 'ALL' ? '' : cityName)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              isSelected
                ? 'bg-brand-plum text-white shadow-soft scale-105 border border-brand-plum'
                : 'bg-white/90 text-brand-espresso hover:bg-white border border-brand-border/70 hover:shadow-xs'
            }`}
          >
            <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-brand-plum'}`} />
            <span>{cityName === 'ALL' ? 'All India' : cityName}</span>
          </button>
        );
      })}
    </div>
  );
};
