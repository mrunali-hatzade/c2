'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock hierarchical data for cascading dropdowns
const LOCATION_HIERARCHY: Record<string, Record<string, Record<string, string[]>>> = {
  Maharashtra: {
    Pune: {
      'Pune City': ['Kothrud', 'Baner', 'Koregaon Park', 'Viman Nagar', 'Shivajinagar'],
      'Pimpri-Chinchwad': ['Akurdi', 'Ravet', 'Wakad', 'Nigdi', 'Chinchwad', 'Bhosari'],
    },
    Mumbai: {
      'Mumbai City': ['Colaba', 'Dadar', 'Worli', 'Lower Parel'],
      'Mumbai Suburban': ['Bandra West', 'Andheri West', 'Juhu', 'Powai'],
    },
    Nagpur: {
      'Nagpur Urban': ['Dharampeth', 'Sitabuldi', 'Sadar'],
    },
  },
  Karnataka: {
    'Bengaluru Urban': {
      Bengaluru: ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'JP Nagar'],
    },
  },
  Delhi: {
    'New Delhi': {
      'Delhi City': ['Connaught Place', 'Hauz Khas', 'South Extension', 'Dwarka'],
    },
  },
};

export interface LocationFilterValues {
  state?: string;
  district?: string;
  city?: string;
  area?: string;
  label: string;
}

interface AdvancedLocationFilterProps {
  onLocationSelect?: (location: string) => void;
  onFilterChange?: (filters: LocationFilterValues) => void;
  shopCount?: number;
}

export const AdvancedLocationFilter: React.FC<AdvancedLocationFilterProps> = ({
  onLocationSelect,
  onFilterChange,
  shopCount = 0,
}) => {
  const [state, setState] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);

  // Computed options based on current selections
  const states = Object.keys(LOCATION_HIERARCHY);
  const districts = state ? Object.keys(LOCATION_HIERARCHY[state] || {}) : [];
  const cities = district ? Object.keys(LOCATION_HIERARCHY[state]?.[district] || {}) : [];
  const areas = city ? LOCATION_HIERARCHY[state]?.[district]?.[city] || [] : [];

  // Active filter label for the summary
  const getActiveFilterLabel = () => {
    if (area) return area;
    if (city) return city;
    if (district) return district;
    if (state) return state;
    return 'All Locations';
  };

  // Trigger search on any change
  useEffect(() => {
    const label = getActiveFilterLabel();
    if (onLocationSelect) onLocationSelect(label);
    if (onFilterChange) {
      onFilterChange({
        state: state || undefined,
        district: district || undefined,
        city: city || undefined,
        area: area || undefined,
        label,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, district, city, area]);

  const handleReset = () => {
    setState('');
    setDistrict('');
    setCity('');
    setArea('');
  };

  const handleGPS = () => {
    setIsLocating(true);
    setTimeout(() => {
      setState('Maharashtra');
      setDistrict('Pune');
      setCity('Pimpri-Chinchwad');
      setArea('Akurdi');
      setIsLocating(false);
    }, 800);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-brand-border/60 shadow-soft p-5 sm:p-6 mb-8 mt-2 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-plum shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-espresso">Filter Bakeries by Location</h3>
            <p className="text-xs text-brand-muted mt-0.5">Select your State, District, City, or Village/Area</p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={handleGPS} className="gap-2 text-xs font-semibold h-9" disabled={isLocating}>
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-pulse' : ''}`} />
            {isLocating ? 'Locating...' : 'Use My GPS'}
          </Button>
          <button onClick={handleReset} className="flex items-center gap-1.5 text-xs font-medium text-brand-muted hover:text-brand-espresso transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Cascading Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* State */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-brand-espresso tracking-wider uppercase">1. State {state && '✓'}</label>
          <select
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setDistrict('');
              setCity('');
              setArea('');
            }}
            className="w-full h-10 px-3 rounded-xl border border-brand-border/80 bg-brand-cream-light/30 text-sm focus:outline-none focus:border-brand-plum focus:ring-1 focus:ring-brand-plum transition-all"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-brand-espresso tracking-wider uppercase">2. District {district && '✓'}</label>
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setCity('');
              setArea('');
            }}
            disabled={!state}
            className="w-full h-10 px-3 rounded-xl border border-brand-border/80 bg-brand-cream-light/30 text-sm focus:outline-none focus:border-brand-plum focus:ring-1 focus:ring-brand-plum transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* City / Town */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-brand-espresso tracking-wider uppercase">3. City / Town {city && '✓'}</label>
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setArea('');
            }}
            disabled={!district}
            className="w-full h-10 px-3 rounded-xl border border-brand-border/80 bg-brand-cream-light/30 text-sm focus:outline-none focus:border-brand-plum focus:ring-1 focus:ring-brand-plum transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Village / Area */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-brand-espresso tracking-wider uppercase">4. Village / Area {area && '✓'}</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            disabled={!city}
            className="w-full h-10 px-3 rounded-xl border border-brand-border/80 bg-brand-cream-light/30 text-sm focus:outline-none focus:border-brand-plum focus:ring-1 focus:ring-brand-plum transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All Villages / Areas</option>
            {areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-brand-border/60">
        <p className="text-xs text-brand-muted">
          Showing <span className="font-bold text-brand-espresso">{shopCount}</span> shops in <span className="font-semibold text-brand-plum">{getActiveFilterLabel()}</span>
        </p>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-brand-muted">Active filters:</span>
          <span className="font-medium bg-brand-cream px-2 py-0.5 rounded text-brand-espresso border border-brand-border/50">
            {getActiveFilterLabel()}
          </span>
        </div>
      </div>
    </div>
  );
};
