'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CustomerOrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerOrderLookupModal: React.FC<CustomerOrderLookupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = orderNumber.trim();
    if (!cleanNumber) {
      setError('Please enter an order number.');
      return;
    }

    onClose();
    setOrderNumber('');
    setError(null);
    router.push(`/orders/${encodeURIComponent(cleanNumber)}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Track Your Cake Order"
      description="Enter the order number sent to your phone or WhatsApp"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="p-3.5 rounded-2xl bg-brand-cream-light/70 border border-brand-border/60 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-blush text-brand-plum flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xs text-brand-muted leading-relaxed">
            <span className="font-semibold text-brand-espresso block">Real-Time Kitchen Tracking</span>
            Follow every stage of your cake preparation from baking in the boutique kitchen to fresh doorstep dispatch.
          </div>
        </div>

        <div className="space-y-1.5">
          <Input
            label="Order Number"
            placeholder="e.g. ORD-1788-9921"
            value={orderNumber}
            onChange={(e) => {
              setOrderNumber(e.target.value.toUpperCase());
              if (error) setError(null);
            }}
            required
            autoFocus
          />
          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" className="gap-1.5 font-bold shadow-sm">
            <span>Track Order</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Modal>
  );
};
