'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Cake, Sparkles, Filter, Search } from 'lucide-react';
import { storefrontApi } from '@/lib/api/storefront';
import { Shop } from '@/types/shop';
import { Product, Category } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { StorefrontNavbar } from '@/components/customer/storefront/StorefrontNavbar';
import { StorefrontBanner } from '@/components/customer/storefront/StorefrontBanner';
import { ProductCard } from '@/components/customer/storefront/ProductCard';
import { ProductDetailModal } from '@/components/customer/storefront/ProductDetailModal';
import { CustomCakeInquiryModal } from '@/components/customer/storefront/CustomCakeInquiryModal';
import { CartDrawer } from '@/components/customer/storefront/CartDrawer';
import { StorefrontCheckoutModal } from '@/components/customer/storefront/StorefrontCheckoutModal';
import { Footer } from '@/components/common/Footer';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

export default function StorefrontPage() {
  const params = useParams();
  const shopId = params?.id as string;

  const { isCheckoutOpen, setIsCheckoutOpen } = useCart();

  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [selectedCategoryId, setSelectedCategoryId] = useState<'ALL' | number>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [egglessOnly, setEgglessOnly] = useState<boolean>(false);

  // Product Detail / Customization Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isCustomInquiryOpen, setIsCustomInquiryOpen] = useState<boolean>(false);

  const loadStorefrontData = useCallback(async () => {
    if (!shopId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [shopData, productsData, categoriesData] = await Promise.all([
        storefrontApi.getShopById(shopId),
        storefrontApi.getStorefrontProducts(shopId),
        storefrontApi.getStorefrontCategories(shopId),
      ]);
      setShop(shopData);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load storefront');
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    loadStorefrontData();
  }, [loadStorefrontData]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  // Filter products by category ID, search query, and eggless preference
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategoryId === 'ALL' || p.categoryId === selectedCategoryId;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesEggless = !egglessOnly || p.isEggless;
    return matchesCategory && matchesSearch && matchesEggless;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream-light">
        <LoadingState message="Loading bakery boutique storefront..." />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream-light p-4">
        <ErrorState
          message={error || 'Storefront not found'}
          onRetry={loadStorefrontData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream-light">
      {/* Storefront Header with in-store basket trigger */}
      <StorefrontNavbar shop={shop} />

      {/* Bakery Hero Banner */}
      <StorefrontBanner shop={shop} />

      {/* Storefront Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-brand-border/60">
          <div>
            <h2 className="text-2xl font-serif font-bold text-brand-espresso">
              Fresh Bakery Creations
            </h2>
            <p className="text-xs text-brand-muted mt-1">
              Select any cake to personalize message, schedule delivery, and order directly from this kitchen.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Search within store */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                placeholder="Search this shop's cakes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white rounded-full border border-brand-border text-xs text-brand-espresso placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-plum/20 w-56 sm:w-64 shadow-xs"
              />
            </div>

            {/* Eggless toggle */}
            <button
              onClick={() => setEgglessOnly(!egglessOnly)}
              className={`px-3.5 py-2 rounded-full border text-xs font-semibold transition-all shrink-0 ${
                egglessOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50 shadow-2xs'
              }`}
            >
              🌱 Eggless Only
            </button>

            {/* Custom Cake Inquiry Button */}
            <button
              onClick={() => setIsCustomInquiryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-brand-plum text-brand-plum hover:bg-brand-plum hover:text-white text-xs font-semibold transition-all shadow-2xs shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request Custom Cake</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills (rendered only when shop has categories) */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none max-w-full">
            <button
              type="button"
              onClick={() => setSelectedCategoryId('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                selectedCategoryId === 'ALL'
                  ? 'bg-brand-plum text-white border-brand-plum shadow-sm'
                  : 'bg-white text-brand-espresso border-brand-border/80 hover:bg-brand-blush/60'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                  selectedCategoryId === cat.id
                    ? 'bg-brand-plum text-white border-brand-plum shadow-sm'
                    : 'bg-white text-brand-espresso border-brand-border/80 hover:bg-brand-blush/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={<Cake className="w-7 h-7" />}
            title="No Cakes Found"
            description="No items match your selected filters. Try clearing your search or category."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleOpenProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* In-Store Product Customization Modal */}
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct}
        shop={shop}
        onOpenCustomQuote={() => setIsCustomInquiryOpen(true)}
      />

      {/* Bespoke Custom Cake Inquiry Modal */}
      <CustomCakeInquiryModal
        isOpen={isCustomInquiryOpen}
        onClose={() => setIsCustomInquiryOpen(false)}
        shop={shop}
      />

      {/* In-Store Cart Drawer */}
      <CartDrawer />

      {/* In-Store Checkout Modal (Never redirects to marketplace) */}
      <StorefrontCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        shop={shop}
      />

      <Footer />
    </div>
  );
}
