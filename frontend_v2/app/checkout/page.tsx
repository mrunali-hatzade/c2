'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import { deliverySlotsApi } from '@/lib/api/deliverySlots';
import { storefrontApi } from '@/lib/api/storefront';
import { DeliverySlot } from '@/types/deliverySlot';
import { Product } from '@/types/product';
import { Shop } from '@/types/shop';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const shopId = searchParams.get('shopId');
  const productId = searchParams.get('productId');

  const [shop, setShop] = useState<Shop | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [slots, setSlots] = useState<DeliverySlot[]>([]);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<number | undefined>(undefined);
  const [customMessage, setCustomMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) return;

    storefrontApi.getShopById(shopId).then(setShop).catch(console.error);
    deliverySlotsApi.getStorefrontSlots(shopId).then(setSlots).catch(console.error);

    if (productId) {
      storefrontApi.getProductDetails(shopId, productId).then(setProduct).catch(console.error);
    }
  }, [shopId, productId]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId || !product) {
      setError('Please select a bakery and product to place an order.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const order = await ordersApi.createGuestOrder(shopId, {
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        deliveryDate,
        deliverySlotId: selectedSlotId,
        specialInstructions,
        items: [
          {
            productId: product.id,
            quantity: 1,
            customMessage,
          },
        ],
      });

      router.push(`/orders/${order.orderNumber}`);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please check all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shopId) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h2 className="text-xl font-serif font-bold text-brand-espresso">No Storefront Selected</h2>
        <p className="text-xs text-brand-muted mt-2">Please select a cake from a bakery storefront before checking out.</p>
        <Link href="/explore" className="inline-block mt-4">
          <Button size="sm">Explore Bakeries</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream-light py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={shopId ? `/shop/${shopId}` : '/explore'}
            className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-espresso"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Storefront
          </Link>
          <span className="font-serif font-bold text-brand-espresso">{shop?.businessName}</span>
        </div>

        <Card className="p-8">
          <div className="flex items-center gap-3 pb-6 border-b border-brand-border/60 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-brand-blush text-brand-plum flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl text-brand-espresso">Order Checkout</h1>
              <p className="text-xs text-brand-muted">Guest checkout — no password required</p>
            </div>
          </div>

          {error && <ErrorState message={error} className="mb-6" />}

          {/* Item Summary */}
          {product && (
            <div className="bg-brand-cream-light/60 p-4 rounded-2xl border border-brand-border/60 mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-plum uppercase tracking-wider">Ordering</p>
                <h3 className="font-serif font-bold text-brand-espresso text-base">{product.name}</h3>
                <span className="text-xs text-brand-muted">{product.isEggless ? 'Eggless' : 'Regular'}</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-serif text-brand-espresso">₹{product.price}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Full Name"
                required
                placeholder="Priya Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                label="Mobile Number"
                required
                placeholder="9876543210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="priya@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />

            <Input
              label="Delivery Address"
              required
              placeholder="Flat 402, Sunshine Apartments, MG Road"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Delivery Date"
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
              <Select
                label="Delivery Slot"
                options={[
                  { value: '', label: 'Select a time window' },
                  ...slots.map((s) => ({
                    value: s.id,
                    label: `${s.name} (${s.startTime} - ${s.endTime})`,
                  })),
                ]}
                value={selectedSlotId || ''}
                onChange={(e) => setSelectedSlotId(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <Input
              label="Custom Message on Cake (Optional)"
              placeholder="Happy 25th Anniversary Mom & Dad!"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />

            <Input
              label="Special Delivery Instructions (Optional)"
              placeholder="Call before arrival / Ring door bell"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />

            <div className="pt-6 border-t border-brand-border/60 flex items-center justify-between">
              <div>
                <p className="text-xs text-brand-muted">Payment: Pay on Delivery / UPI upon arrival</p>
                <span className="text-lg font-serif font-bold text-brand-espresso">
                  Total: ₹{product ? product.price : 0}
                </span>
              </div>
              <Button type="submit" size="lg" isLoading={isSubmitting}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Place Order
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-serif">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
