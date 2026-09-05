"use client";
import React, { useState } from "react";
import { Plus, Percent, Copy, Check } from "lucide-react";

interface Coupon {
  id: number;
  code: string;
  type: "PERCENTAGE" | "FLAT";
  value: number;
  minOrder: number;
  usedCount: number;
  active: boolean;
}

const INITIAL_COUPONS: Coupon[] = [
  { id: 1, code: "CAKE10", type: "PERCENTAGE", value: 10, minOrder: 300, usedCount: 42, active: true },
  { id: 2, code: "FIRST15", type: "PERCENTAGE", value: 15, minOrder: 500, usedCount: 89, active: true },
  { id: 3, code: "WEEKEND", type: "FLAT", value: 100, minOrder: 800, usedCount: 15, active: true },
  { id: 4, code: "BDAY30", type: "PERCENTAGE", value: 30, minOrder: 1000, usedCount: 28, active: false },
];

export const OwnerCouponsTab: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const toggleCoupon = (id: number) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Coupons & Discounts</h2>
          <p className="text-xs text-slate-500 font-medium">Create and track promo codes for your bakery storefront</p>
        </div>
        <button
          onClick={() => alert("Coupon creation modal placeholder")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {coupons.map((c) => (
          <div
            key={c.id}
            className={`bg-white rounded-2xl p-5 border shadow-sm space-y-3 transition-all ${
              c.active ? "border-slate-200" : "border-slate-200 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-mono font-bold text-xs rounded-lg border border-blue-100 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5" /> {c.code}
              </span>
              <button
                onClick={() => copyToClipboard(c.code)}
                className="text-slate-400 hover:text-blue-600 p-1"
                title="Copy code"
              >
                {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div>
              <div className="text-lg font-black text-slate-900">
                {c.type === "PERCENTAGE" ? `${c.value}% OFF` : `₹${c.value} OFF`}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                Min. order ₹{c.minOrder}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-semibold">{c.usedCount} times used</span>
              <button
                onClick={() => toggleCoupon(c.id)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  c.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {c.active ? "ACTIVE" : "PAUSED"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
