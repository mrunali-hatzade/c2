"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/marketplace/HeroSection";
import { TrustBenefits } from "@/components/marketplace/TrustBenefits";
import { HowItWorks } from "@/components/marketplace/HowItWorks";
import { BakeryGrid } from "@/components/marketplace/BakeryGrid";
import { CustomerTestimonials } from "@/components/marketplace/CustomerTestimonials";
import { OwnerCTA } from "@/components/marketplace/OwnerCTA";
import { Footer } from "@/components/layout/Footer";

// V2 Location Feature
import { LocationFilterBar, LocationFiltersState } from "@/components/marketplace/LocationFilterBar";
import { BusinessCategoryTabs, BusinessCategory } from "@/components/marketplace/BusinessCategoryTabs";

import { fetchShops, mapCategoryToBusinessType, fetchFeaturedCakes } from "@/lib/api/storefront";
import { StorefrontShop, Product } from "@/types/storefront";
import { CheckCircle2, Server, AlertCircle } from "lucide-react";

export default function MarketplaceHomePage() {
  const [selectedLocation, setSelectedLocation] = useState("Akurdi");
  const [locationQuery, setLocationQuery] = useState("Akurdi");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  // V2 Category Tabs State
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState<BusinessCategory>("All Businesses");
  const [isPureVeg, setIsPureVeg] = useState(false);

  // V2 Location Filter State
  const [locationFilters, setLocationFilters] = useState<LocationFiltersState>({
    state: "Maharashtra",
    district: "All Districts",
    city: "All Cities",
    village: "All Villages / Areas",
  });

  const [bakeries, setBakeries] = useState<StorefrontShop[]>([]);
  const [cakes, setCakes] = useState<Product[]>([]);
  const [isFromBackend, setIsFromBackend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  /**
   * Unified marketplace query function.
   * Calls the structured backend search API:
   * GET /api/storefront/shops/search?state=...&district=...&city=...&area=...&businessType=...&search=...
   */
  const loadMarketplaceData = useCallback(
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
        const shopsResult = await fetchShops({
          state: loc.state,
          district: loc.district,
          city: loc.city,
          area: loc.village,
          businessType: businessType,
          search: q,
        });

        setBakeries(shopsResult.data);
        setIsFromBackend(shopsResult.isFromBackend);
        if (shopsResult.error) {
          setErrorMessage(shopsResult.error);
        }

        // Fetch cakes for the loaded shops
        const cakesResult = await fetchFeaturedCakes(shopsResult.data);
        setCakes(cakesResult.data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unable to load bakeries right now.";
        setErrorMessage(msg);
        showToast("Unable to reach backend. Using offline catalogue.");
      } finally {
        setIsLoading(false);
      }
    },
    [locationFilters, selectedBusinessCategory, searchQuery, showToast]
  );

  // Initial load
  useEffect(() => {
    loadMarketplaceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter handlers with single clean API call
  const handleLocationFiltersChange = (newFilters: LocationFiltersState) => {
    setLocationFilters(newFilters);
    loadMarketplaceData({ location: newFilters });
  };

  const handleCategoryChange = (newCategory: BusinessCategory) => {
    setSelectedBusinessCategory(newCategory);
    loadMarketplaceData({ category: newCategory });
  };

  const handleSearchSubmit = async () => {
    const targetQuery = searchQuery || locationQuery;
    await loadMarketplaceData({ search: targetQuery });

    const element = document.getElementById("bakeries");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
    setLocationQuery("");
    loadMarketplaceData({
      location: defaultFilters,
      category: "All Businesses",
      search: "",
    });
    showToast("Filters reset to all bakeries");
  };

  const handleGpsClick = () => {
    showToast("Detecting GPS location...");
    setTimeout(() => {
      const gpsFilters: LocationFiltersState = {
        state: "Maharashtra",
        district: "Pune",
        city: "Pimpri-Chinchwad",
        village: "Akurdi",
      };
      setLocationFilters(gpsFilters);
      setSelectedLocation("Akurdi");
      setLocationQuery("Akurdi");
      loadMarketplaceData({ location: gpsFilters });
      showToast("Location set to Akurdi, Pune");
    }, 800);
  };

  const handleAddToCart = (cake: Product) => {
    setCartCount((prev) => prev + 1);
    showToast(`Added "${cake.name}" to cart!`);
  };

  const handleSelectBakery = (_shop: StorefrontShop) => {
    // Nav handled via links
  };

  // Optional pure veg client tag filter (per requirements, pure veg is not sent to backend yet)
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

  // Filtered Cakes based on selected Category and Search
  const filteredCakes = useMemo(() => {
    return cakes.filter((cake) => {
      let matchesCategory = true;
      if (selectedCategory !== "all") {
        if (selectedCategory === "birthday") {
          matchesCategory = cake.category?.toLowerCase().includes("birthday") || false;
        } else if (selectedCategory === "wedding") {
          matchesCategory = cake.category?.toLowerCase().includes("wedding") || false;
        } else if (selectedCategory === "chocolate") {
          matchesCategory =
            cake.name.toLowerCase().includes("chocolate") ||
            cake.description?.toLowerCase().includes("chocolate") ||
            false;
        }
      }
      return matchesCategory;
    });
  }, [cakes, selectedCategory]);

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans text-brand-espresso flex flex-col selection:bg-brand-plum selection:text-white">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Sticky Navbar */}
      <Navbar
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => {
          setSelectedLocation(loc);
          setLocationQuery(loc);
        }}
        cartCount={cartCount}
      />

      <main className="flex-1">
        {/* 3. Hero Section with Search & High-Res Visual */}
        <HeroSection
          locationQuery={locationQuery}
          onLocationChange={setLocationQuery}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* --- V2 Location Filter Bar (Directly connected to backend) --- */}
        <div className="relative z-20 mt-4 sm:-mt-6">
          <LocationFilterBar
            filters={locationFilters}
            onChange={handleLocationFiltersChange}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            onGpsClick={handleGpsClick}
            onReset={handleResetFilters}
          />
        </div>

        {/* --- V2 Business Category Tabs (Directly connected to backend) --- */}
        <div className="relative z-10 mt-4 sm:mt-1">
          <BusinessCategoryTabs
            selectedCategory={selectedBusinessCategory}
            onSelectCategory={handleCategoryChange}
            isPureVeg={isPureVeg}
            onTogglePureVeg={() => setIsPureVeg(!isPureVeg)}
          />
        </div>

        {/* Backend Live Indicator Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
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

        {/* 4. Trust / Benefits Ribbon */}
        <TrustBenefits />

        {/* 5. Bakery Grid (Live Backend Driven) */}
        <BakeryGrid
          bakeries={displayedBakeries}
          onSelectBakery={handleSelectBakery}
          isLoading={isLoading}
        />

        {/* 6. How It Works Section */}
        <HowItWorks />

        {/* 7. Customer Testimonials */}
        <CustomerTestimonials />

        {/* 8. Owner CTA Banner */}
        <OwnerCTA />
      </main>

      {/* 9. Global Footer */}
      <Footer />

      {/* Interactive Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-brand-espresso text-white text-xs font-semibold rounded-2xl shadow-xl animate-in slide-in-from-bottom-5 duration-300 border border-brand-border/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error / Warning Notification */}
      {errorMessage && !isFromBackend && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-amber-50 text-amber-900 text-xs font-semibold rounded-2xl shadow-lg border border-amber-200 animate-in slide-in-from-top-4 duration-300">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Backend offline. Showing local development fallback.</span>
        </div>
      )}
    </div>
  );
}
