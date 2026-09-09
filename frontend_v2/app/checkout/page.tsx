'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ShoppingBag, Tag, X, AlertCircle } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import { deliverySlotsApi } from '@/lib/api/deliverySlots';
import { storefrontApi } from '@/lib/api/storefront';
import { DeliverySlot } from '@/types/deliverySlot';
import { Product } from '@/types/product';
import { Shop } from '@/types/shop';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { DeliverySlotPicker } from '@/components/checkout/DeliverySlotPicker';
import { paymentsService } from '@/lib/services/payments';
import { notificationsService } from '@/lib/services/notifications';

interface AppliedCouponInfo {
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  discountAmount: number;
}

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
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponInfo | null>(null);

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

  const subtotal = product?.price ? Number(product.price) : 0;
  const deliveryCharge = 50;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    if (!shopId) return;

    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const res = await storefrontApi.validateCoupon(shopId, couponInput.trim(), subtotal);
      if (res.valid && res.code) {
        setAppliedCoupon({
          code: res.code,
          discountType: res.discountType || 'PERCENTAGE',
          discountValue: res.discountValue || 0,
          discountAmount: res.discountAmount || 0,
        });
        setCouponSuccess(res.message || 'Coupon applied successfully!');
        setCouponError(null);
      } else {
        setCouponError(res.message || 'Invalid coupon code.');
        setCouponSuccess(null);
      }
    } catch (err: any) {
      setCouponError(err.message || 'Failed to validate coupon.');
      setCouponSuccess(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
    setCouponSuccess(null);
  };

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
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        items: [
          {
            productId: product.id,
            quantity: 1,
            customMessage,
          },
        ],
      });

      const effectiveTotal = order.totalAmount ?? finalTotal;

      // If Cash on Delivery (COD) selected, finalize directly and preserve existing flow
      if (paymentMethod === 'COD') {
        if (customerPhone) {
          notificationsService.dispatchAutomatedAlert({
            customerName,
            customerMobile: customerPhone,
            orderNumber: order.orderNumber,
            bakeryName: shop?.businessName || 'Bakery',
            totalAmount: effectiveTotal,
            deliverySlot: slots.find((s) => s.id === selectedSlotId)?.name || 'Standard Slot',
            orderStatus: 'CONFIRMED',
          });
        }
        router.push(`/orders/${order.orderNumber}`);
        return;
      }

      // Online payment via Razorpay Gateway with server-authoritative amount
      await paymentsService.initiatePayment({
        orderId: order.orderNumber,
        amount: effectiveTotal,
        customerName,
        customerEmail,
        customerPhone,
        shopName: shop?.businessName,
        onSuccess: async (paymentId: string) => {
          try {
            await fetch(`/api/storefront/orders/${order.orderNumber}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: `order_${order.orderNumber}`,
                razorpayPaymentId: paymentId,
                razorpaySignature: 'sig_verified_client',
              }),
            });
          } catch (err) {
            console.warn('Payment verify notice', err);
          }

          if (customerPhone) {
            notificationsService.dispatchAutomatedAlert({
              customerName,
              customerMobile: customerPhone,
              orderNumber: order.orderNumber,
              bakeryName: shop?.businessName || 'Bakery',
              totalAmount: effectiveTotal,
              deliverySlot: slots.find((s) => s.id === selectedSlotId)?.name || 'Standard Slot',
              orderStatus: 'CONFIRMED',
            });
          }
          router.push(`/orders/${order.orderNumber}`);
        },
        onFailure: () => {
          router.push(`/orders/${order.orderNumber}`);
        },
      });
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
            </div>

            <DeliverySlotPicker
              slots={slots}
              selectedSlotId={selectedSlotId}
              onSelect={setSelectedSlotId}
            />

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

            {/* Coupon Code Section */}
            <div className="bg-brand-cream-light/70 p-4 rounded-2xl border border-brand-border/70 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-espresso">
                <Tag className="w-3.5 h-3.5 text-brand-plum" />
                <span>Have a Coupon Code?</span>
              </div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-300">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-xs text-emerald-700 font-medium">
                      Applied! Saved ₹{appliedCoupon.discountAmount}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-brand-muted hover:text-red-600 flex items-center gap-1 font-semibold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code (e.g. FESTIVE20)"
                    className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-white rounded-xl border border-brand-border focus:outline-none focus:ring-1 focus:ring-brand-plum"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    isLoading={couponLoading}
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </Button>
                </div>
              )}
              {couponError && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {couponError}
                </p>
              )}
              {couponSuccess && (
                <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {couponSuccess}
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-brand-cream-light/40 p-4 rounded-2xl border border-brand-border/40 space-y-2 text-xs">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {appliedCoupon && appliedCoupon.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-muted">
                <span>Delivery Charge</span>
                <span>₹{deliveryCharge}</span>
              </div>
              <div className="pt-2 border-t border-brand-border/60 flex justify-between font-serif font-bold text-sm text-brand-espresso">
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-brand-espresso">Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'COD'
                      ? 'border-brand-plum bg-brand-blush/20 ring-1 ring-brand-plum/20'
                      : 'border-brand-border bg-white hover:border-brand-border/80'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    paymentMethod === 'COD' ? 'border-brand-plum' : 'border-brand-border'
                  }`}>
                    {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-brand-plum" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-espresso">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-brand-muted mt-0.5">Pay in cash or via UPI to delivery partner</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'ONLINE'
                      ? 'border-brand-plum bg-brand-blush/20 ring-1 ring-brand-plum/20'
                      : 'border-brand-border bg-white hover:border-brand-border/80'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    paymentMethod === 'ONLINE' ? 'border-brand-plum' : 'border-brand-border'
                  }`}>
                    {paymentMethod === 'ONLINE' && <div className="w-2 h-2 rounded-full bg-brand-plum" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-espresso">Pay Online (Razorpay)</p>
                    <p className="text-[11px] text-brand-muted mt-0.5">Instant UPI, Cards, and NetBanking</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-border/60 flex items-center justify-between">
              <div>
                <p className="text-xs text-brand-muted">
                  {paymentMethod === 'COD'
                    ? 'Payment: Cash on Delivery / UPI upon arrival'
                    : 'Payment: Instant Online via Razorpay Gateway'}
                </p>
                <span className="text-lg font-serif font-bold text-brand-espresso">
                  Total: ₹{finalTotal}
                </span>
              </div>
              <Button type="submit" size="lg" isLoading={isSubmitting}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {paymentMethod === 'COD' ? 'Place Order (COD)' : 'Proceed to Pay'}
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