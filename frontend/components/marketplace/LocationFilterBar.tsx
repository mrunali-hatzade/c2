"use client";

import React, { useMemo } from "react";
import { Navigation, RotateCcw, ChevronDown, MapPin, Sparkles } from "lucide-react";
import { ALL_STATES, MAHARASHTRA_LOCATIONS } from "@/data/locations";

export interface LocationFiltersState {
  state: string;
  district: string;
  city: string;
  village: string;
}

interface LocationFilterBarProps {
  filters: LocationFiltersState;
  onChange: (filters: LocationFiltersState) => void;
  onReset: () => void;
  onGpsClick: () => void;
  onSelectLocation?: (locationName: string) => void;
}

export const LocationFilterBar: React.FC<LocationFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  onGpsClick,
  onSelectLocation,
}) => {
  // Compute available districts based on selected state
  const availableDistricts = useMemo(() => {
    if (filters.state === "Maharashtra") {
      return MAHARASHTRA_LOCATIONS.districts.map((d) => d.name);
    }
    return [];
  }, [filters.state]);

  // Compute available cities based on selected state & district
  const availableCities = useMemo(() => {
    if (filters.state !== "Maharashtra") return [];
    if (filters.district && filters.district !== "All Districts") {
      const dist = MAHARASHTRA_LOCATIONS.districts.find(
        (d) => d.name.toLowerCase() === filters.district.toLowerCase()
      );
      return dist ? dist.cities.map((c) => c.name) : [];
    }
    return MAHARASHTRA_LOCATIONS.districts.flatMap((d) => d.cities.map((c) => c.name));
  }, [filters.state, filters.district]);

  // Compute available villages based on selected city/district
  const availableVillages = useMemo(() => {
    if (filters.state !== "Maharashtra") return [];
    if (filters.city && filters.city !== "All Cities") {
      for (const dist of MAHARASHTRA_LOCATIONS.districts) {
        const foundCity = dist.cities.find(
          (c) => c.name.toLowerCase() === filters.city.toLowerCase()
        );
        if (foundCity) return foundCity.villages;
      }
    }
    if (filters.district && filters.district !== "All Districts") {
      const dist = MAHARASHTRA_LOCATIONS.districts.find(
        (d) => d.name.toLowerCase() === filters.district.toLowerCase()
      );
      return dist ? dist.cities.flatMap((c) => c.villages) : [];
    }
    return MAHARASHTRA_LOCATIONS.districts.flatMap((d) =>
      d.cities.flatMap((c) => c.villages)
    );
  }, [filters.state, filters.district, filters.city]);

  // Handlers for cascading dropdowns
  const handleStateChange = (newState: string) => {
    const updated = {
      state: newState,
      district: "All Districts",
      city: "All Cities",
      village: "All Villages / Areas",
    };
    onChange(updated);
    if (newState !== "All States" && onSelectLocation) {
      onSelectLocation(newState);
    }
  };

  const handleDistrictChange = (newDistrict: string) => {
    const updated = {
      ...filters,
      district: newDistrict,
      city: "All Cities",
      village: "All Villages / Areas",
    };
    onChange(updated);
    if (newDistrict !== "All Districts" && onSelectLocation) {
      onSelectLocation(newDistrict);
    }
  };

  const handleCityChange = (newCity: string) => {
    const updated = {
      ...filters,
      city: newCity,
      village: "All Villages / Areas",
    };
    onChange(updated);
    if (newCity !== "All Cities" && onSelectLocation) {
      onSelectLocation(newCity);
    }
  };

  const handleVillageChange = (newVillage: string) => {
    const updated = {
      ...filters,
      village: newVillage,
    };
    onChange(updated);
    if (newVillage !== "All Villages / Areas" && onSelectLocation) {
      onSelectLocation(newVillage);
    } else if (filters.city !== "All Cities" && onSelectLocation) {
      onSelectLocation(filters.city);
    }
  };

  const handleQuickAreaSelect = (area: string, city: string, district: string) => {
    const updated = {
      state: "Maharashtra",
      district: district,
      city: city,
      village: area,
    };
    onChange(updated);
    if (onSelectLocation) {
      onSelectLocation(area);
    }
  };

  const displayLocationText = useMemo(() => {
    if (filters.village !== "All Villages / Areas") {
      return `${filters.village}, ${filters.city !== "All Cities" ? filters.city : filters.district}`;
    }
    if (filters.city !== "All Cities") {
      return `${filters.city}, ${filters.district !== "All Districts" ? filters.district : filters.state}`;
    }
    if (filters.district !== "All Districts") {
      return `${filters.district}, ${filters.state}`;
    }
    return filters.state !== "All States" ? filters.state : "All Locations";
  }, [filters]);

  const hasActiveFilter =
    filters.village !== "All Villages / Areas" ||
    filters.city !== "All Cities" ||
    filters.district !== "All Districts" ||
    filters.state !== "All States";

  const quickPicks = [
    { area: "Akurdi", city: "Pimpri-Chinchwad", district: "Pune" },
    { area: "Wakad", city: "Pimpri-Chinchwad", district: "Pune" },
    { area: "Baner", city: "Pune City", district: "Pune" },
    { area: "Ravet", city: "Pimpri-Chinchwad", district: "Pune" },
    { area: "Kothrud", city: "Pune City", district: "Pune" },
    { area: "Andheri", city: "Mumbai Suburban", district: "Mumbai" },
  ];

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-card border border-brand-border p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
        
        {/* Top Header: Title + Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum shrink-0 shadow-2xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-brand-espresso text-base sm:text-lg leading-tight">
                  Filter by Location
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-brand-blush text-brand-plum text-2xs font-semibold">
                  4-Tier Cascading
                </span>
              </div>
              <p className="text-2xs sm:text-xs text-brand-muted mt-0.5">
                Select State → District → City → Area to find verified bakers
              </p>
            </div>
          </div>
          
          {/* Action Buttons: 2-column on mobile, inline on desktop */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onGpsClick}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl sm:rounded-full bg-brand-blush text-brand-plum text-xs sm:text-sm font-semibold hover:bg-brand-plum hover:text-white transition-all active:scale-95 shadow-2xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Use GPS</span>
            </button>
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl sm:rounded-full bg-brand-cream border border-brand-border text-brand-espresso text-xs sm:text-sm font-medium hover:bg-brand-border transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 4-Tier Dropdown Selectors: Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* 1. State */}
          <div className="flex flex-col gap-1">
            <label className="text-2xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-brand-plum/10 text-brand-plum flex items-center justify-center text-3xs font-extrabold">1</span>
              <span>State</span>
            </label>
            <div className="relative">
              <select
                value={filters.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full appearance-none bg-brand-cream border border-brand-border rounded-xl pl-3.5 pr-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-brand-espresso focus:outline-none focus:border-brand-plum focus:ring-1 focus:ring-brand-plum cursor-pointer transition-colors"
              >
                <option value="All States">All States</option>
                {ALL_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
            </div>
          </div>

          {/* 2. District */}
          <div className="flex flex-col gap-1">
            <label className="text-2xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-brand-plum/10 text-brand-plum flex items-center justify-center text-3xs font-extrabold">2</span>
              <span>District</span>
            </label>
            <div className="relative">
              <select
                value={filters.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={availableDistricts.length === 0}
                className="w-full appearance-none bg-brand-cream border border-brand-border rounded-xl pl-3.5 pr-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-brand-espresso focus:outline-none focus:border-brand-plum focus:ring-1 focus:ring-brand-plum disabled:opacity-40 cursor-pointer transition-colors"
              >
                <option value="All Districts">All Districts</option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
            </div>
          </div>

          {/* 3. City / Town */}
          <div className="flex flex-col gap-1">
            <label className="text-2xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-brand-plum/10 text-brand-plum flex items-center justify-center text-3xs font-extrabold">3</span>
              <span>City / Town</span>
            </label>
            <div className="relative">
              <select
                value={filters.city}
                onChange={(e) => handleCityChange(e.target.value)}
                disabled={availableCities.length === 0}
                className="w-full appearance-none bg-brand-cream border border-brand-border rounded-xl pl-3.5 pr-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-brand-espresso focus:outline-none focus:border-brand-plum focus:ring-1 focus:ring-brand-plum disabled:opacity-40 cursor-pointer transition-colors"
              >
                <option value="All Cities">All Cities</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
            </div>
          </div>

          {/* 4. Village / Area */}
          <div className="flex flex-col gap-1">
            <label className="text-2xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-brand-plum/10 text-brand-plum flex items-center justify-center text-3xs font-extrabold">4</span>
              <span>Neighborhood / Area</span>
            </label>
            <div className="relative">
              <select
                value={filters.village}
                onChange={(e) => handleVillageChange(e.target.value)}
                disabled={availableVillages.length === 0}
                className="w-full appearance-none bg-brand-cream border border-brand-border rounded-xl pl-3.5 pr-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-brand-espresso focus:outline-none focus:border-brand-plum focus:ring-1 focus:ring-brand-plum disabled:opacity-40 cursor-pointer transition-colors"
              >
                <option value="All Villages / Areas">All Areas</option>
                {availableVillages.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quick Area Chips (Super convenient for mobile users) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <span className="text-2xs font-bold text-brand-muted uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-plum" />
            Quick Pick:
          </span>
          {quickPicks.map((qp) => {
            const isSelected = filters.village === qp.area;
            return (
              <button
                key={qp.area}
                type="button"
                onClick={() => handleQuickAreaSelect(qp.area, qp.city, qp.district)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? "bg-brand-plum text-white shadow-xs"
                    : "bg-brand-cream border border-brand-border text-brand-espresso hover:border-brand-plum/40 hover:text-brand-plum"
                }`}
              >
                {qp.area}
              </button>
            );
          })}
        </div>
        
        {/* Footer Summary with Current Filter State */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-2xs sm:text-xs text-brand-muted pt-3 border-t border-brand-border/70 gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="shrink-0 font-medium">Active Location:</span>
            <span className="font-bold text-brand-plum truncate">
              {displayLocationText}
            </span>
          </div>

          {hasActiveFilter && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="font-semibold bg-brand-blush text-brand-plum border border-brand-blush-border px-2.5 py-0.5 rounded-full text-2xs truncate max-w-[200px]">
                {filters.village !== "All Villages / Areas"
                  ? filters.village
                  : filters.city !== "All Cities"
                  ? filters.city
                  : filters.district !== "All Districts"
                  ? filters.district
                  : filters.state}
              </span>
              <button
                onClick={onReset}
                className="text-2xs text-brand-muted hover:text-brand-plum underline font-medium"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
