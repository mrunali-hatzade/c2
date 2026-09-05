"use client";
import React from "react";
import { Store, Phone, Mail, MapPin, Clock } from "lucide-react";

export const OwnerSettingsTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Shop Settings</h2>
        <p className="text-xs text-slate-500 font-medium">Update your business information, operating hours, and location</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5 text-xs font-semibold text-slate-700">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center text-xl">
            🧁
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Store Profile</h3>
            <p className="text-xs text-slate-500 font-medium">Displayed to customers on your storefront</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 mb-1">Business / Brand Name</label>
            <input type="text" defaultValue="Sweet Delights Bakery" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">FSSAI License Registration</label>
            <input type="text" defaultValue="11223344556677" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">Contact Phone</label>
            <input type="text" defaultValue="+91 84469 80001" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">Business Email</label>
            <input type="email" defaultValue="namaste@cakebasket.in" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-slate-500 mb-1">Address / Location</label>
          <input type="text" defaultValue="Shop No. 12, Main Market, Akurdi, Pune - 411035" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500" />
        </div>

        <div className="pt-2">
          <button
            onClick={() => alert("Shop settings updated!")}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
