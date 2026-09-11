'use client';

import React, { useState } from 'react';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  Store,
  Download,
  AlertCircle,
  Star,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { Shop } from '@/types/shop';
import { Order } from '@/types/order';
import { ordersApi } from '@/lib/api/orders';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/common/Toast';

interface StorefrontTrackOrderTabProps {
  shop: Shop;
  onOpenReviewModal?: (order: Order, item: any) => void;
}

export const StorefrontTrackOrderTab: React.FC<StorefrontTrackOrderTabProps> = ({
  shop,
  onOpenReviewModal,
}) => {
  const toast = useToast();
  const [orderNumberInput, setOrderNumberInput] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = orderNumberInput.trim().toUpperCase();
    if (!cleanNum) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getOrderByNumber(cleanNum);
      if (data) {
        setOrder(data);
      } else {
        setError('Order not found. Please check your order number.');
      }
    } catch (err: any) {
      setError(err.message || 'Order not found. Please verify the order number.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;
    setIsDownloading(true);
    try {
      await ordersApi.downloadStorefrontInvoice(order.orderNumber);
      toast.success('Tax invoice downloaded successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to download invoice. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'PLACED':
      case 'PENDING':
      case 'NEW':
        return 0;
      case 'PREPARING':
      case 'BAKING':
        return 1;
      case 'READY':
      case 'DISPATCHED':
      case 'OUT_FOR_DELIVERY':
        return 2;
      case 'DELIVERED':
      case 'COMPLETED':
        return 3;
      default:
        return 0;
    }
  };

  const stages = [
    { title: 'Order Placed', desc: 'Order received & confirmed by bakery', icon: CheckCircle2 },
    { title: 'Baking & Styling', desc: 'Artisan kitchen crafting your cake', icon: Clock },
    { title: 'Ready for Dispatch', desc: 'Quality checked & packed safely', icon: Package },
    { title: 'Delivered', desc: 'Arrived fresh for celebration', icon: Truck },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold">
          <Truck className="w-3.5 h-3.5" />
          <span>Real-Time Kitchen Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-espresso">
          Track Your Order with <span className="text-brand-plum italic">{shop.businessName}</span>
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
          Enter your order reference code (sent via SMS or WhatsApp) to monitor preparation and delivery status.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-6 border border-brand-border/80 shadow-soft">
        <form onSubmit={handleSearchOrder} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. ORD-E428DE28"
              value={orderNumberInput}
              onChange={(e) => setOrderNumberInput(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border text-sm text-brand-espresso font-mono placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-plum focus:ring-1 focus:ring-brand-plum"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto font-bold px-6 py-2.5 h-10 shadow-xs"
          >
            <span>{isLoading ? 'Tracking...' : 'Track Cake'}</span>
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </Card>

      {/* Order Status Display */}
      {order && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Order Header Summary */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border/60">
              <div>
                <span className="text-[10px] font-bold text-brand-plum uppercase tracking-wider">
                  Live Order Tracking
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-espresso mt-0.5">
                  Order #{order.orderNumber}
                </h2>
                <p className="text-xs text-brand-muted mt-1">
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    order.orderStatus === 'DELIVERED' || order.orderStatus === 'COMPLETED'
                      ? 'success'
                      : 'plum'
                  }
                  size="md"
                >
                  {order.orderStatus?.replace(/_/g, ' ')}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadInvoice}
                  disabled={isDownloading}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloading ? 'Downloading...' : 'Tax Invoice'}</span>
                </Button>
              </div>
            </div>

            {/* 4-Stage Timeline */}
            <div className="py-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 relative">
                {stages.map((stage, idx) => {
                  const currentIdx = getStageIndex(order.orderStatus || '');
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const Icon = stage.icon;

                  return (
                    <div
                      key={stage.title}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isDone
                          ? 'bg-brand-blush/40 border-brand-plum/30'
                          : 'bg-brand-cream-light/40 border-brand-border/40 opacity-50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isDone
                              ? 'bg-brand-plum text-white shadow-xs'
                              : 'bg-brand-cream text-brand-muted'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-bold text-brand-espresso">{stage.title}</h3>
                        <p className="text-[11px] text-brand-muted leading-tight">{stage.desc}</p>
                      </div>
                      {isCurrent && (
                        <div className="mt-3 pt-2 border-t border-brand-plum/20">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-plum uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-plum animate-pulse" />
                            Current Stage
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-3 pt-4 border-t border-brand-border/60">
              <h3 className="text-xs font-bold text-brand-espresso uppercase tracking-wider">
                Celebration Cakes in this Order ({order.items?.length || 0})
              </h3>
              <div className="divide-y divide-brand-border/40">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-brand-espresso">
                        {item.quantity}x {item.productNameSnapshot || 'Celebration Cake'}
                      </p>
                      {item.variantName && (
                        <p className="text-[11px] text-brand-muted">Size: {item.variantName}</p>
                      )}
                      {item.cakeMessage && (
                        <p className="text-[11px] text-brand-plum italic">
                          Message: &ldquo;{item.cakeMessage}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-brand-espresso">
                        ₹{item.totalPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-border/60 text-xs">
              <div className="space-y-1 text-brand-muted">
                <span className="font-bold text-brand-espresso block">Delivery Address</span>
                <p>{order.deliveryAddress || 'Direct Doorstep Delivery'}</p>
                {order.customerPhone && <p>Contact: {order.customerPhone}</p>}
              </div>
              <div className="space-y-1 text-brand-muted sm:text-right">
                <span className="font-bold text-brand-espresso block">Payment &amp; Total</span>
                <p>Method: <strong>{order.paymentMethod || 'COD'}</strong></p>
                <p className="text-base font-serif font-bold text-brand-espresso pt-1">
                  Total: ₹{order.totalAmount}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
