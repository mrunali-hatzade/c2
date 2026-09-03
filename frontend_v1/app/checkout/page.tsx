"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, CreditCard, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const [isOrdered, setIsOrdered] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "Pune",
    deliveryDate: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
  };

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans flex flex-col">
      <Navbar selectedLocation="Akurdi" onSelectLocation={() => {}} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-plum hover:text-brand-plum-hover mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-brand-espresso tracking-tight">
            Checkout & Order Confirmation
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Complete your delivery details to place your custom bakery order.
          </p>
        </div>

        {isOrdered ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-border text-center shadow-card animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-brand-espresso mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-brand-muted max-w-md mx-auto text-sm mb-6">
              Thank you for ordering with CakeStore. The bakery has received your order request and will begin preparation shortly.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-plum text-white text-sm font-bold shadow-soft hover:bg-brand-plum-hover transition-colors"
            >
              Continue Browsing Bakeries
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Delivery Form */}
            <form onSubmit={handleSubmit} className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-soft space-y-5">
              <h2 className="text-lg font-bold text-brand-espresso flex items-center gap-2 border-b border-brand-border/60 pb-3">
                <Truck className="w-5 h-5 text-brand-plum" />
                Delivery Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-brand-cream border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-espresso focus:outline-none focus:border-brand-plum"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-brand-cream border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-espresso focus:outline-none focus:border-brand-plum"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">Delivery Address</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Flat/House No, Building, Street, Landmark, Area"
                    className="w-full bg-brand-cream border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-espresso focus:outline-none focus:border-brand-plum resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-brand-cream border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-espresso focus:outline-none focus:border-brand-plum"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">Delivery Date</label>
                    <input
                      type="date"
                      required
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      className="w-full bg-brand-cream border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-espresso focus:outline-none focus:border-brand-plum"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">Cake Custom Message / Notes</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Happy 25th Birthday Rhea! (Eggless preferred)"
                    className="w-full bg-brand-cream border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-espresso focus:outline-none focus:border-brand-plum"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 rounded-2xl bg-brand-plum hover:bg-brand-plum-hover text-white text-sm font-bold shadow-soft transition-all active:scale-95"
              >
                Confirm & Place Order
              </button>
            </form>

            {/* Order Summary */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-soft">
                <h2 className="text-lg font-bold text-brand-espresso flex items-center gap-2 border-b border-brand-border/60 pb-3 mb-4">
                  <ShoppingBag className="w-5 h-5 text-brand-plum" />
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-brand-muted">
                    <span>Selected Items</span>
                    <span className="font-semibold text-brand-espresso">Freshly Baked Cakes</span>
                  </div>
                  <div className="flex items-center justify-between text-brand-muted">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-emerald-600">FREE Standard Delivery</span>
                  </div>
                  <div className="flex items-center justify-between text-brand-muted">
                    <span>Payment Method</span>
                    <span className="font-semibold text-brand-espresso flex items-center gap-1">
                      <CreditCard className="w-4 h-4 text-brand-plum" />
                      Pay on Delivery / UPI
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center justify-between">
                  <span className="text-base font-bold text-brand-espresso">Total</span>
                  <span className="text-xl font-extrabold text-brand-plum">Calculated at shop</span>
                </div>
              </div>

              <div className="bg-brand-cream rounded-2xl p-4 border border-brand-border/80 flex items-start gap-3 text-xs text-brand-muted">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  100% Safe & Hygienic. All bakeries on CakeStore follow strict quality and fresh baking standards.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
