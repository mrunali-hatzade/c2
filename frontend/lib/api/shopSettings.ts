import { apiClient } from './client';

export interface ShopProfile {
  id: number;
  businessName: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  addressLine1?: string;
  addressLine2?: string;
  area?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  businessCategory?: string;
  businessType?: string;
  yearsInBusiness?: number;
  fssaiRegistration?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  status: string;
  verificationStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateShopPayload {
  businessName?: string;
  description?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  addressLine1?: string;
  addressLine2?: string;
  area?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  businessCategory?: string;
  logoUrl?: string;
  coverImageUrl?: string;
}

export interface ShopPayoutDetails {
  id?: number;
  bankAccountNumber?: string;
  ifscCode?: string;
  beneficiaryName?: string;
  upiId?: string;
  razorpayAccountId?: string;
  isVerified?: boolean;
}

export interface DashboardAnalytics {
  shopId: number;
  totalOrders: number;
  totalRevenue: number;
  topSellingProducts?: Record<string, number>;
  salesByDay?: Record<string, number>;
}

/**
 * Fetch the authenticated owner's bakery profile.
 */
export async function getMyShopProfile(): Promise<ShopProfile> {
  return apiClient<ShopProfile>('/api/shops/my-shop');
}

/**
 * Update the authenticated owner's bakery profile.
 */
export async function updateMyShopProfile(payload: UpdateShopPayload): Promise<ShopProfile> {
  return apiClient<ShopProfile>('/api/shops/my-shop', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch the authenticated owner's banking and payout configuration.
 */
export async function getShopPayoutDetails(): Promise<ShopPayoutDetails | null> {
  try {
    return await apiClient<ShopPayoutDetails>('/api/shops/my-shop/payouts');
  } catch {
    return null;
  }
}

/**
 * Update the authenticated owner's banking and payout configuration.
 */
export async function updateShopPayoutDetails(payload: Partial<ShopPayoutDetails>): Promise<ShopPayoutDetails> {
  return apiClient<ShopPayoutDetails>('/api/shops/my-shop/payouts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch live aggregate analytics for the owner's bakery.
 */
export async function getOwnerAnalytics(): Promise<DashboardAnalytics> {
  return apiClient<DashboardAnalytics>('/api/owner/analytics/dashboard');
}
