'use client';

import React, { useEffect, useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, XCircle, Calendar, Sparkles } from 'lucide-react';
import { ownerApi } from '@/lib/api/owner';
import { Coupon, CreateCouponRequest } from '@/types/owner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { useToast } from '@/components/common/Toast';

export default function OwnerCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState<CreateCouponRequest>({
    code: '',
    discountPercent: 10,
    minOrderAmount: 499,
    validUntil: '',
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await ownerApi.getCoupons();
      setCoupons(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsSubmitting(true);
    try {
      const newCoupon = await ownerApi.createCoupon(form);
      setCoupons((prev) => [newCoupon, ...prev]);
      toast.success(`Coupon "${newCoupon.code}" created successfully!`);
      setIsModalOpen(false);
      setForm({ code: '', discountPercent: 10, minOrderAmount: 499, validUntil: '' });
    } catch {
      toast.error('Failed to create coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    const updatedStatus = !coupon.isActive;
    setCoupons((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, isActive: updatedStatus } : c))
    );
    await ownerApi.toggleCoupon(coupon.id);
    if (updatedStatus) {
      toast.success(`Coupon "${coupon.code}" activated`);
    } else {
      toast.info(`Coupon "${coupon.code}" deactivated`);
    }
  };

  const handleDelete = async (id: string | number, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    await ownerApi.deleteCoupon(id);
    toast.info(`Coupon "${code}" deleted`);
  };

  if (loading) return <LoadingState message="Loading discount coupons..." />;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-owner-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-owner-heading">Coupons & Discounts</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-blush text-brand-plum text-2xs font-bold uppercase tracking-wider">
              {coupons.filter((c) => c.isActive).length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-owner-muted mt-1">
            Create promotional discount codes for festival celebrations and customer loyalty.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="self-start sm:self-auto">
          <Plus className="w-4 h-4 mr-1.5" />
          Create New Coupon
        </Button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="p-5 flex flex-col justify-between border-dashed border-2 relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-blush font-mono font-bold text-brand-plum text-sm tracking-wider border border-brand-blush-border">
                  <Tag className="w-3.5 h-3.5" />
                  {coupon.code}
                </div>
                <Badge variant={coupon.isActive ? 'success' : 'default'} size="sm">
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="space-y-1.5 my-4">
                <p className="text-xl font-bold font-serif text-owner-heading">
                  {coupon.discountPercent
                    ? `${coupon.discountPercent}% OFF`
                    : `₹${coupon.flatDiscount} FLAT OFF`}
                </p>
                <p className="text-xs text-owner-muted">
                  Minimum Order: <strong className="text-owner-heading">₹{coupon.minOrderAmount || 0}</strong>
                </p>
                {coupon.validUntil && (
                  <p className="text-xs text-owner-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-owner-muted" />
                    Valid until {coupon.validUntil}
                  </p>
                )}
                {coupon.usageCount !== undefined && (
                  <p className="text-2xs text-emerald-700 font-medium">
                    Redeemed {coupon.usageCount} times by happy customers
                  </p>
                )}
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="pt-4 border-t border-owner-border flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleActive(coupon)}
                className="text-xs"
              >
                {coupon.isActive ? (
                  <>
                    <XCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Activate
                  </>
                )}
              </Button>

              <button
                onClick={() => handleDelete(coupon.id, coupon.code)}
                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Promotional Coupon"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <Input
            label="Coupon Code (e.g. DIWALI20)"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="SUMMER10"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Discount Percentage (%)"
              type="number"
              min={1}
              max={100}
              value={form.discountPercent || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  discountPercent: Number(e.target.value) || undefined,
                  flatDiscount: undefined,
                })
              }
              placeholder="10"
            />
            <Input
              label="Flat Discount (₹)"
              type="number"
              min={0}
              value={form.flatDiscount || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  flatDiscount: Number(e.target.value) || undefined,
                  discountPercent: undefined,
                })
              }
              placeholder="50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum Order Value (₹)"
              type="number"
              min={0}
              value={form.minOrderAmount || ''}
              onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) || 0 })}
              placeholder="499"
            />
            <Input
              label="Expiry Date"
              type="date"
              value={form.validUntil || ''}
              onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-owner-border">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
