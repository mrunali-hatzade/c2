"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LocationFilterBar, LocationFiltersState } from "@/components/marketplace/LocationFilterBar";
import { BusinessCategoryTabs, BusinessCategory } from "@/components/marketplace/BusinessCategoryTabs";
import { BakeryGrid } from "@/components/marketplace/BakeryGrid";
import { fetchShops, mapCategoryToBusinessType } from "@/lib/api/storefront";
import { StorefrontShop } from "@/types/storefront";
import { Search, Sparkles, Server, AlertCircle } from "lucide-react";

export default function ExploreBakeriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Akurdi");
  const [bakeries, setBakeries] = useState<StorefrontShop[]>([]);
  const [isFromBackend, setIsFromBackend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Category Tabs & Pure Veg Filter State
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState<BusinessCategory>("All Businesses");
  const [isPureVeg, setIsPureVeg] = useState(false);

  // 4-Tier Location Filter State
  const [locationFilters, setLocationFilters] = useState<LocationFiltersState>({
    state: "Maharashtra",
    district: "All Districts",
    city: "All Cities",
    village: "All Villages / Areas",
  });

  const loadBakeries = useCallback(
    async (overrideFilters?: {
      location?: LocationFiltersState;
      category?: BusinessCategory;
      search?: string;
    }) => {
      setIsLoading(true);
      setErrorMessage(null);

      const loc = overrideFilters?.location ?? locationFilters;
      const cat = overrideFilters?.category ?? selectedBusinessCategory;
      const q = overrideFilters?.search !== undefined ? overrideFilters.search : searchQuery;

      const businessType = mapCategoryToBusinessType(cat);

      try {
        const res = await fetchShops({
          state: loc.state,
          district: loc.district,
          city: loc.city,
          area: loc.village,
          businessType: businessType,
          search: q,
        });

        setBakeries(res.data);
        setIsFromBackend(res.isFromBackend);
        if (res.error) {
          setErrorMessage(res.error);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load bakeries";
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [locationFilters, selectedBusinessCategory, searchQuery]
  );

  useEffect(() => {
    loadBakeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocationFiltersChange = (newFilters: LocationFiltersState) => {
    setLocationFilters(newFilters);
    loadBakeries({ location: newFilters });
  };

  const handleCategoryChange = (newCategory: BusinessCategory) => {
    setSelectedBusinessCategory(newCategory);
    loadBakeries({ category: newCategory });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      loadBakeries({ search: searchQuery });
    }
  };

  const handleResetFilters = () => {
    const defaultFilters: LocationFiltersState = {
      state: "All States",
      district: "All Districts",
      city: "All Cities",
      village: "All Villages / Areas",
    };
    setLocationFilters(defaultFilters);
    setSelectedBusinessCategory("All Businesses");
    setSearchQuery("");
    loadBakeries({
      location: defaultFilters,
      category: "All Businesses",
      search: "",
    });
  };

  const handleGpsClick = () => {
    const gpsFilters: LocationFiltersState = {
      state: "Maharashtra",
      district: "Pune",
      city: "Pimpri-Chinchwad",
      village: "Akurdi",
    };
    setLocationFilters(gpsFilters);
    setSelectedLocation("Akurdi");
    loadBakeries({ location: gpsFilters });
  };

  // Optional pure veg client tag filter
  const displayedBakeries = useMemo(() => {
    if (isPureVeg) {
      return bakeries.filter(
        (b) =>
          b.tags?.some((t) => t.toLowerCase().includes("veg") || t.toLowerCase().includes("eggless")) ||
          b.description?.toLowerCase().includes("eggless") ||
          b.description?.toLowerCase().includes("pure veg")
      );
    }
    return bakeries;
  }, [bakeries, isPureVeg]);

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans flex flex-col">
      <Navbar
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => {
          setSelectedLocation(loc);
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Title */}
        <div className="text-center max-w-4xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Top-Rated Bakery Storefronts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-espresso tracking-tight whitespace-normal sm:whitespace-nowrap">
            Explore All <span className="text-brand-plum italic">Bakeries</span>
          </h1>
          <p className="text-base sm:text-lg text-brand-muted max-w-4xl w-full mx-auto leading-relaxed">
            Browse verified home bakers and artisan cake shops across Maharashtra. Filter by your state, district, city, or neighborhood area.
          </p>

          {/* Quick Search Input */}
          <div className="mt-6 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search by bakery name, category, or specialty (Press Enter)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-brand-border shadow-soft text-sm text-brand-espresso focus:outline-none focus:border-brand-plum"
            />
          </div>
        </div>

        {/* 4-Tier Location Hierarchy Filter Bar */}
        <LocationFilterBar
          filters={locationFilters}
          onChange={handleLocationFiltersChange}
          onSelectLocation={(loc) => setSelectedLocation(loc)}
          onGpsClick={handleGpsClick}
          onReset={handleResetFilters}
        />

        {/* Business Category Tabs & 100% Pure Veg Filter */}
        <div className="mt-2 mb-8">
          <BusinessCategoryTabs
            selectedCategory={selectedBusinessCategory}
            onSelectCategory={handleCategoryChange}
            isPureVeg={isPureVeg}
            onTogglePureVeg={() => setIsPureVeg(!isPureVeg)}
          />
        </div>

        {/* Live Backend Connection Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between py-2 px-4 rounded-xl bg-white border border-brand-border text-xs text-brand-muted shadow-2xs">
            <div className="flex items-center gap-2">
              <Server className={`w-3.5 h-3.5 ${isFromBackend ? "text-emerald-600" : "text-amber-500"}`} />
              <span className="font-medium text-brand-espresso">
                {isFromBackend
                  ? "Connected to Spring Boot API (http://localhost:8080)"
                  : "Development Mode (Local Fallback Active)"}
              </span>
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold ${
                isFromBackend
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {isFromBackend ? "LIVE BACKEND" : "OFFLINE FALLBACK"}
            </span>
          </div>
        </div>

        {/* Dynamic Bakery Results Grid (Real Backend Data) */}
        <div>
          <BakeryGrid
            bakeries={displayedBakeries}
            isLoading={isLoading}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
