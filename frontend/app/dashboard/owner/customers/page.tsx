"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  RefreshCw, 
  Mail, 
  Phone, 
  ShoppingBag, 
  DollarSign, 
  Calendar, 
  MapPin, 
  ExternalLink,
  MessageCircle, 
  ChevronRight, 
  X,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { getOwnerCustomers, CustomerProfile, CustomerOrderSummary } from '@/lib/api/customers';

export default function OwnerCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Selected customer for modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const fetchCustomers = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await getOwnerCustomers();
      setCustomers(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load customers';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter((c) =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.mobile && c.mobile.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  // Derived metrics
  const totalCustomersCount = customers.length;
  const repeatCustomersCount = customers.filter(c => c.totalOrders > 1).length;
  const totalOrdersCount = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0);
  const totalSpendSum = customers.reduce((sum, c) => sum + Number(c.totalSpent || 0), 0);

  // Status chip helper for order history
  const renderOrderStatusChip = (status: string) => {
    const s = (status || '').toUpperCase();
    let colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';
    if (s === 'NEW') colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
    else if (s === 'CONFIRMED') colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
    else if (s === 'PREPARING') colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
    else if (s === 'OUT_FOR_DELIVERY' || s === 'OUT FOR DELIVERY') colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
    else if (s === 'READY') colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    else if (s === 'COMPLETED' || s === 'DELIVERED') colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    else if (s === 'CANCELLED') colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';

    return (
      <span className={`text-3xs uppercase font-bold px-2 py-0.5 rounded-md border tracking-wide inline-block ${colorClasses}`}>
        {s.replace(/_/g, ' ')}
      </span>
    );
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—';
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
            Customers CRM
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Manage customer profiles, lifetime spend, and purchase history.
          </p>
        </div>

        <button
          onClick={() => fetchCustomers(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#A35742]' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* 2. Four KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Buyers</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalCustomersCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Unique customer accounts</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Repeat Buyers</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{repeatCustomersCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Placed more than 1 order</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Lifetime Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalOrdersCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Completed bakery orders</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Customer Spend</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              ₹{totalSpendSum.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Gross customer revenue</p>
          </div>
        </div>

      </div>

      {/* 3. Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or mobile number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200/80 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#A35742] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 4. Customer Listing */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#C56E56] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loading customer directory...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="text-sm font-bold text-gray-900">Failed to load customer profiles</p>
            <p className="text-xs text-gray-500">{error}</p>
            <button
              onClick={() => fetchCustomers()}
              className="px-4 py-2 rounded-xl bg-[#3D101E] text-white text-xs font-bold hover:bg-[#5B1C2E] transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-20 text-center space-y-3 px-4">
            <Users size={36} className="mx-auto text-gray-300" />
            <h3 className="text-base font-bold text-gray-800">No customer profiles found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {searchQuery
                ? "No customer matches your search criteria."
                : "When customers place orders at your bakery, their purchase histories and profiles will automatically populate here."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-gray-50/70 text-3xs font-bold text-gray-400 uppercase tracking-wider">
              <div className="col-span-4">Customer</div>
              <div className="col-span-3">Contact Information</div>
              <div className="col-span-2 text-center">Orders</div>
              <div className="col-span-2 text-right">Lifetime Spend</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Customer Rows */}
            {filteredCustomers.map((c) => {
              const initials = (c.name || c.email || 'U').slice(0, 2).toUpperCase();

              return (
                <div 
                  key={c.email}
                  className="p-4 sm:px-6 sm:py-4.5 hover:bg-gray-50/70 transition-colors flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center text-xs"
                >
                  {/* Name & Avatar */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#FAF0F2] text-[#5B1C2E] border border-[#5B1C2E]/20 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{c.name || 'Valued Customer'}</p>
                      <p className="text-3xs text-gray-400">Last ordered: {formatDate(c.lastOrderDate)}</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="col-span-3 min-w-0 text-3xs text-gray-600 space-y-0.5">
                    <p className="flex items-center gap-1.5 truncate">
                      <Mail size={12} className="text-gray-400 shrink-0" />
                      <span className="truncate">{c.email}</span>
                    </p>
                    {c.mobile && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Phone size={12} className="text-gray-400 shrink-0" />
                        <span>{c.mobile}</span>
                      </p>
                    )}
                  </div>

                  {/* Orders */}
                  <div className="col-span-2 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 font-bold text-3xs">
                      <ShoppingBag size={11} className="text-gray-500" />
                      {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
                    </span>
                  </div>

                  {/* Lifetime Spend */}
                  <div className="col-span-2 text-right">
                    <p className="font-bold text-gray-900 text-sm">
                      ₹{Number(c.totalSpent || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="col-span-1 flex items-center justify-end w-full md:w-auto">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>Profile</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* 5. Customer Profile & Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 relative my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0F2] text-[#5B1C2E] border border-[#5B1C2E]/20 flex items-center justify-center font-bold text-sm shadow-2xs">
                  {(selectedCustomer.name || selectedCustomer.email).slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-gray-900">
                    {selectedCustomer.name || 'Customer Profile'}
                  </h3>
                  <p className="text-3xs text-gray-400">Customer since {formatDate(selectedCustomer.lastOrderDate)}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/60 text-xs">
              <div>
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
                <p className="text-base font-bold text-gray-900 mt-0.5">{selectedCustomer.totalOrders}</p>
              </div>
              <div>
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Lifetime Spend</span>
                <p className="text-base font-bold text-emerald-700 mt-0.5">₹{Number(selectedCustomer.totalSpent || 0).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Average Order</span>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  ₹{selectedCustomer.totalOrders > 0 
                    ? Math.round(Number(selectedCustomer.totalSpent || 0) / selectedCustomer.totalOrders) 
                    : 0
                  }
                </p>
              </div>
              <div>
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Last Purchase</span>
                <p className="text-xs font-bold text-gray-900 mt-1">{formatDate(selectedCustomer.lastOrderDate)}</p>
              </div>
            </div>

            {/* Contact Details & WhatsApp Bar */}
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={14} className="text-[#A35742]" />
                  <span className="font-semibold">{selectedCustomer.email}</span>
                </div>
                {selectedCustomer.mobile && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={14} className="text-[#A35742]" />
                    <span>{selectedCustomer.mobile}</span>
                  </div>
                )}
                {selectedCustomer.address && (
                  <div className="flex items-start gap-2 text-gray-600 pt-1">
                    <MapPin size={14} className="text-[#A35742] shrink-0 mt-0.5" />
                    <span>{selectedCustomer.address}</span>
                  </div>
                )}
              </div>

              {selectedCustomer.mobile && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <MessageCircle size={18} className="text-emerald-600 shrink-0" />
                    <span className="font-medium">Direct WhatsApp Customer Support</span>
                  </div>
                  <a
                    href={`https://wa.me/${selectedCustomer.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedCustomer.name}, this is from your bakery on CakeStore!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shrink-0 transition-colors shadow-2xs"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              )}
            </div>

            {/* Order History Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag size={14} className="text-[#A35742]" />
                <span>Order History ({selectedCustomer.orderHistory?.length || 0})</span>
              </h4>

              {(!selectedCustomer.orderHistory || selectedCustomer.orderHistory.length === 0) ? (
                <p className="text-xs text-gray-400 italic">No past orders recorded.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedCustomer.orderHistory.map((order: CustomerOrderSummary) => (
                    <div 
                      key={order.id} 
                      className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900">
                            #{order.orderNumber.replace('ORD-', '')}
                          </span>
                          {renderOrderStatusChip(order.orderStatus)}
                        </div>
                        <p className="text-3xs text-gray-400">{formatDate(order.createdAt)}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{Number(order.totalAmount || 0).toFixed(0)}</p>
                        <p className="text-3xs text-gray-500 font-semibold">{order.paymentStatus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
