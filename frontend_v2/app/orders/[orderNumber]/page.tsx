'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Clock, Truck, Package, ArrowLeft, Store } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import { storefrontApi } from '@/lib/api/storefront';
import { Order } from '@/types/order';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [shop, setShop] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = React.useCallback(async () => {
    if (!orderNumber) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getOrderByNumber(orderNumber);
      setOrder(data);
      if (data?.shopId) {
        try {
          const shopData = await storefrontApi.getShopById(data.shopId);
          if (shopData && !shopData.businessPhone && shopData.phone) {
            shopData.businessPhone = shopData.phone;
          }
          setShop(shopData);
        } catch {
          // ignore error fetching shop
        }
      }
    } catch (err: any) {
      setError(err.message || 'Order not found');
    } finally {
      setIsLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (isLoading) return <LoadingState message="Fetching live order tracking..." className="min-h-screen" />;
  if (error || !order) return <ErrorState message={error || 'Order not found'} onRetry={fetchOrder} className="min-h-screen" />;

  const statusVariant = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'OUT_FOR_DELIVERY':
      case 'PREPARING':
        return 'warning';
      default:
        return 'plum';
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream-light py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/explore" className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-espresso">
            <ArrowLeft className="w-4 h-4 mr-2" /> Explore More Bakeries
          </Link>
        </div>

        <Card className="p-8">
          <div className="flex items-center justify-between pb-6 border-b border-brand-border/60">
            <div>
              <span className="text-xs font-semibold text-brand-plum uppercase tracking-wider">Order Status</span>
              <h1 className="text-2xl font-serif font-bold text-brand-espresso mt-0.5">#{order.orderNumber}</h1>
            </div>
            <Badge variant={statusVariant(order.status)} size="md">
              {order.status}
            </Badge>
          </div>

          {/* Timeline */}
          <div className="py-8 grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`flex flex-col items-center ${order.status !== 'PENDING' ? 'text-brand-plum font-semibold' : 'text-brand-espresso font-semibold'}`}>
              <div className="w-8 h-8 rounded-full bg-brand-blush flex items-center justify-center mb-1 text-brand-plum">
                <Clock className="w-4 h-4" />
              </div>
              <span>Received</span>
            </div>
            <div className={`flex flex-col items-center ${['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'text-brand-plum font-semibold' : 'text-brand-muted'}`}>
              <div className="w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center mb-1 text-brand-espresso">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Confirmed</span>
            </div>
            <div className={`flex flex-col items-center ${['PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'text-brand-plum font-semibold' : 'text-brand-muted'}`}>
              <div className="w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center mb-1 text-brand-espresso">
                <Package className="w-4 h-4" />
              </div>
              <span>Baking</span>
            </div>
            <div className={`flex flex-col items-center ${['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'text-brand-plum font-semibold' : 'text-brand-muted'}`}>
              <div className="w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center mb-1 text-brand-espresso">
                <Truck className="w-4 h-4" />
              </div>
              <span>Delivered</span>
            </div>
          </div>

          {/* Details */}
          <div className="bg-brand-cream-light/60 rounded-2xl p-4 space-y-2 text-xs border border-brand-border/60">
            <div className="flex justify-between">
              <span className="text-brand-muted">Recipient:</span>
              <span className="font-medium text-brand-espresso">{order.customerName} ({order.customerPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Delivery Address:</span>
              <span className="font-medium text-brand-espresso text-right max-w-xs">{order.deliveryAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Delivery Date:</span>
              <span className="font-medium text-brand-espresso">{order.deliveryDate}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-brand-border/60 font-semibold text-sm">
              <span className="text-brand-espresso">Total Amount:</span>
              <span className="text-brand-plum font-serif text-base">₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Contact Baker */}
          <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-emerald-800">Need help with your order?</p>
              <p className="text-xs text-emerald-700 mt-0.5">Contact the bakery directly on WhatsApp</p>
            </div>
            <a
              href={`https://wa.me/91${shop?.whatsappNumber || shop?.businessPhone || ''}?text=${encodeURIComponent(`Hi! I have a question about my order #${order?.orderNumber} from CakeStore.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
          </div>

          <div className="mt-6 pt-4 text-center">
            <Link href={`/shop/${order.shopId}`} className="text-xs text-brand-plum font-medium hover:underline inline-flex items-center">
              <Store className="w-3.5 h-3.5 mr-1" /> Visit Bakery Storefront
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}