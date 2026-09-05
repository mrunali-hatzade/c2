"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  ShoppingBag, 
  ArrowLeft, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  AlertCircle,
  Calendar,
  Clock,
  Sparkles
} from "lucide-react";
import { 
  submitGuestOrder, 
  fetchStorefrontDeliverySlots, 
  DeliverySlotItem, 
  StorefrontOrderItemPayload 
} from "@/lib/api/customerCheckout";

export default function CheckoutPage() {
  const router = useRouter();

  // Cart items
  const [shopId, setShopId] = useState<number>(4); // Default to active bakery if not specified
  const [shopName, setShopName] = useState<string>("Artisan Bakery Storefront");
  const [items, setItems] = useState<StorefrontOrderItemPayload[]>([]);
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlotItem[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE_PAYMENT'>('COD');
  const [couponCode, setCouponCode] = useState("");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    // Tomorrow as default delivery date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toISOString().split("T")[0]);

    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cake_cart");
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (parsed.shopId) setShopId(parsed.shopId);
          if (parsed.shopName) setShopName(parsed.shopName);
          if (Array.isArray(parsed.items) && parsed.items.length > 0) {
            setItems(parsed.items);
          }
        }
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }
  }, []);

  // Fetch delivery slots for the shop
  useEffect(() => {
    if (!shopId) return;
    const loadSlots = async () => {
      const slots = await fetchStorefrontDeliverySlots(shopId);
      setDeliverySlots(slots);
      if (slots.length > 0) {
        setSelectedSlotId(slots[0].id);
      }
    };
    loadSlots();
  }, [shopId]);

  // If cart is empty, provide a quick starter item so customers can easily test
  const handleAddSampleItem = () => {
    const defaultItem: StorefrontOrderItemPayload = {
      productId: 13,
      productName: "Signature Chocolate Truffle",
      unitPrice: 450,
      quantity: 1,
      dietaryPreference: "EGGLESS",
      cakeMessage: "Happy Celebration!",
    };
    setItems([defaultItem]);
  };

  const updateQuantity = (idx: number, delta: number) => {
    setItems((prev) => {
      const copy = [...prev];
      const newQty = copy[idx].quantity + delta;
      if (newQty <= 0) {
        return copy.filter((_, i) => i !== idx);
      }
      copy[idx] = { ...copy[idx], quantity: newQty };
      return copy;
    });
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (item.unitPrice || 450) * item.quantity,
    0
  );
  const deliveryCharge = items.length > 0 ? 50 : 0;
  const estimatedTotal = subtotal + deliveryCharge;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg("Your basket is empty. Please add at least one bakery item.");
      return;
    }

    if (!selectedSlotId) {
      setErrorMsg("Please select a delivery time slot.");
      return;
    }

    // Phone format sanitize
    const cleanPhone = customerPhone.startsWith("+") 
      ? customerPhone 
      : `+91${customerPhone.replace(/\D/g, "")}`;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: cleanPhone,
        paymentMethod,
        deliveryAddress: deliveryAddress.trim(),
        deliveryDate,
        deliverySlotId: selectedSlotId,
        couponCode: couponCode.trim() || undefined,
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          variantId: it.variantId,
          dietaryPreference: it.dietaryPreference,
          cakeMessage: it.cakeMessage,
          photoReferenceUrl: it.photoReferenceUrl,
          addonIds: it.addonIds,
        })),
      };

      const placed = await submitGuestOrder(shopId, payload);

      // Clear cart
      if (typeof window !== "undefined") {
        localStorage.removeItem("cake_cart");
      }

      // Navigate to order tracking page
      router.push(`/orders/${placed.orderNumber}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] font-sans flex flex-col">
      <Navbar selectedLocation="Akurdi" onSelectLocation={() => {}} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <Link
            href={shopId ? `/shop/${shopId}` : "/explore"}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#A35742] hover:text-[#5B1C2E] mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {shopName || "Bakery Storefront"}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2B1822] tracking-tight">
            Checkout & Delivery Details
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Complete your delivery contact and payment selection to place your bakery order.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Customer & Delivery Information Form */}
          <form 
            onSubmit={handleSubmitOrder} 
            className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-5 text-xs"
          >
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Truck className="w-4 h-4 text-[#A35742]" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Recipient & Delivery Address
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Full Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alice Smith"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alice@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Apartment, building name, street, landmark, city, and pincode..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742] focus:bg-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Calendar size={12} className="text-[#A35742]" />
                    <span>Delivery Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742]"
                  />
                </div>

                <div>
                  <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Clock size={12} className="text-[#A35742]" />
                    <span>Delivery Window *</span>
                  </label>
                  <select
                    value={selectedSlotId || ""}
                    onChange={(e) => setSelectedSlotId(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#A35742]"
                  >
                    {deliverySlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.slotName} ({slot.startTime} - {slot.endTime})
                      </option>
                    ))}
                    {deliverySlots.length === 0 && (
                      <option value="1">Standard Delivery Window (10:00 - 18:00)</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="pt-3 border-t border-gray-100">
                <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'border-[#3D101E] bg-[#FAF0F2] text-[#3D101E] font-bold shadow-2xs'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <span className="block text-xs font-bold">Cash on Delivery (COD)</span>
                    <span className="text-3xs opacity-80 mt-0.5 block">Pay upon cake arrival</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ONLINE_PAYMENT')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'ONLINE_PAYMENT'
                        ? 'border-[#3D101E] bg-[#FAF0F2] text-[#3D101E] font-bold shadow-2xs'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <span className="block text-xs font-bold">Online Checkout</span>
                    <span className="text-3xs opacity-80 mt-0.5 block">UPI, Cards, NetBanking</span>
                  </button>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting || items.length === 0}
                className="w-full py-3 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white font-bold text-sm shadow-soft transition-colors cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Placing Bakery Order..." : `Place Order (₹${estimatedTotal})`}
              </button>
            </div>
          </form>

          {/* Right Column: Basket Summary */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-2xs space-y-5 text-xs">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-gray-900">
                <ShoppingBag className="w-4 h-4 text-[#A35742]" />
                <h3 className="font-bold text-sm">Order Items ({items.length})</h3>
              </div>
              <span className="text-3xs text-gray-400 font-medium truncate max-w-[150px]">
                {shopName}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <ShoppingBag size={32} className="mx-auto text-gray-300" />
                <p className="text-gray-500 font-medium">Your basket is currently empty.</p>
                <button
                  onClick={handleAddSampleItem}
                  className="px-4 py-1.5 rounded-xl bg-[#FAF0F2] text-[#A35742] border border-[#A35742]/20 text-xs font-bold hover:bg-[#F4EBE3] transition-colors cursor-pointer"
                >
                  + Add Sample Creation
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-bold text-gray-900 truncate">
                        {item.productName || `Product #${item.productId}`}
                      </p>
                      {item.cakeMessage && (
                        <p className="text-3xs text-gray-400 italic truncate">
                          &ldquo;{item.cakeMessage}&rdquo;
                        </p>
                      )}
                      {item.dietaryPreference && (
                        <span className="inline-block text-3xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {item.dietaryPreference}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 text-3xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, -1)}
                          className="p-1 hover:text-gray-900 text-gray-500"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-1.5 font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, 1)}
                          className="p-1 hover:text-gray-900 text-gray-500"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <span className="font-bold text-gray-900 text-xs w-12 text-right">
                        ₹{(item.unitPrice || 450) * item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Promo Coupon */}
            <div className="pt-3 border-t border-gray-100">
              <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Bakery Promo Code
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. MINUS50 or WELCOME20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full p-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono font-bold uppercase text-gray-900 focus:outline-none focus:border-[#A35742]"
                />
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <span>Standard Delivery Fee</span>
                <span>₹{deliveryCharge}</span>
              </div>

              <div className="flex items-center justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-100">
                <span>Estimated Total</span>
                <span className="text-[#5B1C2E]">₹{estimatedTotal}</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
