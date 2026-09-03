"use client";

import React, { useState } from "react";
import { X, CheckCircle, Clock } from "lucide-react";
import { CartItem } from "./CartDrawer";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: number;
  items: CartItem[];
  onSuccess: (orderNumber: string) => void;
}

/**
 * Skeleton reference component for Phase 4 Customer Checkout.
 * Preserved for future checkout flow implementation.
 */
export function CheckoutModal({
  isOpen,
  onClose,
  shopId,
  items,
  onSuccess,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Placeholder order submission to be wired to POST /api/storefront/shops/{shopId}/orders in Phase 4
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess("ORD-" + Math.floor(100000 + Math.random() * 900000));
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-espresso/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-brand-border space-y-5">
        <div className="flex justify-between items-center border-b border-brand-border pb-4">
          <h3 className="font-serif font-bold text-xl text-brand-espresso">Order Checkout</h3>
          <button onClick={onClose} className="text-brand-muted hover:text-brand-espresso">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-brand-espresso mb-1">Full Name</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Aditi Sharma"
              className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-cream-light"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-espresso mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-cream-light"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-espresso mb-1">Email</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="aditi@example.com"
                className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-cream-light"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-espresso mb-1">Delivery Address</label>
            <textarea
              required
              rows={2}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="House/Flat No, Street, Area, City..."
              className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-cream-light resize-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-brand-cream border border-brand-border flex justify-between items-center">
            <span className="font-semibold text-brand-espresso">Total Amount Payable</span>
            <span className="text-base font-bold text-brand-plum">₹{totalAmount.toFixed(0)}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-brand-plum hover:bg-brand-plum-hover text-white font-bold transition-colors cursor-pointer"
          >
            {isSubmitting ? "Placing Order..." : "Confirm & Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
