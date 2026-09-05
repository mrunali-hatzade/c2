import { apiClient } from './client';

export type DiscountType = 'PERCENTAGE' | 'FLAT';

export interface CouponRecord {
  id: number;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscountCap?: number;
  startDate?: string;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponPayload {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscountCap?: number;
  startDate?: string;
  expiryDate?: string;
  usageLimit?: number;
  isActive?: boolean;
}

/**
 * Fetch all coupons for the authenticated shop owner.
 */
export async function getOwnerCoupons(): Promise<CouponRecord[]> {
  return apiClient<CouponRecord[]>('/api/owner/coupons');
}

/**
 * Create a new coupon code for the authenticated shop owner.
 */
export async function createOwnerCoupon(payload: CreateCouponPayload): Promise<CouponRecord> {
  return apiClient<CouponRecord>('/api/owner/coupons', {
    method: 'POST',
    body: JSON.stringify({
      code: payload.code.trim().toUpperCase(),
      discountType: payload.discountType,
      discountValue: payload.discountValue,
      minOrderValue: payload.minOrderValue || null,
      maxDiscountCap: payload.maxDiscountCap || null,
      startDate: payload.startDate || null,
      expiryDate: payload.expiryDate || null,
      usageLimit: payload.usageLimit || null,
      isActive: payload.isActive !== undefined ? payload.isActive : true,
    }),
  });
}
