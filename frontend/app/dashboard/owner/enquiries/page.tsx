"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Cake, 
  Search, 
  Filter, 
  RefreshCw, 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Sparkles,
  ChevronRight,
  Send,
  X
} from 'lucide-react';
import { 
  getOwnerCustomCakeRequests, 
  respondToCustomCakeRequest, 
  getOwnerEnquiries, 
  replyToGeneralEnquiry, 
  CustomCakeRequest, 
  GeneralEnquiry 
} from '@/lib/api/enquiries';

export default function OwnerEnquiriesPage() {
  const [activeTab, setActiveTab] = useState<'custom-cakes' | 'general'>('custom-cakes');
  const [customCakes, setCustomCakes] = useState<CustomCakeRequest[]>([]);
  const [generalEnquiries, setGeneralEnquiries] = useState<GeneralEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected item for modal
  const [selectedCake, setSelectedCake] = useState<CustomCakeRequest | null>(null);
  const [selectedGeneral, setSelectedGeneral] = useState<GeneralEnquiry | null>(null);

  // Response form state
  const [responseStatus, setResponseStatus] = useState<string>('REVIEWED');
  const [responseText, setResponseText] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [cakesRes, generalRes] = await Promise.allSettled([
        getOwnerCustomCakeRequests(),
        getOwnerEnquiries()
      ]);

      if (cakesRes.status === 'fulfilled') {
        setCustomCakes(cakesRes.value || []);
      } else {
        console.warn('Failed to load custom cake requests:', cakesRes.reason);
      }

      if (generalRes.status === 'fulfilled') {
        setGeneralEnquiries(generalRes.value || []);
      } else {
        console.warn('Failed to load general enquiries:', generalRes.reason);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to connect to enquiries API';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered lists
  const filteredCakes = useMemo(() => {
    return customCakes.filter((item) => {
      const matchesStatus = statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter.toUpperCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (item.customerName && item.customerName.toLowerCase().includes(q)) ||
        (item.customerEmail && item.customerEmail.toLowerCase().includes(q)) ||
        (item.cakeType && item.cakeType.toLowerCase().includes(q)) ||
        (item.flavour && item.flavour.toLowerCase().includes(q)) ||
        (item.occasion && item.occasion.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [customCakes, statusFilter, searchQuery]);

  const filteredGeneral = useMemo(() => {
    return generalEnquiries.filter((item) => {
      const matchesStatus = statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter.toUpperCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (item.customerName && item.customerName.toLowerCase().includes(q)) ||
        (item.customerEmail && item.customerEmail.toLowerCase().includes(q)) ||
        (item.enquiryType && item.enquiryType.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [generalEnquiries, statusFilter, searchQuery]);

  // Counts for KPIs
  const cakePendingCount = customCakes.filter(c => c.status === 'PENDING').length;
  const cakeReviewedCount = customCakes.filter(c => c.status === 'REVIEWED').length;
  const cakeAcceptedCount = customCakes.filter(c => c.status === 'ACCEPTED').length;
  const totalEnquiriesCount = customCakes.length + generalEnquiries.length;

  const handleOpenCakeModal = (cake: CustomCakeRequest) => {
    setSelectedCake(cake);
    setSelectedGeneral(null);
    setResponseStatus(cake.status === 'PENDING' ? 'REVIEWED' : cake.status);
    setResponseText(cake.ownerResponse || '');
    setActionSuccess(null);
    setActionError(null);
  };

  const handleOpenGeneralModal = (enquiry: GeneralEnquiry) => {
    setSelectedGeneral(enquiry);
    setSelectedCake(null);
    setResponseText(enquiry.ownerReply || '');
    setActionSuccess(null);
    setActionError(null);
  };

  const closeModal = () => {
    setSelectedCake(null);
    setSelectedGeneral(null);
    setActionSuccess(null);
    setActionError(null);
  };

  const handleSubmitCakeResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCake) return;

    setSubmitting(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const updated = await respondToCustomCakeRequest(
        selectedCake.id,
        responseStatus,
        responseText
      );

      // Update local state
      setCustomCakes((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setSelectedCake(updated);
      setActionSuccess('Response and status saved successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update request';
      setActionError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitGeneralReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGeneral || !responseText.trim()) return;

    setSubmitting(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const updated = await replyToGeneralEnquiry(selectedGeneral.id, responseText);
      setGeneralEnquiries((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setSelectedGeneral(updated);
      setActionSuccess('Reply sent successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reply to inquiry';
      setActionError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for status badge
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'PENDING' || s === 'NEW') {
      return (
        <span className="inline-flex items-center gap-1 text-3xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          <Clock size={11} /> {s}
        </span>
      );
    }
    if (s === 'REVIEWED' || s === 'REPLIED') {
      return (
        <span className="inline-flex items-center gap-1 text-3xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <MessageCircle size={11} /> {s}
        </span>
      );
    }
    if (s === 'ACCEPTED') {
      return (
        <span className="inline-flex items-center gap-1 text-3xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={11} /> ACCEPTED
        </span>
      );
    }
    if (s === 'REJECTED' || s === 'CANCELLED') {
      return (
        <span className="inline-flex items-center gap-1 text-3xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle size={11} /> {s}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-3xs font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
        {s}
      </span>
    );
  };

  // Formatter for required date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not specified';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Enquiries
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Manage customer enquiries and custom cake requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
            title="Refresh records from backend"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#A35742]' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* 2. Four Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">New / Pending</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{cakePendingCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Awaiting initial review</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Under Review</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageCircle size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{cakeReviewedCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Proposal or reply drafted</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Accepted</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{cakeAcceptedCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Confirmed custom orders</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Enquiries</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalEnquiriesCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">All recorded customer leads</p>
          </div>
        </div>

      </div>

      {/* 3. Tab Switcher + Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs space-y-4">
        
        {/* Tab switcher */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('custom-cakes'); setStatusFilter('ALL'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'custom-cakes'
                  ? 'bg-[#3D101E] text-white shadow-2xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Cake size={15} />
              <span>Custom Cake Requests</span>
              <span className={`text-3xs px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'custom-cakes' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {customCakes.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('general'); setStatusFilter('ALL'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-[#3D101E] text-white shadow-2xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageSquare size={15} />
              <span>General Enquiries</span>
              <span className={`text-3xs px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'general' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {generalEnquiries.length}
              </span>
            </button>
          </div>
        </div>

        {/* Search & Status Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'custom-cakes' ? "Search by customer, cake type, occasion..." : "Search by customer, question topic..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200/80 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#A35742] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter size={12} /> Status:
            </span>
            {activeTab === 'custom-cakes' ? (
              ['ALL', 'PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg text-3xs font-bold shrink-0 transition-colors cursor-pointer ${
                    statusFilter === status
                      ? 'bg-[#A35742] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))
            ) : (
              ['ALL', 'NEW', 'REPLIED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg text-3xs font-bold shrink-0 transition-colors cursor-pointer ${
                    statusFilter === status
                      ? 'bg-[#A35742] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))
            )}
          </div>

        </div>

      </div>

      {/* 4. Enquiries Content List / Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#C56E56] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loading customer enquiries...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="text-sm font-bold text-gray-900">Failed to load enquiries</p>
            <p className="text-xs text-gray-500">{error}</p>
            <button
              onClick={() => fetchData()}
              className="px-4 py-2 rounded-xl bg-[#3D101E] text-white text-xs font-bold hover:bg-[#5B1C2E] transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : activeTab === 'custom-cakes' ? (
          /* TAB 1: CUSTOM CAKE REQUESTS */
          filteredCakes.length === 0 ? (
            <div className="py-20 text-center space-y-3 px-4">
              <Cake size={36} className="mx-auto text-gray-300" />
              <h3 className="text-base font-bold text-gray-800">No customer custom cake enquiries found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'ALL'
                  ? "No requests match your current search or status filter."
                  : "When customers request custom cakes from your storefront, their requests will appear here in real-time."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              
              {/* Desktop Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-gray-50/70 text-3xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-4">Customer & Occasion</div>
                <div className="col-span-3">Cake Requirements</div>
                <div className="col-span-2">Required Date</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              {/* Rows */}
              {filteredCakes.map((cake) => (
                <div 
                  key={cake.id} 
                  className="p-4 sm:px-6 sm:py-4.5 hover:bg-gray-50/70 transition-colors flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center"
                >
                  {/* Customer Info */}
                  <div className="col-span-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 truncate">
                        {cake.customerName}
                      </span>
                      {cake.occasion && (
                        <span className="text-3xs font-semibold px-2 py-0.5 rounded-md bg-[#FAF0F2] text-[#A35742] border border-[#A35742]/20">
                          {cake.occasion}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-3xs text-gray-400 mt-1">
                      <span className="truncate flex items-center gap-1">
                        <Mail size={11} /> {cake.customerEmail}
                      </span>
                      {cake.customerMobile && (
                        <span className="shrink-0 flex items-center gap-1">
                          <Phone size={11} /> {cake.customerMobile}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cake details */}
                  <div className="col-span-3 text-xs text-gray-700 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {cake.cakeType || 'Custom Artisan Cake'}
                    </p>
                    <p className="text-3xs text-gray-500 truncate">
                      {cake.flavour ? `Flavour: ${cake.flavour}` : ''}
                      {cake.servings ? ` • Serves ${cake.servings}` : ''}
                      {cake.budget ? ` • Budget: ₹${cake.budget}` : ''}
                    </p>
                  </div>

                  {/* Date & Delivery */}
                  <div className="col-span-2 text-xs">
                    <p className="font-bold text-gray-900 flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#A35742]" />
                      <span>{formatDate(cake.requiredDate)}</span>
                    </p>
                    <p className="text-3xs text-gray-400 mt-0.5">
                      {cake.deliveryPreference || 'Bakery Pickup'}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-1 text-center">
                    {renderStatusBadge(cake.status)}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2 w-full md:w-auto">
                    {cake.customerMobile && (
                      <a
                        href={`https://wa.me/${cake.customerMobile.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hello ${cake.customerName}, thank you for your custom cake enquiry on CakeStore!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle size={15} />
                      </a>
                    )}

                    <button
                      onClick={() => handleOpenCakeModal(cake)}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>Review & Respond</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}

            </div>
          )
        ) : (
          /* TAB 2: GENERAL STOREFRONT ENQUIRIES */
          filteredGeneral.length === 0 ? (
            <div className="py-20 text-center space-y-3 px-4">
              <MessageSquare size={36} className="mx-auto text-gray-300" />
              <h3 className="text-base font-bold text-gray-800">No general customer enquiries</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                General customer inquiries and questions submitted through your bakery storefront will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-gray-50/70 text-3xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-4">Customer</div>
                <div className="col-span-5">Enquiry Message</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              {filteredGeneral.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 sm:px-6 sm:py-4.5 hover:bg-gray-50/70 transition-colors flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center"
                >
                  <div className="col-span-4 min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{item.customerName}</p>
                    <p className="text-3xs text-gray-400 mt-0.5">{item.customerEmail}</p>
                    <span className="inline-block text-3xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md mt-1">
                      {item.enquiryType || 'General Question'}
                    </span>
                  </div>

                  <div className="col-span-5 text-xs text-gray-700 min-w-0">
                    <p className="line-clamp-2">{item.message}</p>
                    {item.ownerReply && (
                      <p className="text-3xs text-[#A35742] mt-1 font-semibold line-clamp-1">
                        Replied: &ldquo;{item.ownerReply}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="col-span-1 text-center">
                    {renderStatusBadge(item.status)}
                  </div>

                  <div className="col-span-2 flex items-center justify-end w-full md:w-auto">
                    <button
                      onClick={() => handleOpenGeneralModal(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      {item.ownerReply ? 'View / Update' : 'Reply'}
                    </button>
                  </div>
                </div>
              ))}

            </div>
          )
        )}

      </div>

      {/* 5. Custom Cake Request Detail & Response Modal */}
      {selectedCake && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 relative my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900">
                    Custom Cake Request #{selectedCake.id}
                  </h3>
                  {renderStatusBadge(selectedCake.status)}
                </div>
                <p className="text-xs text-gray-400">
                  Received on {new Date(selectedCake.createdAt).toLocaleString('en-IN')}
                </p>
              </div>

              <button 
                onClick={closeModal}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Requirements Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-5 rounded-2xl border border-gray-200/60 text-xs">
              <div>
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Customer</span>
                <p className="font-bold text-gray-900 mt-0.5">{selectedCake.customerName}</p>
                <p className="text-gray-600">{selectedCake.customerEmail}</p>
                {selectedCake.customerMobile && (
                  <p className="text-gray-600 mt-0.5 flex items-center gap-1">
                    <Phone size={11} /> {selectedCake.customerMobile}
                  </p>
                )}
              </div>

              <div>
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Date & Occasion</span>
                <p className="font-bold text-gray-900 mt-0.5 flex items-center gap-1">
                  <Calendar size={13} className="text-[#A35742]" />
                  <span>Required By: {formatDate(selectedCake.requiredDate)}</span>
                </p>
                <p className="text-gray-600">{selectedCake.occasion ? `Occasion: ${selectedCake.occasion}` : 'Occasion: General'}</p>
                <p className="text-gray-600">Preference: {selectedCake.deliveryPreference || 'Store Pickup'}</p>
              </div>

              <div>
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Cake Specifications</span>
                <p className="font-bold text-gray-900 mt-0.5">{selectedCake.cakeType || 'Custom Cake'}</p>
                <p className="text-gray-600">Flavour: {selectedCake.flavour || 'Baker Recommendation'}</p>
                <p className="text-gray-600">Servings: {selectedCake.servings || 'Not specified'}</p>
              </div>

              <div>
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Budget Indication</span>
                <p className="font-bold text-emerald-700 text-sm mt-0.5">
                  {selectedCake.budget ? `₹${selectedCake.budget}` : 'Flexible / Open'}
                </p>
              </div>
            </div>

            {/* Design Notes & Reference Photo */}
            <div className="space-y-2 text-xs">
              <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">
                Design Description & Message
              </span>
              <div className="p-4 rounded-xl bg-white border border-gray-200 text-gray-800 leading-relaxed">
                {selectedCake.designDescription || 'No additional custom design notes provided.'}
              </div>

              {selectedCake.referenceImageUrl && (
                <div className="pt-2">
                  <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Customer Reference Image
                  </span>
                  <a
                    href={selectedCake.referenceImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block relative rounded-xl overflow-hidden border border-gray-200 group max-w-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedCake.referenceImageUrl}
                      alt="Reference"
                      className="h-40 w-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-3xs px-2 py-0.5 rounded flex items-center gap-1">
                      <ExternalLink size={10} /> View Full
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Action Bar if Mobile Provided */}
            {selectedCake.customerMobile && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-800">
                  <MessageCircle size={18} className="text-emerald-600 shrink-0" />
                  <span className="font-medium">Direct WhatsApp Discussion available for this lead</span>
                </div>
                <a
                  href={`https://wa.me/${selectedCake.customerMobile.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedCake.customerName}, this is regarding your custom cake request for ${selectedCake.occasion || 'your event'} on CakeStore!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shrink-0 transition-colors shadow-2xs"
                >
                  Open Chat
                </a>
              </div>
            )}

            {/* Owner Response & Status Update Form */}
            <form onSubmit={handleSubmitCakeResponse} className="space-y-4 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#A35742]" />
                <span>Owner Response & Status Update</span>
              </h4>

              {actionSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {actionError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{actionError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Update Request Status
                  </label>
                  <select
                    value={responseStatus}
                    onChange={(e) => setResponseStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#A35742]"
                  >
                    <option value="PENDING">PENDING (Awaiting Review)</option>
                    <option value="REVIEWED">REVIEWED (Quotation Sent / Under Discussion)</option>
                    <option value="ACCEPTED">ACCEPTED (Confirmed by Bakery)</option>
                    <option value="REJECTED">REJECTED (Declined / Unavailable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Response / Quotation Notes to Customer
                </label>
                <textarea
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter custom cake quotation, preparation requirements, or pickup instructions..."
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#A35742] focus:bg-white transition-all"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Send size={13} />
                  <span>{submitting ? 'Saving...' : 'Save & Submit Response'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 6. General Enquiry Detail & Reply Modal */}
      {selectedGeneral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-5 relative my-8">
            
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-gray-900">
                  Customer Inquiry #{selectedGeneral.id}
                </h3>
                <p className="text-3xs text-gray-400">
                  From {selectedGeneral.customerName} ({selectedGeneral.customerEmail})
                </p>
              </div>
              <button 
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Customer Message</span>
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 leading-relaxed">
                {selectedGeneral.message}
              </div>
            </div>

            <form onSubmit={handleSubmitGeneralReply} className="space-y-4 pt-2">
              {actionSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {actionError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{actionError}</span>
                </div>
              )}

              <div>
                <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Your Reply to Customer
                </label>
                <textarea
                  rows={4}
                  required
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response to the customer's question..."
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#A35742] focus:bg-white transition-all"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Send size={13} />
                  <span>{submitting ? 'Sending...' : 'Send Reply'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
