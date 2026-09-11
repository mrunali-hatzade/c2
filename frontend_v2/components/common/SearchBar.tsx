'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, X, ChevronDown, Navigation, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { INDIAN_POPULAR_PLACES, IndianPlaceOption } from '@/lib/constants/indianLocations';

export interface SearchBarProps {
  initialSearch?: string;
  initialLocation?: string;
  onSearch: (params: { search: string; location: string }) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialSearch = '',
  initialLocation = '',
  onSearch,
  className,
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  // Sync external changes
  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCityDropdownOpen(false);
    onSearch({ search, location });
  };

  const handleSelectPlace = (place: IndianPlaceOption) => {
    setLocation(place.label);
    setIsCityDropdownOpen(false);
    onSearch({ search, location: place.label });
  };

  const handleSelectNearbyMe = () => {
    setIsLocating(true);
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          setLocation('Near by Me');
          setIsCityDropdownOpen(false);
          onSearch({ search, location: 'Near by Me' });
        },
        () => {
          setIsLocating(false);
          setLocation('Near by Me');
          setIsCityDropdownOpen(false);
          onSearch({ search, location: 'Near by Me' });
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      setLocation('Near by Me');
      setIsCityDropdownOpen(false);
      onSearch({ search, location: 'Near by Me' });
    }
  };

  const handleClearLocation = () => {
    setLocation('');
    onSearch({ search, location: '' });
  };

  // Filter places based on search input
  const filteredPlaces = useMemo(() => {
    if (!location || location === 'Near by Me') {
      return INDIAN_POPULAR_PLACES;
    }
    const q = location.toLowerCase();
    return INDIAN_POPULAR_PLACES.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        (p.area && p.area.toLowerCase().includes(q)) ||
        (p.state && p.state.toLowerCase().includes(q))
    );
  }, [location]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'w-full bg-white rounded-2xl sm:rounded-full p-2 border border-brand-border/80 shadow-elevated flex flex-col sm:flex-row items-center gap-2 relative transition-shadow hover:shadow-lg focus-within:border-brand-plum/40 focus-within:ring-2 focus-within:ring-brand-plum/10',
        className
      )}
    >
      {/* Search Input */}
      <div className="flex-1 flex items-center px-3 sm:px-4 gap-2.5 w-full">
        <Search className="w-4 h-4 text-brand-plum shrink-0" />
        <input
          type="text"
          placeholder="Search by cake style, flavor, or bakery name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs sm:text-sm text-brand-espresso placeholder:text-brand-muted/70 bg-transparent focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="text-brand-muted hover:text-brand-espresso p-1 transition-colors rounded-full hover:bg-brand-cream/50"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="hidden sm:block w-px h-7 bg-brand-border/80" />

      {/* Location Input with Indian Places & Near by Me Dropdown */}
      <div ref={locationRef} className="relative w-full sm:w-64">
        <div className="flex items-center px-3 sm:px-3.5 gap-2 w-full">
          <MapPin className="w-4 h-4 text-brand-plum shrink-0" />
          <input
            type="text"
            placeholder="City, area or Near by Me"
            value={location}
            onFocus={() => setIsCityDropdownOpen(true)}
            onChange={(e) => {
              setLocation(e.target.value);
              setIsCityDropdownOpen(true);
            }}
            className="w-full text-xs sm:text-sm text-brand-espresso placeholder:text-brand-muted/70 bg-transparent focus:outline-none"
          />

          {/* Quick GPS Locate Button */}
          <button
            type="button"
            title="Use current location (Near by Me)"
            onClick={handleSelectNearbyMe}
            className={cn(
              'p-1 text-brand-muted hover:text-brand-plum transition-colors shrink-0 rounded-md hover:bg-brand-blush/60',
              isLocating && 'animate-spin text-brand-plum'
            )}
          >
            <LocateFixed className="w-3.5 h-3.5" />
          </button>

          {location ? (
            <button
              type="button"
              onClick={handleClearLocation}
              className="text-brand-muted hover:text-brand-espresso p-1 shrink-0 rounded-full hover:bg-brand-cream/50"
              title="Clear location"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="text-brand-muted hover:text-brand-espresso p-1 shrink-0"
            >
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isCityDropdownOpen && "rotate-180")} />
            </button>
          )}
        </div>

        {/* Quick Indian Places Dropdown Menu */}
        {isCityDropdownOpen && (
          <div className="absolute left-0 sm:right-0 top-full mt-3 w-full sm:w-84 bg-white rounded-2xl shadow-elevated border border-brand-border/80 p-2.5 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Near by Me Hero Action */}
            <button
              type="button"
              onClick={handleSelectNearbyMe}
              className="w-full px-3 py-2.5 rounded-xl bg-brand-blush/70 hover:bg-brand-blush text-brand-plum border border-brand-blush-border transition-all flex items-center justify-between mb-2 group shadow-2xs active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-brand-plum text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Navigation className={cn('w-3.5 h-3.5', isLocating ? 'animate-spin' : 'animate-pulse')} />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-brand-espresso group-hover:text-brand-plum">
                    Near by Me
                  </span>
                  <span className="block text-[10px] text-brand-muted">
                    Find bakeries closest to your GPS location
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-white/90 px-2 py-0.5 rounded-full text-brand-plum border border-brand-plum/10">
                GPS
              </span>
            </button>

            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-muted border-b border-brand-border/50 flex items-center justify-between">
              <span>Popular Indian Cities & Areas</span>
              <span className="text-[9px] font-normal text-brand-muted/70">Tap to select</span>
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-brand-border/30 py-1 scrollbar-thin">
              {filteredPlaces
                .filter((p) => !p.isNearby)
                .map((place) => (
                  <button
                    key={place.label}
                    type="button"
                    onClick={() => handleSelectPlace(place)}
                    className="w-full px-3 py-2 text-left text-xs text-brand-espresso hover:bg-brand-cream/60 rounded-xl transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-brand-plum group-hover:scale-110 transition-transform shrink-0" />
                      <span className="font-semibold truncate">{place.label}</span>
                    </div>
                    {place.state && (
                      <span className="text-[10px] text-brand-muted font-medium ml-2 shrink-0 bg-brand-cream px-1.5 py-0.5 rounded-md">
                        {place.state}
                      </span>
                    )}
                  </button>
                ))}

              {filteredPlaces.filter((p) => !p.isNearby).length === 0 && (
                <div className="px-3 py-4 text-center text-xs text-brand-muted">
                  No matching place found. Press enter or &ldquo;Find Bakeries&rdquo; to search for &ldquo;{location}&rdquo;
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto px-1 sm:px-0">
        <Button
          type="submit"
          size="sm"
          className="w-full sm:w-auto rounded-xl sm:rounded-full px-5 py-2.5 h-10 font-bold shadow-sm"
        >
          <Search className="w-3.5 h-3.5 mr-1.5 sm:hidden" />
          Find Bakeries
        </Button>
      </div>
    </form>
  );
};
