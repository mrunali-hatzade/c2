"use client";
import React from "react";
import { CreditCard, CheckCircle2, ShieldCheck, Landmark } from "lucide-react";

export const OwnerSubscriptionTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Subscription & Payouts</h2>
        <p className="text-xs text-slate-500 font-medium">Manage your SaaS plan subscription and bank payout details</p>
      </div>

      {/* Active Subscription Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" /> Pro Bakery Plan (Active)
          </div>
          <span className="text-xs font-bold bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            24 DAYS REMAINING
          </span>
        </div>

        <div>
          <div className="text-3xl font-black">₹699 <span className="text-sm font-normal opacity-80">/ month</span></div>
          <p className="text-xs opacity-90 mt-1">Renews automatically on September 24, 2026</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/20 text-xs">
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-300" /> Unlimited Cakes</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-300" /> WhatsApp Orders</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-300" /> Custom Storefront</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-300" /> 0% Commission</div>
        </div>
      </div>

      {/* Bank Payout Details Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Bank Payout Settlement Account</h3>
            <p className="text-xs text-slate-500 font-medium">Where online customer payments are deposited</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-500 mb-1">Beneficiary Account Name</label>
            <input type="text" defaultValue="Sweet Delights Bakery Pvt Ltd" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">Bank Account Number</label>
            <input type="text" defaultValue="•••• •••• 9845" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">IFSC Code</label>
            <input type="text" defaultValue="HDFC0001234" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">UPI VPA Handle</label>
            <input type="text" defaultValue="sweetdelights@upi" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" />
          </div>
        </div>

        <button
          onClick={() => alert("Bank payout details updated!")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          Save Payout Details
        </button>
      </div>
    </div>
  );
};
