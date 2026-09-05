"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StorefrontNavbar } from "@/components/storefront/StorefrontNavbar";
import { Footer } from "@/components/layout/Footer";
import { fetchShopDetails, fetchShopProducts } from "@/lib/api/storefront";
import { StorefrontShop, Product } from "@/types/storefront";
import { ProductDetailModal } from "@/components/storefront/ProductDetailModal";
import { StorefrontCheckoutModal } from "@/components/checkout/StorefrontCheckoutModal";
import { useStorefrontCart } from "@/lib/hooks/useStorefrontCart";
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
  Heart,
  Star,
  Package,
  SlidersHorizontal,
} from "lucide-react";

const FALLBACK_COVER = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80";
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

// Helper to provide realistic tags matching the reference design
function getCakeTags(product: Product): string[] {
  const name = product.name.toLowerCase();
  const desc = (product.description || "").toLowerCase();

  if (name.includes("chocolate") || desc.includes("chocolate") || name.includes("truffle")) {
    return ["Belgian Chocolate", "Moist", "ganache"];
  }
  if (name.includes("velvet") || desc.includes("velvet")) {
    return ["Cream Cheese", "Silky", "classic"];
  }
  if (name.includes("vanilla") || desc.includes("vanilla")) {
    return ["Madagascar Bean", "Fluffy", "sponge"];
  }
  if (name.includes("forest") || desc.includes("cherry")) {
    return ["Dark Cherries", "Whipped Cream", "kirsch"];
  }
  if (name.includes("pineapple") || desc.includes("pineapple")) {
    return ["Fresh Pineapple", "Light", "tropical"];
  }
  if (name.includes("mango") || desc.includes("passion")) {
    return ["Alphonso Mango", "Puree", "fruity"];
  }
  if (name.includes("biscoff") || desc.includes("lotus")) {
    return ["Caramelized", "Biscoff Crumb", "creamy"];
  }
  if (product.category) {
    return [product.category, "Oven Fresh", "Handcrafted"];
  }
  return ["Artisan Bake", "Moist", "Handcrafted"];
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

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Storefront Cart Hook
  const cart = useStorefrontCart(shopId ? Number(shopId) : undefined, shop?.businessName);

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

  // Distinct categories from actual products, plus standard celebration cake tags
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    const defaultList = ["Birthday Cakes", "Wedding Cakes", "Pastries", "Custom Cakes", "Occasions"];
    defaultList.forEach((c) => set.add(c));
    return Array.from(set);
  }, [products]);

  // Combined Category & Search Query Filter
  const displayedProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "all" ||
        (p.category && p.category.toLowerCase() === activeCategory.toLowerCase()) ||
        p.name.toLowerCase().includes(activeCategory.toLowerCase().replace("cakes", "").trim());

      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleQuickAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    cart.addItem({
      productId: product.id,
      productName: product.name,
      unitPrice: Number(product.price),
      quantity: 1,
      imageUrl: product.imageUrl || FALLBACK_CAKE,
      dietaryPreference: "EGGLESS",
      cakeMessage: "Happy Birthday!",
    });
  };

  const handleOpenCustomize = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col font-sans">
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-brand-plum/20 border-t-brand-plum animate-spin" />
            <h2 className="text-xl font-bold font-serif text-brand-espresso">Loading bakery storefront...</h2>
            <p className="text-sm text-brand-muted max-w-sm">Fetching verified menu and fresh bakery showcase...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not Found State
  if (isNotFound) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col font-sans">
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
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col font-sans">
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
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col font-sans">
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

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-sans text-brand-espresso flex flex-col selection:bg-brand-plum selection:text-white">
      {/* ── 1. Storefront Dedicated Navigation Bar & Cart Popover ── */}
      <StorefrontNavbar
        bakeryName={shop.businessName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        cartItems={cart.items}
        cartCount={cart.itemCount}
        subtotal={cart.subtotal}
        discount={cart.discount}
        deliveryFee={cart.deliveryFee}
        total={cart.total}
        couponCode={cart.couponCode}
        isCartOpen={cart.isCartOpen}
        onToggleCart={() => cart.setIsCartOpen(!cart.isCartOpen)}
        onCloseCart={() => cart.setIsCartOpen(false)}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onCustomizeItem={(item) => {
          const prod = products.find((p) => p.id === item.productId);
          if (prod) {
            handleOpenCustomize(prod);
          }
        }}
        onProceedToCheckout={() => setIsCheckoutModalOpen(true)}
      />

      <main className="flex-1 pb-20">
        {/* ── 2. Hero Banner Matching Reference Mockup ── */}
        <section className="bg-[#341B16] text-white overflow-hidden shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Headline & Badges */}
              <div className="lg:col-span-7 space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight leading-tight">
                  Artisan Cakes Delivered Fresh
                </h1>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* Rating Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold">
                    <span className="text-amber-400 font-bold">★ 4.9</span>
                    <span className="text-white/80">(1,280+ Reviews)</span>
                  </div>

                  {/* Delivery Slot Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>Next Delivery Slot: <strong className="text-white">Today, 5-7 PM</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Showcase Photo */}
              <div className="lg:col-span-5 relative h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 hidden sm:block">
                <Image
                  src={shop.coverImageUrl || FALLBACK_COVER}
                  alt={shop.businessName}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#341B16]/60 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Product Cards Grid Matching Reference Mockup ── */}
        <section id="showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          {displayedProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-brand-border shadow-soft max-w-2xl mx-auto space-y-3">
              <Package className="w-12 h-12 text-brand-plum/40 mx-auto" />
              <h3 className="text-lg font-bold text-brand-espresso">No cakes found matching your selection</h3>
              <p className="text-sm text-brand-muted max-w-md mx-auto">
                Try switching the category tab or clearing your search term to see all oven-fresh creations from {shop.businessName}.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="mt-2 px-5 py-2.5 rounded-full bg-brand-plum text-white text-xs font-bold hover:bg-brand-plum-hover transition-colors"
              >
                Show All Cakes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
              {displayedProducts.map((product) => {
                const isFavorited = wishlist.includes(product.id);
                const tags = getCakeTags(product);
                const formattedPrice = Number(product.price).toLocaleString("en-IN");

                return (
                  <div
                    key={product.id}
                    onClick={() => handleOpenCustomize(product)}
                    className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-border/70 shadow-sm hover:shadow-xl hover:border-brand-border transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    {/* Cake Photo Container with Badges */}
                    <div className="relative w-full h-56 bg-brand-cream-dark overflow-hidden">
                      <Image
                        src={product.imageUrl || FALLBACK_CAKE}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* VEG Badge (Top Left) */}
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#238038] text-white text-3xs font-extrabold tracking-wider shadow-xs">
                        VEG
                      </div>

                      {/* Wishlist Heart Icon (Top Right) */}
                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isFavorited
                            ? "bg-rose-50 text-rose-600 shadow-xs"
                            : "bg-white/80 hover:bg-white text-brand-espresso/70 hover:text-rose-500"
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
                      </button>
                    </div>

                    {/* Cake Details */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-white">
                      <div className="space-y-1.5">
                        {/* Price & Rating Row */}
                        <div className="flex items-center justify-between">
                          <span className="text-base sm:text-lg font-extrabold text-brand-espresso">
                            ₹{formattedPrice}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-bold text-brand-espresso">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>4.8★</span>
                          </div>
                        </div>

                        {/* Title & Weight */}
                        <h3 className="text-sm sm:text-base font-bold text-brand-espresso line-clamp-1 group-hover:text-brand-plum transition-colors">
                          {product.name}, 1 Kg
                        </h3>

                        {/* Flavor / Texture Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-3xs font-medium px-2 py-0.5 rounded-md bg-brand-cream text-brand-muted border border-brand-border/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons: Add to Cart & Customize */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-brand-border/60">
                        <button
                          type="button"
                          onClick={(e) => handleQuickAddToCart(product, e)}
                          className="w-full py-2.5 rounded-xl bg-[#341B16] hover:bg-black text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                        >
                          Add to Cart
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleOpenCustomize(product, e)}
                          className="w-full py-2.5 rounded-xl bg-white border border-brand-border hover:bg-brand-cream text-brand-espresso text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                        >
                          Customize
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── 4. Bakery Story & Trust Footer Information ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-brand-border/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum">
                <MapPin className="w-4 h-4" />
                <span>Storefront Location</span>
              </div>
              <p className="text-sm font-semibold text-brand-espresso">
                {shop.area || shop.city}
              </p>
              <p className="text-xs text-brand-muted leading-relaxed">
                {[shop.address, shop.area, shop.city, shop.state].filter(Boolean).join(", ")}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-brand-border/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum">
                <Clock className="w-4 h-4" />
                <span>Fresh Kitchen Schedule</span>
              </div>
              <p className="text-sm font-semibold text-brand-espresso">
                Daily Baking & Same-Day Dispatch
              </p>
              <p className="text-xs text-brand-muted leading-relaxed">
                Guaranteed freshness crafted with pure ingredients for every occasion.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-brand-border/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum">
                <Award className="w-4 h-4" />
                <span>Verified Artisan Baker</span>
              </div>
              <p className="text-sm font-semibold text-brand-espresso">
                {shop.fssaiRegistration ? `FSSAI: ${shop.fssaiRegistration}` : "Certified Kitchen Preparation"}
              </p>
              <p className="text-xs text-brand-muted leading-relaxed">
                Handcrafted celebration cakes with verified customer ratings and direct bakery support.
              </p>
            </div>
          </div>
        </section>

        {/* Real Product Detail & Customization Modal */}
        <ProductDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          product={selectedProduct}
          shop={shop}
          onAddToCart={(customItem) => {
            cart.addItem(customItem);
          }}
        />

        {/* Dedicated In-Store Checkout Modal (Zero Marketplace Redirect) */}
        <StorefrontCheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          shop={shop}
          items={cart.items}
          subtotal={cart.subtotal}
          discount={cart.discount}
          deliveryFee={cart.deliveryFee}
          total={cart.total}
          couponCode={cart.couponCode}
          onOrderSuccess={(order) => {
            cart.clearCart();
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
