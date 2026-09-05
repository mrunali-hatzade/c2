export interface DashboardAnalytics {
  totalRevenue: number;
  totalOrders: number;
  salesByDay: Record<string, number>;
  topSellingProducts: Record<string, number>;
  conversionRate?: number;
  averageOrderValue?: number;
  activeProductsCount?: number;
}

export interface Coupon {
  id: string | number;
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  minOrderAmount?: number;
  validUntil?: string;
  isActive: boolean;
  usageCount?: number;
}

export interface CreateCouponRequest {
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  minOrderAmount?: number;
  validUntil?: string;
}

export interface OwnerCustomer {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate?: string;
  address?: string;
}

export type EnquiryStatus = 'NEW' | 'QUOTED' | 'IN_PROGRESS' | 'FULFILLED' | 'DECLINED';

export interface CustomCakeEnquiry {
  id: string | number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  occasion: string;
  flavor?: string;
  weightKg?: number;
  budget?: number;
  eventDate: string;
  referenceImageUrl?: string;
  status: EnquiryStatus;
  notes?: string;
  quotedPrice?: number;
  createdAt?: string;
}

export interface BakeryReview {
  id: string | number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  orderNumber?: string;
  cakeName?: string;
  reply?: string;
  replyDate?: string;
}

export interface ShopSettings {
  id?: string | number;
  businessName: string;
  businessType?: string;
  description?: string;
  phone?: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  area?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  fssaiRegistration?: string;
  isPureVeg: boolean;
  openingTime?: string;
  closingTime?: string;
  coverImageUrl?: string;
  logoUrl?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
}

export interface OwnerSubscription {
  planId: string;
  planName: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  status: 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED';
  renewalDate: string;
  ordersProcessedThisMonth: number;
  ordersLimit: number;
  features: string[];
}
