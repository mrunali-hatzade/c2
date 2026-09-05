"use client";

import React, { useEffect, useState } from 'react';
import { 
  Store, 
  CreditCard, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck 
} from 'lucide-react';
import { 
  getMyShopProfile, 
  updateMyShopProfile, 
  getShopPayoutDetails, 
  updateShopPayoutDetails, 
  ShopProfile, 
  ShopPayoutDetails 
} from '@/lib/api/shopSettings';

export default function OwnerSettingsPage() {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'PAYOUT'>('PROFILE');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Shop Profile state
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Payout Details state
  const [payout, setPayout] = useState<ShopPayoutDetails | null>(null);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');

  const fetchData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setErrorMsg(null);

    try {
      const [shopData, payoutData] = await Promise.all([
        getMyShopProfile(),
        getShopPayoutDetails(),
      ]);

      if (shopData) {
        setProfile(shopData);
        setBusinessName(shopData.businessName || '');
        setDescription(shopData.description || '');
        setPhone(shopData.phone || '');
        setAddressLine1(shopData.addressLine1 || shopData.address || '');
        setAddressLine2(shopData.addressLine2 || '');
        setCity(shopData.city || '');
        setState(shopData.state || '');
        setPincode(shopData.pincode || '');
      }

      if (payoutData) {
        setPayout(payoutData);
        setBeneficiaryName(payoutData.beneficiaryName || '');
        setBankAccountNumber(payoutData.bankAccountNumber || '');
        setIfscCode(payoutData.ifscCode || '');
        setUpiId(payoutData.upiId || '');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load settings';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updated = await updateMyShopProfile({
        businessName,
        description,
        phone,
        address: `${addressLine1} ${addressLine2}`.trim(),
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
      });
      setProfile(updated);
      setSuccessMsg('Bakery profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update bakery profile';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updated = await updateShopPayoutDetails({
        beneficiaryName,
        bankAccountNumber,
        ifscCode,
        upiId,
      });
      setPayout(updated);
      setSuccessMsg('Banking & payout details updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save payout configuration';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">

      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Bakery Settings
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Manage your legal bakery identity, contact information, and bank settlements.
          </p>
        </div>

        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#A35742]' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200/80 pb-2">
        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'PROFILE'
              ? 'bg-[#3D101E] text-white shadow-2xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
          }`}
        >
          <Store size={14} />
          <span>Bakery Profile & Location</span>
        </button>

        <button
          onClick={() => setActiveTab('PAYOUT')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'PAYOUT'
              ? 'bg-[#3D101E] text-white shadow-2xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
          }`}
        >
          <CreditCard size={14} />
          <span>Settlements & Payouts</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 py-24 flex flex-col items-center justify-center space-y-3 shadow-2xs">
          <div className="w-8 h-8 border-3 border-[#C56E56] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loading bakery configuration...</p>
        </div>
      ) : activeTab === 'PROFILE' ? (
        /* Bakery Profile Form */
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-2xs space-y-6 text-xs">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Brand & Operating Location</h3>
              <p className="text-3xs text-gray-400 mt-0.5">Visible to customers on marketplace and receipt vouchers</p>
            </div>
            {profile?.fssaiRegistration && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-3xs">
                <ShieldCheck size={13} />
                <span>FSSAI: {profile.fssaiRegistration}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Bakery Brand Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#A35742] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Direct Contact Phone *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Bakery Tagline & Bio
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about your culinary heritage, artisan specialties, and baking passion..."
              className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742] focus:bg-white transition-all"
            ></textarea>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} className="text-[#A35742]" />
              <span>Physical Kitchen / Shop Address</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Address Line 1</label>
                <input
                  type="text"
                  placeholder="e.g. Shop 12, High Street"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742]"
                />
              </div>

              <div>
                <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Address Line 2 / Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Near Central Park"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742]"
                />
              </div>

              <div>
                <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742]"
                />
              </div>

              <div>
                <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Postal / Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Bakery Profile'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Payouts Form */
        <form onSubmit={handleSavePayout} className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-2xs space-y-6 text-xs">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Settlement Account Configuration</h3>
              <p className="text-3xs text-gray-400 mt-0.5">Where automated payments from customer orders are deposited</p>
            </div>
            {payout?.razorpayAccountId && (
              <span className="font-mono text-3xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-200">
                Settlement ID: {payout.razorpayAccountId}
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-800 text-3xs leading-relaxed">
            Bank details are encrypted and utilized solely for automated direct transfers through our verified gateway partner.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Beneficiary Name (as per Bank) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe Bakeries"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#A35742]"
              />
            </div>

            <div>
              <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Bank Account Number *
              </label>
              <input
                type="password"
                required
                placeholder="Account number"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#A35742]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Bank IFSC Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. HDFC0001234"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono font-bold text-gray-900 uppercase focus:outline-none focus:border-[#A35742]"
              />
            </div>

            <div>
              <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Settlement UPI ID (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. bakery@okaxis"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Bank Details'}</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
