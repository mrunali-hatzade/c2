export type ShopStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED';

export interface Shop {
  id: number;
  businessName: string;
  businessType?: string;
  businessCategory?: string;
  businessDescription?: string;
  businessPhone?: string;
  businessEmail?: string;
  phone?: string;
  email?: string;
  address?: string;
  addressLine1: string;
  addressLine2?: string;
  area?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  status: ShopStatus;
  verificationStatus?: 'VERIFIED' | 'PROCESSING' | 'UNVERIFIED' | string;
  fssaiRegistration?: string;
  yearsInBusiness?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  bannerUrl?: string;
  coverImageUrl?: string;
  logoUrl?: string;
  isPureVeg?: boolean;
  deliveryAvailable?: boolean;
  deliveryTimeMinutes?: number;
  minOrderValue?: number;
  featuredCategory?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopSearchFilters {
  state?: string;
  district?: string;
  city?: string;
  area?: string;
  businessType?: string;
  search?: string;
  location?: string;
}
