"use client";

import React, { useEffect, useState } from 'react';
import { 
  Percent, 
  Tag, 
  Plus, 
  RefreshCw, 
  Copy, 
  Check, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Clock
} from 'lucide-react';
import { 
  getOwnerCoupons, 
  createOwnerCoupon, 
  CouponRecord, 
  CreateCouponPayload, 
  DiscountType 
} from '@/lib/api/coupons';

export default function OwnerCouponsPage() {
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Copy code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number | ''>('');
  const [minOrderValue, setMinOrderValue] = useState<number | ''>('');
  const [maxDiscountCap, setMaxDiscountCap] = useState<number | ''>('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState<number | ''>('');
  const [isActive, setIsActive] = useState(true);

  const fetchCoupons = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await getOwnerCoupons();
      setCoupons(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load coupons';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const copyToClipboard = (couponCode: string) => {
    navigator.clipboard?.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenModal = () => {
    setCode('');
    setDiscountType('PERCENTAGE');
    setDiscountValue('');
    setMinOrderValue('');
    setMaxDiscountCap('');
    setExpiryDate('');
    setUsageLimit('');
    setIsActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setFormError('Coupon code is required.');
      return;
    }
    if (!discountValue || Number(discountValue) <= 0) {
      setFormError('Valid discount value is required.');
      return;
    }
    if (discountType === 'PERCENTAGE' && Number(discountValue) > 100) {
      setFormError('Percentage discount cannot exceed 100%.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const payload: CreateCouponPayload = {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
        maxDiscountCap: maxDiscountCap ? Number(maxDiscountCap) : undefined,
        expiryDate: expiryDate ? `${expiryDate}T23:59:59` : undefined,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
        isActive,
      };

      const newCoupon = await createOwnerCoupon(payload);
      setCoupons((prev) => [newCoupon, ...prev]);
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create coupon code. Ensure code is unique.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // KPIs
  const totalCouponsCount = coupons.length;
  const activeCouponsCount = coupons.filter(c => c.isActive).length;
  const totalRedemptionsCount = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'No expiry';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">

      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Coupons & Discounts
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Create promo codes and discount vouchers for your bakery storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchCoupons(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#A35742]' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleOpenModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* 2. Three Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Coupons</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Tag size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalCouponsCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Created discount codes</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Discounts</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{activeCouponsCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Currently claimable at checkout</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Redemptions</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Percent size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalRedemptionsCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Applied on customer orders</p>
          </div>
        </div>

      </div>

      {/* 3. Coupons Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 py-24 flex flex-col items-center justify-center space-y-3 shadow-2xs">
          <div className="w-8 h-8 border-3 border-[#C56E56] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loading bakery coupons...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center space-y-3 shadow-2xs">
          <AlertCircle size={32} className="mx-auto text-rose-500" />
          <p className="text-sm font-bold text-gray-900">Failed to load coupons</p>
          <p className="text-xs text-gray-500">{error}</p>
          <button
            onClick={() => fetchCoupons()}
            className="px-4 py-2 rounded-xl bg-[#3D101E] text-white text-xs font-bold hover:bg-[#5B1C2E] transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 py-20 text-center space-y-3 px-4 shadow-2xs">
          <Tag size={36} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-800">No coupons created yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Offer special celebration discounts, flat cashbacks, or percentage promos to boost order volume.
          </p>
          <button
            onClick={handleOpenModal}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus size={14} /> Create First Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map((c) => {
            const isExpired = c.expiryDate && new Date(c.expiryDate).getTime() < Date.now();
            const discountLabel = c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`;

            return (
              <div 
                key={c.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs space-y-4 hover:border-gray-300 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Card Top: Code & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm bg-gray-100 text-gray-900 px-2.5 py-1 rounded-lg border border-gray-200 tracking-wider">
                        {c.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(c.code)}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Copy coupon code"
                      >
                        {copiedCode === c.code ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>

                    <span className={`text-3xs font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${
                      !c.isActive || isExpired
                        ? 'bg-gray-100 text-gray-500 border-gray-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {!c.isActive ? 'INACTIVE' : isExpired ? 'EXPIRED' : 'ACTIVE'}
                    </span>
                  </div>

                  {/* Big Discount Banner */}
                  <div className="p-3.5 rounded-xl bg-[#FAF0F2] border border-[#A35742]/20 flex items-center justify-between">
                    <div>
                      <span className="text-3xs uppercase font-bold text-[#A35742] tracking-wider block">Discount Offer</span>
                      <p className="text-xl font-bold text-[#5B1C2E] mt-0.5">{discountLabel}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white text-[#A35742] border border-[#A35742]/20 flex items-center justify-center font-bold">
                      {c.discountType === 'PERCENTAGE' ? <Percent size={18} /> : <Tag size={18} />}
                    </div>
                  </div>

                  {/* Conditions List */}
                  <div className="space-y-1 text-3xs text-gray-600 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Min. Order:</span>
                      <span className="font-bold text-gray-800">{c.minOrderValue ? `₹${c.minOrderValue}` : 'None'}</span>
                    </div>

                    {c.maxDiscountCap && c.discountType === 'PERCENTAGE' && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Max Discount Cap:</span>
                        <span className="font-bold text-gray-800">₹{c.maxDiscountCap}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Redemptions:</span>
                      <span className="font-bold text-gray-800">
                        {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit} max` : 'used (Unlimited)'}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Card Footer: Expiry */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-3xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-[#A35742]" />
                    <span>Expires: {formatDate(c.expiryDate)}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-5 relative my-8">
            
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-900">Create New Coupon</h3>
                <p className="text-3xs text-gray-400">Configure discount rules for your storefront customers</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              
              {/* Code */}
              <div>
                <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20 or BDAY100"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 font-mono font-bold text-xs text-gray-900 uppercase placeholder:text-gray-400 focus:outline-none focus:border-[#A35742] focus:bg-white transition-all"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#A35742]"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Cash (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    {discountType === 'PERCENTAGE' ? 'Discount Percentage (%) *' : 'Discount Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={discountType === 'PERCENTAGE' ? 100 : 50000}
                    placeholder={discountType === 'PERCENTAGE' ? "e.g. 15" : "e.g. 150"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#A35742] focus:bg-white"
                  />
                </div>
              </div>

              {/* Min Order & Max Cap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Min. Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500 (optional)"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742]"
                  />
                </div>

                <div>
                  <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Max. Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder={discountType === 'PERCENTAGE' ? "e.g. 100 (optional)" : "Not applicable"}
                    disabled={discountType === 'FLAT'}
                    value={maxDiscountCap}
                    onChange={(e) => setMaxDiscountCap(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742] disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Expiry Date & Usage Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742]"
                  />
                </div>

                <div>
                  <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 100 uses (optional)"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#A35742]"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#A35742] focus:ring-[#A35742]"
                />
                <label htmlFor="couponActive" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Activate coupon immediately for storefront checkout
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Sparkles size={13} />
                  <span>{submitting ? 'Creating...' : 'Publish Coupon'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
