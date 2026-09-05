"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product, StorefrontShop } from "@/types/storefront";
import { submitProductEnquiry } from "@/lib/api/storefront";
import {
  X,
  Cake,
  Calendar,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageCircle,
  Plus,
  Minus,
  Send,
  Loader2,
} from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  shop: StorefrontShop;
  onAddToCart?: (customItem: any) => void;
}

export function ProductDetailModal({
  isOpen,
  onClose,
  product,
  shop,
  onAddToCart,
}: ProductDetailModalProps) {
  // Mode: "detail" | "enquiry" | "success"
  const [viewMode, setViewMode] = useState<"detail" | "enquiry" | "success">("detail");

  // Form inputs
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [backendError, setBackendError] = useState<string | null>(null);
  const [createdEnquiryId, setCreatedEnquiryId] = useState<number | null>(null);

  // Reset form when modal opens with a new product
  useEffect(() => {
    if (isOpen) {
      setViewMode("detail");
      setQuantity(1);
      setPreferredDate("");
      setMessage("");
      setFormErrors({});
      setBackendError(null);
      setCreatedEnquiryId(null);
    }
  }, [isOpen, product?.id]);

  if (!isOpen || !product) return null;

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!customerName.trim()) {
      errors.customerName = "Your name is required";
    }
    if (!customerPhone.trim()) {
      errors.customerPhone = "Phone number is required";
    } else if (customerPhone.trim().length < 8) {
      errors.customerPhone = "Please enter a valid phone number";
    }
    if (!customerEmail.trim()) {
      errors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      errors.customerEmail = "Please enter a valid email address";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setBackendError(null);

    const res = await submitProductEnquiry({
      shopId: shop.id,
      productId: product.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      quantity,
      preferredDate: preferredDate || undefined,
      message: message.trim() || undefined,
    });

    setIsSubmitting(false);

    if (res.success && res.enquiryId) {
      setCreatedEnquiryId(res.enquiryId);
      setViewMode("success");
    } else {
      setBackendError(res.error || "Failed to submit enquiry. Please try again.");
    }
  };

  const basePrice = Number(product.price) || 0;
  const estimatedTotal = basePrice * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-brand-espresso/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-brand-border/80 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-brand-border/60 text-brand-espresso hover:text-brand-plum hover:bg-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ─── 1. SUCCESS VIEW ─── */}
        {viewMode === "success" ? (
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Enquiry #{createdEnquiryId} Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-brand-espresso">
                Enquiry Sent to Baker!
              </h2>
              <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-brand-espresso">{customerName}</span>. Your enquiry for{" "}
                <span className="font-semibold text-brand-espresso">&quot;{product.name}&quot;</span> has been received by{" "}
                <span className="font-semibold text-brand-plum">{shop.businessName}</span>.
              </p>
            </div>

            {/* Summary Details */}
            <div className="bg-brand-cream-light rounded-2xl p-5 border border-brand-border/80 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-brand-muted">
                <span>Product</span>
                <span className="font-semibold text-brand-espresso">{product.name}</span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>Quantity</span>
                <span className="font-semibold text-brand-espresso">{quantity} unit(s)</span>
              </div>
              {preferredDate && (
                <div className="flex justify-between text-brand-muted">
                  <span>Preferred Date</span>
                  <span className="font-semibold text-brand-espresso">{preferredDate}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-muted border-t border-brand-border/60 pt-2">
                <span>Estimated Price</span>
                <span className="font-bold text-brand-espresso">₹{estimatedTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Direct WhatsApp / Phone follow-up */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {shop.phone && (
                <a
                  href={`https://wa.me/91${shop.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hi ${shop.businessName}, I submitted an enquiry (#${createdEnquiryId}) for "${product.name}" on CakeStore.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              )}

              <button
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-cream hover:bg-brand-cream-dark border border-brand-border text-brand-espresso text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Bakery
              </button>
            </div>
          </div>
        ) : viewMode === "enquiry" ? (
          /* ─── 2. ENQUIRY FORM VIEW ─── */
          <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            {/* Header snippet */}
            <div className="border-b border-brand-border/80 pb-4">
              <button
                onClick={() => setViewMode("detail")}
                className="text-xs font-semibold text-brand-muted hover:text-brand-plum transition-colors mb-2 inline-block cursor-pointer"
              >
                ← Back to Product Details
              </button>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-brand-espresso">
                Enquire About Cake
              </h2>
              <p className="text-xs text-brand-muted mt-1">
                Submitting enquiry to <span className="font-semibold text-brand-plum">{shop.businessName}</span> for{" "}
                <span className="font-semibold text-brand-espresso">{product.name}</span>
              </p>
            </div>

            {/* Backend error alert */}
            {backendError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{backendError}</span>
              </div>
            )}

            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-espresso mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Aditi Sharma"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-brand-plum/20 transition-all ${
                        formErrors.customerName ? "border-rose-400 bg-rose-50/20" : "border-brand-border bg-white"
                      }`}
                    />
                  </div>
                  {formErrors.customerName && (
                    <p className="text-3xs text-rose-600 mt-1">{formErrors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-espresso mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-brand-plum/20 transition-all ${
                        formErrors.customerPhone ? "border-rose-400 bg-rose-50/20" : "border-brand-border bg-white"
                      }`}
                    />
                  </div>
                  {formErrors.customerPhone && (
                    <p className="text-3xs text-rose-600 mt-1">{formErrors.customerPhone}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-brand-espresso mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. aditi@example.com"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-brand-plum/20 transition-all ${
                      formErrors.customerEmail ? "border-rose-400 bg-rose-50/20" : "border-brand-border bg-white"
                    }`}
                  />
                </div>
                {formErrors.customerEmail && (
                  <p className="text-3xs text-rose-600 mt-1">{formErrors.customerEmail}</p>
                )}
              </div>

              {/* Quantity & Preferred Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-espresso mb-1">
                    Quantity / Servings
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-brand-border rounded-xl bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-brand-muted hover:text-brand-espresso hover:bg-brand-cream transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 py-1 text-xs font-bold text-brand-espresso">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 text-brand-muted hover:text-brand-espresso hover:bg-brand-cream transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-2xs font-semibold text-brand-muted">
                      Est. ₹{estimatedTotal.toFixed(0)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-espresso mb-1">
                    Preferred Date (Optional)
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-plum/20 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Message / Customization notes */}
              <div>
                <label className="block text-xs font-bold text-brand-espresso mb-1">
                  Customization & Special Requests
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Message on cake, eggless request, color theme, flavor modifications..."
                    className="w-full p-3 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-plum/20 bg-white leading-relaxed resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-brand-plum hover:bg-brand-plum-hover text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Enquiry to {shop.businessName}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ─── 3. PRODUCT DETAIL VIEW ─── */
          <div className="flex flex-col md:flex-row max-h-[85vh] overflow-y-auto">
            {/* Image Section */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[280px] bg-brand-cream-dark">
              <Image
                src={product.imageUrl || FALLBACK_IMAGE}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.category && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-2xs font-bold text-brand-plum border border-brand-border/60 shadow-2xs">
                  {product.category}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Bakery & Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-3xs font-bold uppercase tracking-wider text-brand-plum bg-brand-blush/60 px-2.5 py-0.5 rounded-md">
                    {shop.businessName}
                  </span>
                  <span className="text-3xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {product.availability ? "Freshly Available" : "Made to Order"}
                  </span>
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold font-serif text-brand-espresso leading-snug">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-brand-espresso">
                    ₹{basePrice.toFixed(0)}
                  </span>
                  <span className="text-2xs font-medium text-brand-muted">Base Price</span>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Real Variants (if present) */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-brand-border/60">
                    <span className="text-3xs font-bold uppercase tracking-wider text-brand-muted block">
                      Available Sizes & Variants
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <div
                          key={v.id}
                          className="px-3 py-1.5 rounded-xl bg-brand-cream text-2xs font-semibold text-brand-espresso border border-brand-border"
                        >
                          {v.name} (+₹{Number(v.price).toFixed(0)})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real Addons (if present) */}
                {product.addons && product.addons.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-brand-border/60">
                    <span className="text-3xs font-bold uppercase tracking-wider text-brand-muted block">
                      Optional Addons
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.addons.map((a) => (
                        <div
                          key={a.id}
                          className="px-3 py-1.5 rounded-xl bg-brand-cream text-2xs font-semibold text-brand-espresso border border-brand-border"
                        >
                          {a.name} (+₹{Number(a.price).toFixed(0)})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-brand-border/60">
                {onAddToCart && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart({
                        productId: product.id,
                        productName: product.name,
                        unitPrice: basePrice,
                        quantity: 1,
                        imageUrl: product.imageUrl,
                        dietaryPreference: "EGGLESS",
                        cakeMessage: "Happy Birthday!",
                      });
                      onClose();
                    }}
                    className="w-full py-3.5 rounded-full bg-[#C17A63] hover:bg-[#B06B55] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-98"
                  >
                    <span>Add to Cart — ₹{basePrice.toFixed(0)}</span>
                  </button>
                )}

                <button
                  onClick={() => setViewMode("enquiry")}
                  className="w-full py-3 rounded-full bg-brand-cream border border-brand-border text-brand-espresso hover:bg-brand-cream-dark text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-brand-plum" />
                  <span>Enquire / Custom Request</span>
                </button>

                {shop.phone && (
                  <div className="flex items-center justify-center gap-4 text-3xs font-semibold text-brand-muted">
                    <span>Or direct inquiries:</span>
                    <a
                      href={`tel:${shop.phone}`}
                      className="text-brand-plum hover:underline font-bold"
                    >
                      Call Baker
                    </a>
                    <span>•</span>
                    <a
                      href={`https://wa.me/91${shop.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-bold"
                    >
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
