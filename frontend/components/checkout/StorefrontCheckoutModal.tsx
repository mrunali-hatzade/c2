"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Truck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag, 
  FileText, 
  ArrowLeft, 
  Loader2,
  Phone,
  Mail,
  User,
  MapPin,
  Tag
} from "lucide-react";
import { 
  submitGuestOrder, 
  fetchStorefrontDeliverySlots, 
  DeliverySlotItem, 
  PlacedOrder 
} from "@/lib/api/customerCheckout";
import { CartItemWithMeta } from "@/lib/hooks/useStorefrontCart";
import { StorefrontShop } from "@/types/storefront";

interface StorefrontCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: StorefrontShop;
  items: CartItemWithMeta[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode: string;
  onOrderSuccess: (order: PlacedOrder) => void;
}

export function StorefrontCheckoutModal({
  isOpen,
  onClose,
  shop,
  items,
  subtotal,
  discount,
  deliveryFee,
  total,
  couponCode,
  onOrderSuccess,
}: StorefrontCheckoutModalProps) {
  // Form fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlotItem[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE_PAYMENT">("COD");

  // State
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  // Initialize delivery date to tomorrow
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDeliveryDate(tomorrow.toISOString().split("T")[0]);
      setErrorMsg(null);
      setPlacedOrder(null);
    }
  }, [isOpen]);

  // Load real delivery slots for this shop
  useEffect(() => {
    if (isOpen && shop.id) {
      setIsLoadingSlots(true);
      fetchStorefrontDeliverySlots(shop.id)
        .then((slots) => {
          setDeliverySlots(slots);
          if (slots.length > 0) {
            setSelectedSlotId(slots[0].id);
          }
        })
        .catch((err) => {
          console.error("Failed to load delivery slots", err);
        })
        .finally(() => {
          setIsLoadingSlots(false);
        });
    }
  }, [isOpen, shop.id]);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (items.length === 0) {
      setErrorMsg("Your cart is empty. Please add items from the bakery.");
      return;
    }

    if (!selectedSlotId) {
      setErrorMsg("Please choose a delivery time slot.");
      return;
    }

    // Sanitize phone
    const cleanPhone = customerPhone.startsWith("+")
      ? customerPhone
      : `+91${customerPhone.replace(/\D/g, "")}`;

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: cleanPhone,
        paymentMethod,
        deliveryAddress: deliveryAddress.trim(),
        deliveryDate,
        deliverySlotId: selectedSlotId,
        couponCode: discount > 0 ? couponCode : undefined,
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

      const order = await submitGuestOrder(shop.id, payload);
      setPlacedOrder(order);
      onOrderSuccess(order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to complete order. Please try again.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-espresso/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-brand-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-border/70 bg-[#FCFAF7] rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-cream border border-brand-border flex items-center justify-center text-lg text-brand-plum">
              🧁
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-espresso">
                {placedOrder ? "Order Confirmed!" : `Checkout — ${shop.businessName}`}
              </h3>
              <p className="text-xs text-brand-muted">
                {placedOrder ? "Thank you for supporting our local bakery" : "Complete your order directly with our kitchen"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-brand-muted hover:bg-brand-cream hover:text-brand-espresso transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {placedOrder ? (
            /* ── Order Success & Confirmation Screen (Keeps user in shop) ── */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-bold text-brand-espresso">
                  Order Successfully Placed!
                </h2>
                <p className="text-xs text-brand-muted max-w-md mx-auto">
                  Your order has been sent directly to <strong className="text-brand-espresso">{shop.businessName}</strong>. 
                  The kitchen will prepare your cake fresh for delivery.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="p-5 rounded-2xl bg-brand-cream border border-brand-border text-left space-y-3 max-w-md mx-auto">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-brand-muted font-medium">Order Reference:</span>
                  <span className="font-mono font-bold text-brand-plum text-sm">{placedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-brand-muted font-medium">Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-3xs">
                    {placedOrder.orderStatus || "CONFIRMED"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-brand-muted font-medium">Delivery Date:</span>
                  <span className="font-bold text-brand-espresso">{placedOrder.deliveryDate}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-brand-muted font-medium">Total Amount:</span>
                  <span className="font-bold text-brand-espresso text-sm">₹{Number(placedOrder.totalAmount).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Direct Actions inside Shop */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href={`/api/storefront/shops/orders/${placedOrder.orderNumber}/invoice`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-brand-border text-brand-espresso text-xs font-bold hover:bg-brand-cream transition-colors shadow-xs"
                >
                  <FileText className="w-4 h-4 text-brand-plum" />
                  <span>Download PDF Invoice</span>
                </a>

                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-plum text-white text-xs font-bold hover:bg-brand-plum-hover transition-colors shadow-sm cursor-pointer"
                >
                  <span>Continue Browsing {shop.businessName}</span>
                </button>
              </div>

              <div className="pt-4 text-3xs text-brand-muted">
                Want to discover other local bakeries?{" "}
                <a href="/explore" className="text-brand-plum hover:underline font-bold">
                  Browse Marketplace
                </a>
              </div>
            </div>
          ) : (
            /* ── In-Store Checkout Form ── */
            <form onSubmit={handleSubmitOrder} className="space-y-6 text-xs">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Items Summary Banner */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-brand-border/70 flex items-center justify-between">
                <div>
                  <span className="text-3xs font-bold uppercase tracking-wider text-brand-plum block">
                    Your Selection
                  </span>
                  <span className="font-bold text-brand-espresso text-xs">
                    {items.length} {items.length === 1 ? "cake" : "cakes"} from {shop.businessName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-3xs text-brand-muted block">Total Payable</span>
                  <span className="font-extrabold text-brand-espresso text-sm">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-espresso flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-brand-plum" />
                  <span>Recipient Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold text-brand-espresso mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Alice Smith"
                      className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-espresso focus:outline-none focus:border-brand-plum/60"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-brand-espresso mb-1">
                      WhatsApp Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-espresso focus:outline-none focus:border-brand-plum/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-brand-espresso mb-1">
                    Email Address (for invoice & tracking) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="alice@example.com"
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-espresso focus:outline-none focus:border-brand-plum/60"
                  />
                </div>
              </div>

              {/* Delivery Address & Schedule */}
              <div className="space-y-3 pt-3 border-t border-brand-border/60">
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-espresso flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-brand-plum" />
                  <span>Delivery Address & Slot</span>
                </h4>

                <div>
                  <label className="block text-2xs font-bold text-brand-espresso mb-1">
                    Delivery Address in {shop.city || "Pune"} *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Flat / Building number, Street name, Landmark, Pincode"
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-espresso focus:outline-none focus:border-brand-plum/60 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold text-brand-espresso mb-1">
                      Delivery Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-espresso focus:outline-none focus:border-brand-plum/60"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-brand-espresso mb-1">
                      Delivery Slot *
                    </label>
                    {isLoadingSlots ? (
                      <div className="p-2.5 text-xs text-brand-muted">Loading available slots...</div>
                    ) : (
                      <select
                        value={selectedSlotId || ""}
                        onChange={(e) => setSelectedSlotId(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-espresso font-medium focus:outline-none focus:border-brand-plum/60"
                      >
                        {deliverySlots.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {slot.slotName} ({slot.startTime} - {slot.endTime})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2 pt-3 border-t border-brand-border/60">
                <label className="block text-2xs font-bold text-brand-espresso mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "COD" 
                      ? "border-brand-plum bg-brand-plum-light text-brand-plum font-bold" 
                      : "border-brand-border bg-white text-brand-espresso"
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="text-brand-plum"
                    />
                    <span>Cash on Delivery</span>
                  </label>

                  <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "ONLINE_PAYMENT" 
                      ? "border-brand-plum bg-brand-plum-light text-brand-plum font-bold" 
                      : "border-brand-border bg-white text-brand-espresso"
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "ONLINE_PAYMENT"}
                      onChange={() => setPaymentMethod("ONLINE_PAYMENT")}
                      className="text-brand-plum"
                    />
                    <span>Online UPI / Card</span>
                  </label>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-4 border-t border-brand-border/60">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#C17A63] hover:bg-[#B06B55] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Order to Kitchen...</span>
                    </>
                  ) : (
                    <span>Confirm & Place Order — ₹{total.toLocaleString("en-IN")}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
