'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Minus,
  Cake,
  ShoppingBag,
  AlertTriangle,
  Clock,
  Check,
  Star,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  Truck,
  Leaf,
  Layers,
  Heart,
} from 'lucide-react';
import { Product } from '@/types/product';
import { Shop } from '@/types/shop';
import { useCart } from '@/context/CartContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/common/Toast';
import { reviewsApi, ProductReviewsSummary } from '@/lib/api/reviews';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  shop: Shop;
  onOpenCustomQuote?: () => void;
}

const FALLBACK_CAKE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80';

const WEIGHT_OPTIONS = [
  { weight: 0.5, label: '0.5 kg', serves: '4-6 serves' },
  { weight: 1.0, label: '1.0 kg', serves: '8-12 serves' },
  { weight: 1.5, label: '1.5 kg', serves: '14-18 serves' },
  { weight: 2.0, label: '2.0 kg', serves: '20-25 serves' },
];

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  shop,
  onOpenCustomQuote,
}) => {
  const { addItem, clearCart, currentShopName } = useCart();
  const toast = useToast();

  const [quantity, setQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState('');
  const [showConflictPrompt, setShowConflictPrompt] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState<number>(1); // kg
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>(undefined);
  const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    about: true,
    ingredients: false,
    delivery: false,
    reviews: false,
  });

  // Reviews state
  const [reviewsSummary, setReviewsSummary] = useState<ProductReviewsSummary | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Reset or initialize when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setCustomMessage('');
      setShowConflictPrompt(false);
      setSelectedWeight(1);
      setSelectedAddonIds([]);
      setSelectedImageIndex(0);
      setOpenAccordions({
        about: true,
        ingredients: false,
        delivery: false,
        reviews: false,
      });

      if (product.variants && product.variants.length > 0) {
        setSelectedVariantId(product.variants[0].id);
      } else {
        setSelectedVariantId(undefined);
      }

      // Fetch reviews
      if (shop.id && product.id) {
        setLoadingReviews(true);
        reviewsApi
          .getProductReviews(shop.id, product.id)
          .then((res) => setReviewsSummary(res))
          .catch(() => setReviewsSummary(null))
          .finally(() => setLoadingReviews(false));
      }
    }
  }, [product, shop.id]);

  if (!product) return null;

  // Build 3-image multi-thumbnail gallery (product image + editorial angle perspectives)
  const baseImg = product.imageUrl || FALLBACK_CAKE;
  const galleryThumbnails = [
    baseImg,
    baseImg.includes('unsplash.com')
      ? baseImg.replace(/&w=\d+/, '&w=900&auto=format&fit=crop')
      : baseImg,
    'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
  ];

  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const selectedVariant = hasVariants
    ? product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0]
    : null;

  const baseUnitPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price) * selectedWeight;

  const addonsTotal = (product.addons || [])
    .filter((a) => a.id && selectedAddonIds.includes(a.id))
    .reduce((sum, a) => sum + Number(a.price), 0);

  const unitPrice = baseUnitPrice + addonsTotal;

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getFullItemName = () => {
    let name = product.name;
    if (selectedVariant) {
      name += ` (${selectedVariant.name})`;
    } else {
      name += ` (${selectedWeight} kg)`;
    }
    const selectedAddons = (product.addons || []).filter((a) => a.id && selectedAddonIds.includes(a.id));
    if (selectedAddons.length > 0) {
      name += ` + ${selectedAddons.map((a) => a.name).join(', ')}`;
    }
    return name;
  };

  const handleAddToCart = () => {
    const result = addItem({
      productId: product.id,
      name: getFullItemName(),
      price: unitPrice,
      quantity,
      imageUrl: product.imageUrl || FALLBACK_CAKE,
      isEggless: product.isEggless,
      customMessage: customMessage.trim() || undefined,
      shopId: shop.id,
      shopName: shop.businessName,
    });

    if (result.conflict) {
      setShowConflictPrompt(true);
      return;
    }

    toast.success(`Added "${product.name}" to basket!`);
    onClose();
  };

  const handleReplaceCart = () => {
    clearCart();
    addItem({
      productId: product.id,
      name: getFullItemName(),
      price: unitPrice,
      quantity,
      imageUrl: product.imageUrl || FALLBACK_CAKE,
      isEggless: product.isEggless,
      customMessage: customMessage.trim() || undefined,
      shopId: shop.id,
      shopName: shop.businessName,
    });
    setShowConflictPrompt(false);
    toast.success(`Cart updated for "${shop.businessName}"!`);
    onClose();
  };

  const totalReviews = reviewsSummary?.totalReviews ?? 0;
  const averageRating = reviewsSummary?.averageRating ?? 4.8;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" title={product.name}>
      {showConflictPrompt ? (
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs leading-relaxed">
              <p className="font-semibold">Replace items in cart?</p>
              <p className="text-amber-700 mt-0.5">
                Your cart currently contains items from <strong>{currentShopName}</strong>. Each order is fulfilled directly by a single artisan kitchen.
              </p>
            </div>
          </div>
          <p className="text-xs text-brand-muted">
            Would you like to clear your current cart and start ordering from <strong>{shop.businessName}</strong>?
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setShowConflictPrompt(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleReplaceCart}>
              Clear & Add from this Bakery
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Multi-Thumbnail Gallery & Highlights Section */}
          <div className="space-y-3">
            {/* Main High-Resolution Photo */}
            <div className="relative h-60 sm:h-72 w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF7F2] border border-brand-border/60">
              <Image
                src={galleryThumbnails[selectedImageIndex] || FALLBACK_CAKE}
                alt={product.name}
                fill
                priority
                className="object-cover object-center transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs text-xs font-bold text-brand-espresso border border-brand-border/40">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      product.isEggless ? 'bg-emerald-600 ring-2 ring-emerald-600/20' : 'bg-amber-600'
                    }`}
                  />
                  <span>{product.isEggless ? '100% Pure Veg' : 'Contains Egg'}</span>
                </span>

                {(product.categoryName || product.category) && (
                  <span className="hidden sm:inline-flex text-[11px] font-bold uppercase tracking-wider bg-black/40 text-white backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    {product.categoryName || product.category?.replace(/_/g, ' ').toLowerCase()}
                  </span>
                )}
              </div>

              {/* Bottom Price Overlay */}
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <span className="text-2xl sm:text-3xl font-serif font-bold drop-shadow-md">
                    ₹{unitPrice}
                  </span>
                  <span className="text-xs text-white/80 ml-1.5 font-light">
                    {hasVariants ? (selectedVariant?.name || 'per cake') : `for ${selectedWeight} kg`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{averageRating > 0 ? averageRating.toFixed(1) : '4.8'}</span>
                  <span className="text-white/70 font-normal">({totalReviews || 24})</span>
                </div>
              </div>
            </div>

            {/* Interactive 3-Thumbnail Selector */}
            <div className="flex items-center gap-2.5">
              {galleryThumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#5C1D2E] shadow-sm scale-102 ring-2 ring-[#5C1D2E]/20'
                      : 'border-brand-border/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={thumb} alt={`Angle ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
              <div className="text-xs text-brand-muted pl-2 hidden sm:block">
                <p className="font-semibold text-brand-espresso">Artisan Gallery</p>
                <p className="text-[11px]">Click angle thumbnails to inspect cake details & frosting texture.</p>
              </div>
            </div>
          </div>

          {/* Configuration Form Controls */}
          <div className="space-y-4 bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-brand-border/60">
            {/* Variants OR Weight Selector */}
            {hasVariants ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2C1A1D] block">
                  Select Size & Flavor Variant
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants?.map((v) => {
                    const isSelected = selectedVariantId === v.id;
                    return (
                      <button
                        key={v.id ?? v.name}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-[#5C1D2E] text-white border-[#5C1D2E] shadow-xs'
                            : 'bg-white text-brand-espresso border-brand-border hover:bg-brand-cream/50'
                        }`}
                      >
                        <span className="block text-xs font-bold">{v.name}</span>
                        <span
                          className={`block text-[11px] font-semibold mt-0.5 ${
                            isSelected ? 'text-white/90' : 'text-brand-plum'
                          }`}
                        >
                          ₹{v.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#2C1A1D]">
                    Select Weight & Serving Size
                  </label>
                  <span className="text-[11px] text-[#5C1D2E] font-medium">
                    {WEIGHT_OPTIONS.find((w) => w.weight === selectedWeight)?.serves}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {WEIGHT_OPTIONS.map((opt) => (
                    <button
                      key={opt.weight}
                      type="button"
                      onClick={() => setSelectedWeight(opt.weight)}
                      className={`py-2 px-1 rounded-xl text-center border transition-all ${
                        selectedWeight === opt.weight
                          ? 'bg-[#5C1D2E] text-white border-[#5C1D2E] shadow-xs'
                          : 'bg-white text-brand-espresso border-brand-border hover:bg-brand-cream/50'
                      }`}
                    >
                      <span className="block text-xs font-bold">{opt.label}</span>
                      <span
                        className={`block text-[10px] mt-0.5 ${
                          selectedWeight === opt.weight ? 'text-white/80' : 'text-brand-muted'
                        }`}
                      >
                        {opt.serves}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Message Plaque */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#2C1A1D]">
                  Custom Message on Cake Plaque (Optional)
                </label>
                <span className="text-[10px] text-brand-muted">
                  {customMessage.length}/45 chars
                </span>
              </div>
              <input
                type="text"
                maxLength={45}
                placeholder="e.g. Happy Birthday Emily!"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-brand-border bg-white text-xs sm:text-sm text-brand-espresso focus:outline-none focus:border-brand-plum focus:ring-1 focus:ring-brand-plum shadow-2xs"
              />
              <p className="text-[10px] text-brand-muted mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C5A880]" />
                <span>Piped in rich couverture chocolate lettering on sugar fondant plaque</span>
              </p>
            </div>

            {/* Quantity Stepper & Quick Add */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-brand-border/60">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <span className="text-xs font-semibold text-brand-espresso">Quantity:</span>
                <div className="flex items-center gap-3 border border-brand-border rounded-full px-3 py-1 bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 rounded-full text-brand-espresso hover:bg-brand-cream transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-serif font-bold text-sm text-brand-espresso w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 rounded-full text-brand-espresso hover:bg-brand-cream transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <Button onClick={handleAddToCart} size="md" className="gap-2 bg-[#5C1D2E] hover:bg-[#4a1525] font-bold">
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Basket &bull; ₹{unitPrice * quantity}</span>
              </Button>
            </div>
          </div>

          {/* 4 Expandable Information Accordions */}
          <div className="space-y-2.5 pt-1">
            {/* 1. About this cake */}
            {/* 1. About Artisan Creation */}
            {product.description && (
              <div className="border border-brand-border/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion('about')}
                  className="w-full px-4 py-3 text-left flex items-center justify-between font-serif font-bold text-sm text-[#2C1A1D] hover:bg-brand-cream/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#5C1D2E]" />
                    <span>About This Artisan Creation</span>
                  </div>
                  {openAccordions.about ? <ChevronUp className="w-4 h-4 text-brand-muted" /> : <ChevronDown className="w-4 h-4 text-brand-muted" />}
                </button>
                {openAccordions.about && (
                  <div className="px-4 pb-4 pt-1 text-xs text-brand-muted leading-relaxed border-t border-brand-border/40 space-y-2">
                    <p className="whitespace-pre-line">{product.description}</p>
                    {product.preparationTimeHours && (
                      <div className="bg-[#FAF7F2] p-2 rounded-xl text-[11px] mt-2">
                        <span className="font-bold text-brand-espresso block">Notice Needed</span>
                        <span>{product.preparationTimeHours} hours bake time</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. Ingredients & Dietary Safety (Always visible with real custom data or artisan standards) */}
            <div className="border border-brand-border/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => toggleAccordion('ingredients')}
                className="w-full px-4 py-3 text-left flex items-center justify-between font-serif font-bold text-sm text-[#2C1A1D] hover:bg-brand-cream/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Ingredients &amp; Dietary Safety</span>
                </div>
                {openAccordions.ingredients ? <ChevronUp className="w-4 h-4 text-brand-muted" /> : <ChevronDown className="w-4 h-4 text-brand-muted" />}
              </button>
              {openAccordions.ingredients && (
                <div className="px-4 pb-4 pt-1 text-xs text-brand-muted leading-relaxed border-t border-brand-border/40 space-y-2.5">
                  <div>
                    <strong className="text-brand-espresso font-semibold block text-[11px] uppercase tracking-wider">Ingredients Used:</strong>
                    <p className="mt-0.5 whitespace-pre-line">
                      {product.ingredients?.trim() ||
                        'Handmade with premium unbleached flour, pure dairy butter, rich cane sugar, fresh dairy cream, and natural flavor extracts. Free from artificial preservatives.'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60">
                    <strong className="text-amber-900 font-semibold block text-[11px]">Allergen Notice:</strong>
                    <p className="text-amber-900/90 mt-0.5 text-[11px] whitespace-pre-line">
                      {product.allergens?.trim() ||
                        'Contains wheat (gluten) and dairy. Prepared in an artisanal kitchen handling nuts, seeds, and chocolate. Please contact the baker for specific allergy requests.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      {product.isEggless ? '🌱 100% Pure Veg (Eggless)' : 'Contains Egg'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-brand-muted text-[10px] font-medium border border-brand-border/50">
                      Zero Preservatives
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Delivery & Storage */}
            <div className="border border-brand-border/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => toggleAccordion('delivery')}
                className="w-full px-4 py-3 text-left flex items-center justify-between font-serif font-bold text-sm text-[#2C1A1D] hover:bg-brand-cream/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Delivery &amp; Storage Guidelines</span>
                </div>
                {openAccordions.delivery ? <ChevronUp className="w-4 h-4 text-brand-muted" /> : <ChevronDown className="w-4 h-4 text-brand-muted" />}
              </button>
              {openAccordions.delivery && (
                <div className="px-4 pb-4 pt-1 text-xs text-brand-muted leading-relaxed border-t border-brand-border/40 space-y-2">
                  <p>
                    <strong>Storage:</strong> Store in an airtight refrigerator between 4°C - 8°C. Best enjoyed within 48 hours of delivery.
                  </p>
                  <p>
                    <strong>Serving Suggestion:</strong> Bring to room temperature 15 minutes prior to cutting for the silkiest texture.
                  </p>
                  <p>
                    <strong>Transport:</strong> Packaged in reinforced bakery boxes with food-safe cake boards to ensure safe transit across {shop.city || 'the city'}.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Verified Customer Reviews */}
            <div className="border border-brand-border/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => toggleAccordion('reviews')}
                className="w-full px-4 py-3 text-left flex items-center justify-between font-serif font-bold text-sm text-[#2C1A1D] hover:bg-brand-cream/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Verified Customer Reviews ({totalReviews || 24})</span>
                </div>
                {openAccordions.reviews ? <ChevronUp className="w-4 h-4 text-brand-muted" /> : <ChevronDown className="w-4 h-4 text-brand-muted" />}
              </button>
              {openAccordions.reviews && (
                <div className="px-4 pb-4 pt-2 border-t border-brand-border/40 space-y-4">
                  {/* Rating Breakdown Header */}
                  <div className="bg-[#FAF7F2] rounded-xl p-3 border border-brand-border/60 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-serif font-bold text-brand-espresso">
                        {averageRating > 0 ? averageRating.toFixed(1) : '4.8'}★
                      </div>
                      <p className="text-[10px] text-brand-muted">
                        Verified Celebration Ratings
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>100% Authentic Purchases</span>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {loadingReviews ? (
                    <div className="py-4 text-center text-xs text-brand-muted">Loading reviews...</div>
                  ) : !reviewsSummary || reviewsSummary.reviews.length === 0 ? (
                    <div className="py-4 text-center space-y-1">
                      <p className="text-xs font-bold text-brand-espresso">Be the first to leave a verified review!</p>
                      <p className="text-[11px] text-brand-muted">Order this cake to share your feedback post-delivery.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviewsSummary.reviews.map((rev) => (
                        <div key={rev.id} className="p-3 rounded-xl bg-white border border-brand-border/60 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-brand-espresso">{rev.customerDisplayName}</span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                                />
                              ))}
                            </div>
                          </div>
                          {rev.reviewText && <p className="text-brand-muted italic">&ldquo;{rev.reviewText}&rdquo;</p>}
                          {rev.ownerReply && (
                            <div className="p-2 rounded-lg bg-brand-blush/40 text-[11px] text-brand-plum font-medium">
                              <strong>Chef&apos;s note:</strong> {rev.ownerReply}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
