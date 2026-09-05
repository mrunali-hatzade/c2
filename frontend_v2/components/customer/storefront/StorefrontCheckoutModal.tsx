'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, CheckCircle2, Calendar, MapPin, ArrowRight, Store } from 'lucide-react';
import { Shop } from '@/types/shop';
import { DeliverySlot } from '@/types/deliverySlot';
import { Order } from '@/types/order';
import { useCart } from '@/context/CartContext';
import { ordersApi } from '@/lib/api/orders';
import { deliverySlotsApi } from '@/lib/api/deliverySlots';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/components/common/Toast';

interface StorefrontCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
}

export const StorefrontCheckoutModal: React.FC<StorefrontCheckoutModalProps> = ({
  isOpen,
  onClose,
  shop,
}) => {
  const { items, totalPrice, clearCart } = useCart();
  const toast = useToast();

  const [slots, setSlots] = useState<DeliverySlot[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<number | undefined>(undefined);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (shop?.id && isOpen) {
      deliverySlotsApi
        .getStorefrontSlots(shop.id)
        .then(setSlots)
        .catch(() => setSlots([]));
    }
  }, [shop?.id, isOpen]);

  if (!isOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Your store basket is empty.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const order = await ordersApi.createGuestOrder(shop.id, {
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        deliveryDate,
        deliverySlotId: selectedSlotId,
        specialInstructions,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          customMessage: i.customMessage,
        })),
      });

      setConfirmedOrder(order);
      clearCart();
      toast.success(`Order #${order.orderNumber} successfully placed!`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit order. Please check all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (confirmedOrder) {
      setConfirmedOrder(null);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      maxWidth="lg"
      title={confirmedOrder ? 'Order Confirmed!' : `Complete Order with ${shop.businessName}`}
      description={
        confirmedOrder
          ? 'Your handcrafted cake order is being routed directly to the kitchen.'
          : 'Direct in-store order — no account required'
      }
    >
      {confirmedOrder ? (
        /* Order Success Screen */
        <div className="space-y-6 py-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-semibold text-brand-plum uppercase tracking-wider">
              Order Confirmed
            </span>
            <h2 className="text-2xl font-serif font-bold text-brand-espresso mt-1">
              #{confirmedOrder.orderNumber}
            </h2>
            <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
              Thank you, {confirmedOrder.customerName}. {shop.businessName} has received your order and will begin preparation according to your delivery schedule.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-cream-light/60 border border-brand-border/60 text-xs text-left space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-brand-muted">Bakery:</span>
              <span className="font-semibold text-brand-espresso">{shop.businessName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Delivery Schedule:</span>
              <span className="font-semibold text-brand-espresso">{confirmedOrder.deliveryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Total Amount:</span>
              <span className="font-serif font-bold text-brand-plum text-sm">
                ₹{confirmedOrder.totalAmount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Payment:</span>
              <span className="font-medium text-emerald-700">Pay on Delivery / UPI</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href={`/orders/${confirmedOrder.orderNumber}`} className="w-full sm:w-auto">
              <Button size="md" className="w-full sm:w-auto">
                Track Live Order Status <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Button variant="outline" size="md" onClick={handleModalClose} className="w-full sm:w-auto">
              Continue Browsing Store
            </Button>
          </div>
        </div>
      ) : (
        /* Checkout Form */
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          {error && <ErrorState message={error} className="mb-4" />}

          {/* Order Items Recap */}
          <div className="p-3.5 rounded-2xl bg-brand-cream-light/60 border border-brand-border/60 space-y-2">
            <span className="text-[11px] font-semibold text-brand-plum uppercase tracking-wider block">
              Basket Items ({items.length})
            </span>
            <div className="max-h-32 overflow-y-auto space-y-1 divide-y divide-brand-border/40 text-xs">
              {items.map((i) => (
                <div key={i.productId} className="pt-1.5 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-brand-espresso">
                      {i.name} × {i.quantity}
                    </span>
                    {i.customMessage && (
                      <span className="block text-[10px] text-brand-plum italic">
                        &quot;{i.customMessage}&quot;
                      </span>
                    )}
                  </div>
                  <span className="font-serif font-bold text-brand-espresso">
                    ₹{i.price * i.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Your Full Name"
              required
              placeholder="e.g. Priya Sharma"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              label="Mobile Number (10 digits)"
              required
              placeholder="9876543210"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <Input
            label="Email Address (for invoice & updates)"
            type="email"
            required
            placeholder="priya@example.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />

          <Input
            label="Delivery Street Address"
            required
            placeholder="Flat 302, Green Valley Apartments, Near City Center"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />

          {/* Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Delivery Date"
              type="date"
              required
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
            <Select
              label="Delivery Slot Window"
              options={[
                { value: '', label: 'Select Delivery Window' },
                ...slots.map((s) => ({
                  value: s.id,
                  label: `${s.name} (${s.startTime} - ${s.endTime})`,
                })),
              ]}
              value={selectedSlotId || ''}
              onChange={(e) => setSelectedSlotId(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          <Textarea
            label="Special Delivery Instructions (Optional)"
            placeholder="Please ring bell twice or leave with security"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            rows={2}
          />

          {/* Action Footer */}
          <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-brand-muted block">Total Payment (COD / UPI)</span>
              <span className="font-serif font-bold text-xl text-brand-espresso">
                ₹{totalPrice}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" type="button" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button type="submit" size="md" isLoading={isSubmitting}>
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Place Bakery Order
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
