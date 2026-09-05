'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Clock, Truck, Package, ArrowLeft, Store } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import { Order } from '@/types/order';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = React.useCallback(async () => {
    if (!orderNumber) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getOrderByNumber(orderNumber);
      setOrder(data);
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
