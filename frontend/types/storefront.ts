export interface StorefrontShopResponse {
  id: number;
  businessName: string;
  description: string;
  logoUrl: string;
  coverImageUrl: string;
  address: string;
  businessCategory: string;

  // UI fallbacks added for display on homepage:
  rating?: number;
  reviews?: number;
  delivery?: string;
}

export interface StorefrontShop {
  id: number;
  businessName: string;
  description: string;
  businessCategory?: string;
  businessType?: string;
  area?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  fssaiRegistration?: string;
  yearsInBusiness?: number;
  verificationStatus?: string;
  status?: string;
  // UI Display helpers
  rating?: number;
  reviewCount?: number;
  deliveryTime?: string;
  tags?: string[];
  featuredCategory?: string;
}

export interface ProductVariant {
  id: number;
  name: string;
  price: number;
  sku?: string;
  isAvailable?: boolean;
}

export interface ProductAddon {
  id: number;
  name: string;
  price: number;
  isAvailable?: boolean;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  availability: boolean;
  status: string;
  shopId?: number;
  shopName?: string;
  category?: string;
  rating?: number;
  dietary?: string; // 'EGGLESS' | 'REGULAR' | 'GLUTEN_FREE'
  variants?: ProductVariant[];
  addons?: ProductAddon[];
}

export interface CakeCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count?: number;
}
