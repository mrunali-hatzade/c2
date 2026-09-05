"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  Phone, 
  Download, 
  ArrowLeft, 
  AlertCircle,
  ChefHat,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { getOrderTracking, getInvoiceDownloadUrl, PlacedOrder } from '@/lib/api/customerCheckout';

function OrderTrackingContent() {
  const params = useParams();
  const orderNumber = String(params.orderNumber || '');

  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrderTracking(orderNumber);
        setOrder(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Order not found';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const stages = [
    { key: 'NEW', label: 'Order Received', desc: 'Sent to bakery kitchen' },
    { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Accepted by baker' },
    { key: 'PREPARING', label: 'Baking & Decorating', desc: 'Crafting in progress' },
    { key: 'READY', label: 'Ready for Delivery', desc: 'Packed and dispatched' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Celebration ready' }
  ];

  const getStageIndex = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'NEW') return 0;
    if (s === 'CONFIRMED') return 1;
    if (s === 'PREPARING') return 2;
    if (s === 'READY' || s === 'OUT_FOR_DELIVERY' || s === 'OUT FOR DELIVERY') return 3;
    if (s === 'DELIVERED' || s === 'COMPLETED') return 4;
    return 0;
  };

  const currentStageIdx = order ? getStageIndex(order.orderStatus) : 0;

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

  const searchParams = useSearchParams();
  const shopIdParam = searchParams.get('shopId');
  const returnShopId = shopIdParam || (order as any)?.shopId;

  return (
    <div className="min-h-screen bg-[#FCFAF7] font-sans flex flex-col">
      <Navbar selectedLocation="Akurdi" onSelectLocation={() => {}} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div>
          <div className="flex items-center gap-3 mb-3 text-xs">
            <Link
              href={returnShopId ? `/shop/${returnShopId}` : "/explore"}
              className="inline-flex items-center gap-2 font-semibold text-[#A35742] hover:text-[#5B1C2E] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{returnShopId ? "Return to Bakery Storefront" : "Browse Bakeries"}</span>
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              Marketplace Home
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2B1822] tracking-tight flex items-center gap-3">
                <span>Order Tracking</span>
                <span className="font-mono text-sm sm:text-base font-bold px-3 py-1 bg-[#FAF0F2] text-[#5B1C2E] rounded-xl border border-[#A35742]/20">
                  #{orderNumber}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Real-time preparation progress and digital delivery receipt.
              </p>
            </div>

            {order && (
              <a
                href={getInvoiceDownloadUrl(order.orderNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 shadow-2xs transition-colors self-start sm:self-auto"
              >
                <Download size={14} className="text-[#A35742]" />
                <span>Download PDF Invoice</span>
              </a>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-16 text-center space-y-3 shadow-2xs">
            <div className="w-8 h-8 border-3 border-[#C56E56] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Locating order file...</p>
          </div>
        ) : error || !order ? (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center space-y-4 shadow-2xs">
            <AlertCircle size={36} className="mx-auto text-rose-500" />
            <h3 className="text-base font-bold text-gray-900">Order Reference Not Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              We could not find an order matching &ldquo;{orderNumber}&rdquo;. Please verify your tracking link or check your confirmation SMS.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#3D101E] text-white text-xs font-bold"
            >
              Browse Bakery Stores
            </Link>
          </div>
        ) : (
          <div className="space-y-6">

            {/* 1. Order Status Stepper */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Live Preparation Status
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  {order.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Progress Line */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-2">
                {stages.map((stage, idx) => {
                  const isDone = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div key={stage.key} className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs transition-all ${
                        isDone 
                          ? 'bg-[#3D101E] text-white shadow-2xs' 
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-[#FAF0F2]' : ''}`}>
                        {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>

                      <div className="min-w-0">
                        <p className={`text-xs font-bold ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                          {stage.label}
                        </p>
                        <p className="text-3xs text-gray-400 mt-0.5">{stage.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Order Summary & Items Card */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-2xs space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#A35742]" />
                  <span>Cakes & Delicacies Ordered ({order.items?.length || 0})</span>
                </h3>
                <span className="text-3xs text-gray-400">Placed on {formatDate(order.createdAt)}</span>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900 text-sm">{item.productNameSnapshot}</p>
                      {item.cakeMessage && (
                        <p className="text-xs text-gray-500 italic">&ldquo;{item.cakeMessage}&rdquo;</p>
                      )}
                      {item.dietaryPreference && (
                        <span className="inline-block text-3xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          {item.dietaryPreference}
                        </span>
                      )}
                      {item.addonsSummary && (
                        <p className="text-3xs text-gray-400">Addons: {item.addonsSummary}</p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900 text-sm">₹{Number(item.totalPrice || 0).toFixed(0)}</p>
                      <p className="text-3xs text-gray-400">Qty: {item.quantity} × ₹{Number(item.unitPrice || 0).toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Items Subtotal</span>
                  <span>₹{Number(order.subtotal || 0).toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span>₹{Number(order.deliveryCharge || 0).toFixed(0)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{Number(order.discountAmount || 0).toFixed(0)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total Paid ({order.paymentMethod})</span>
                  <span className="text-[#5B1C2E]">₹{Number(order.totalAmount || 0).toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* 3. Delivery Details Card */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-2xs space-y-4 text-xs">
              <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A35742]" />
                <span>Delivery & Contact Destination</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Recipient</span>
                  <p className="font-bold text-gray-900 mt-0.5">{order.customerName}</p>
                  <p className="text-3xs text-gray-500">{order.customerPhone}</p>
                </div>

                <div>
                  <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Target Delivery Date</span>
                  <p className="font-bold text-gray-900 mt-0.5">{formatDate(order.deliveryDate)}</p>
                </div>

                <div>
                  <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Delivery Address</span>
                  <p className="text-gray-700 mt-0.5 leading-relaxed">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFAF7] flex items-center justify-center text-sm font-semibold text-gray-500">Loading order details...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
