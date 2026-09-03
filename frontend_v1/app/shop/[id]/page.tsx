"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchShopDetails, fetchShopProducts } from "@/lib/api/storefront";
import { StorefrontShop, Product } from "@/types/storefront";
import { ProductDetailModal } from "@/components/storefront/ProductDetailModal";
import {
  MapPin,
  Phone,
  Clock,
  Sparkles,
  ShieldCheck,
  Award,
  AlertCircle,
  ArrowLeft,
  Store,
  Cake,
  ExternalLink,
  MessageCircle,
  Package,
  Eye,
} from "lucide-react";

const FALLBACK_COVER = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80";
const FALLBACK_CAKE = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80";

function formatBusinessType(type?: string): string {
  if (!type) return "Bakery & Confectionery";
  switch (type.toUpperCase()) {
    case "HOME_BAKERY":
      return "Home Bakery";
    case "CAKE_STUDIO":
      return "Cake Studio";
    case "BAKERY_SHOP":
      return "Bakery Shop";
    case "ONLINE_CAKE_BUSINESS":
      return "Online Cake Business";
    default:
      return type.replace(/_/g, " ");
  }
}

export default function ShopProfilePage() {
  const params = useParams();
  const shopId = params?.id ? String(params.id) : "";

  const [shop, setShop] = useState<StorefrontShop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!shopId) return;
    setIsLoading(true);
    setIsNotFound(false);
    setIsUnavailable(false);
    setErrorMessage(null);

    try {
      // 1. Fetch real shop details
      const shopRes = await fetchShopDetails(shopId);

      if (shopRes.isUnavailable) {
        setIsUnavailable(true);
        setIsLoading(false);
        return;
      }

      if (shopRes.isNotFound || !shopRes.shop) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      setShop(shopRes.shop);

      // 2. Fetch real products for this shop
      const prodsRes = await fetchShopProducts(shopId);
      setProducts(prodsRes.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to load bakery";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Distinct categories from actual products
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const displayedProducts = React.useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream-light flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-brand-plum/20 border-t-brand-plum animate-spin" />
            <h2 className="text-xl font-bold font-serif text-brand-espresso">Loading bakery...</h2>
            <p className="text-sm text-brand-muted max-w-sm">Fetching verified bakery details and showcase products...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not Found State
  if (isNotFound) {
    return (
      <div className="min-h-screen bg-brand-cream-light flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
          <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-10 border border-brand-border shadow-soft space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Store className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-brand-espresso">Bakery not found</h1>
            <p className="text-sm text-brand-muted leading-relaxed">
              We couldn&apos;t find a bakery matching ID #{shopId}. It may have been removed or the link might be incorrect.
            </p>
            <div className="pt-2">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-plum text-white text-sm font-semibold hover:bg-brand-plum-hover transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Explore Other Bakeries</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Inactive / Non-Public Shop State
  if (isUnavailable) {
    return (
      <div className="min-h-screen bg-brand-cream-light flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
          <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-10 border border-brand-border shadow-soft space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-blush text-brand-plum flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-brand-espresso">Bakery is currently unavailable</h1>
            <p className="text-sm text-brand-muted leading-relaxed">
              This bakery profile is currently not active or is undergoing verification. Please check back later or explore other verified local bakers.
            </p>
            <div className="pt-2">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-plum text-white text-sm font-semibold hover:bg-brand-plum-hover transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Browse Active Bakeries</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Backend / Network Error State
  if (errorMessage && !shop) {
    return (
      <div className="min-h-screen bg-brand-cream-light flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
          <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-10 border border-brand-border shadow-soft space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-brand-espresso">Unable to load bakery</h1>
            <p className="text-sm text-brand-muted leading-relaxed">
              We encountered an issue connecting to the bakery service. Please check your connection or try again.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => loadData()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-plum text-white text-sm font-semibold hover:bg-brand-plum-hover transition-colors shadow-sm cursor-pointer"
              >
                <span>Retry</span>
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand-cream border border-brand-border text-brand-espresso text-sm font-semibold hover:bg-brand-cream-dark transition-colors"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!shop) return null;

  const fullLocation = [shop.address, shop.area, shop.city, shop.district, shop.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans text-brand-espresso flex flex-col selection:bg-brand-plum selection:text-white">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Back navigation link */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-plum transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to All Bakeries</span>
          </Link>
        </div>

        {/* ── A. Bakery Header ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="relative rounded-3xl overflow-hidden bg-brand-espresso border border-brand-border/60 shadow-md">
            {/* Bakery Cover Image */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full">
              <Image
                src={shop.coverImageUrl || FALLBACK_COVER}
                alt={shop.businessName}
                fill
                priority
                className="object-cover opacity-60"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-brand-espresso/50 to-transparent" />
            </div>

            {/* Profile Info Card Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-plum text-white text-xs font-bold shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-brand-cream" />
                    <span>{formatBusinessType(shop.businessType)}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Active Baker</span>
                  </span>

                  {shop.businessCategory && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-md border border-white/20">
                      {shop.businessCategory}
                    </span>
                  )}
                </div>

                {/* Bakery Name */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white tracking-tight">
                  {shop.businessName}
                </h1>

                {/* Short Description */}
                {shop.description && (
                  <p className="text-sm sm:text-base text-brand-cream/90 leading-relaxed line-clamp-2">
                    {shop.description}
                  </p>
                )}

                {/* Location snippet */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-brand-cream/80">
                  <MapPin className="w-4 h-4 text-brand-rose shrink-0" />
                  <span className="truncate">{shop.area ? `${shop.area}, ${shop.city}` : shop.city}</span>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="flex flex-wrap items-center gap-3">
                {shop.phone && (
                  <>
                    <a
                      href={`tel:${shop.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-brand-espresso text-xs font-bold hover:bg-brand-cream transition-colors shadow-sm"
                    >
                      <Phone className="w-4 h-4 text-brand-plum" />
                      <span>Call Baker</span>
                    </a>

                    <a
                      href={`https://wa.me/91${shop.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── B. Bakery Information Bar ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location & Address */}
            <div className="bg-white rounded-3xl p-6 border border-brand-border/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum">
                <MapPin className="w-4 h-4" />
                <span>Storefront Location</span>
              </div>
              <p className="text-sm font-semibold text-brand-espresso">
                {shop.area || shop.city}
              </p>
              <p className="text-xs text-brand-muted leading-relaxed">
                {fullLocation}
              </p>
              {shop.pincode && (
                <span className="inline-block text-2xs font-semibold px-2 py-0.5 rounded-md bg-brand-cream border border-brand-border text-brand-espresso">
                  PIN: {shop.pincode}
                </span>
              )}
            </div>

            {/* Operating & Contact Information */}
            <div className="bg-white rounded-3xl p-6 border border-brand-border/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum">
                <Clock className="w-4 h-4" />
                <span>Bakery Hours & Contact</span>
              </div>
              <p className="text-sm font-semibold text-brand-espresso">
                Fresh Daily Bakes & Orders
              </p>
              <p className="text-xs text-brand-muted leading-relaxed">
                {shop.phone ? `Direct Line: ${shop.phone}` : "Contact baker via storefront order"}
              </p>
              <div className="flex items-center gap-2 pt-1 text-2xs font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open for Custom Orders & Inquiries</span>
              </div>
            </div>

            {/* Quality & Trust Standards */}
            <div className="bg-white rounded-3xl p-6 border border-brand-border/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum">
                <Award className="w-4 h-4" />
                <span>Trust & Quality</span>
              </div>
              <p className="text-sm font-semibold text-brand-espresso">
                {shop.fssaiRegistration ? `FSSAI: ${shop.fssaiRegistration}` : "FSSAI Registered Baker"}
              </p>
              <p className="text-xs text-brand-muted leading-relaxed">
                {shop.yearsInBusiness ? `${shop.yearsInBusiness} years of crafting delicious celebrations` : "Artisan baker crafting verified celebration cakes"}
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-2xs font-medium text-brand-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-plum" />
                <span>Direct Kitchen Preparation</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── C. Real Products / Cakes Showcase ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-plum mb-2">
                <Cake className="w-3.5 h-3.5" />
                <span>Oven-Fresh Creations</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-brand-espresso tracking-tight">
                Bakery <span className="text-brand-plum italic">Showcase</span>
              </h2>
              <p className="text-sm text-brand-muted mt-1">
                Explore signature cakes and pastries freshly prepared by {shop.businessName}
              </p>
            </div>

            {/* Category tabs if multiple categories exist */}
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    activeCategory === "all"
                      ? "bg-brand-plum text-white shadow-2xs"
                      : "bg-white text-brand-muted border border-brand-border hover:border-brand-plum/40"
                  }`}
                >
                  All ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      activeCategory === cat
                        ? "bg-brand-plum text-white shadow-2xs"
                        : "bg-white text-brand-muted border border-brand-border hover:border-brand-plum/40"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Cards Grid or Clean Empty State */}
          {displayedProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-brand-border shadow-soft max-w-2xl mx-auto space-y-3">
              <Package className="w-12 h-12 text-brand-plum/40 mx-auto" />
              <h3 className="text-lg font-bold text-brand-espresso">Products are currently unavailable</h3>
              <p className="text-sm text-brand-muted max-w-md mx-auto">
                {shop.businessName} has not published items to their digital showcase yet. You can still reach out directly via phone or WhatsApp for custom orders.
              </p>
              {shop.phone && (
                <div className="pt-2">
                  <a
                    href={`tel:${shop.phone}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-plum text-white text-xs font-bold hover:bg-brand-plum-hover transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Inquire via Phone</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsDetailModalOpen(true);
                  }}
                  className="group bg-white rounded-3xl overflow-hidden border border-brand-border/80 shadow-soft hover:shadow-card-hover hover:border-brand-plum/30 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative w-full h-52 overflow-hidden bg-brand-cream-dark">
                    <Image
                      src={product.imageUrl || FALLBACK_CAKE}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Category Badge */}
                    {product.category && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-brand-border/60 text-2xs font-bold text-brand-plum shadow-2xs">
                        {product.category}
                      </div>
                    )}

                    {/* Availability Tag */}
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-3xs font-bold">
                      {product.availability ? "Freshly Available" : "Made to Order"}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-brand-espresso group-hover:text-brand-plum transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      {product.description && (
                        <p className="text-xs text-brand-muted mt-1.5 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-brand-border/60">
                      <div>
                        <span className="text-3xs font-semibold uppercase tracking-wider text-brand-muted block">Price</span>
                        <span className="text-lg font-bold text-brand-espresso">
                          ₹{Number(product.price).toFixed(0)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                          setIsDetailModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-cream border border-brand-border hover:bg-brand-plum hover:text-white hover:border-brand-plum text-brand-plum text-xs font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Enquire</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Real Product Detail & Customer Enquiry Modal */}
        <ProductDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          product={selectedProduct}
          shop={shop}
        />
      </main>

      <Footer />
    </div>
  );
}
