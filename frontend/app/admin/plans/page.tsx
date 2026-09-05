"use client";

import React, { useEffect, useState } from 'react';
import { 
  CreditCard, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { getAdminPlans, togglePlanStatus, AdminPlan } from '@/lib/api/admin';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await getAdminPlans();
      setPlans(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load plans';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleToggleStatus = async (plan: AdminPlan) => {
    try {
      const updated = await togglePlanStatus(plan.id, !plan.isActive);
      setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err: unknown) {
      alert('Failed to update plan status.');
    }
  };

  return (
    <div className="space-y-6">

      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            SaaS Subscription Plans
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Configure merchant platform fees, billing cycle durations, and feature allocations.
          </p>
        </div>

        <button
          onClick={() => fetchPlans(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-indigo-600' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 py-24 flex flex-col items-center justify-center space-y-3 shadow-2xs">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loading subscription packages...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3 shadow-2xs">
          <AlertCircle size={32} className="mx-auto text-rose-500" />
          <p className="text-sm font-bold text-slate-900">Failed to load plans</p>
          <p className="text-xs text-slate-500">{error}</p>
          <button
            onClick={() => fetchPlans()}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 py-20 text-center space-y-3 px-4 shadow-2xs">
          <CreditCard size={36} className="mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No subscription plans found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Configure plans via backend or database seeds.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-3xs font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                    plan.isActive 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {plan.isActive ? 'Active Plan' : 'Inactive'}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(plan)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    {plan.isActive ? (
                      <ToggleRight size={24} className="text-emerald-600" />
                    ) : (
                      <ToggleLeft size={24} className="text-slate-400" />
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{plan.description || 'Standard bakery package'}</p>
                </div>

                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-3xl font-bold text-slate-900">₹{plan.price}</span>
                  <span className="text-xs text-slate-400 font-semibold">/ {plan.durationDays} days</span>
                </div>

                {plan.features && (
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                    <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Included Capabilities
                    </span>
                    <p className="leading-relaxed whitespace-pre-line">{plan.features}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 text-3xs text-slate-400 flex items-center justify-between">
                <span>Plan ID #{plan.id}</span>
                <span>Currency: {plan.currency}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
