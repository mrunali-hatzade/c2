import { apiClient } from './client';
import { Shop, ShopSearchFilters } from '@/types/shop';
import { Product, Category } from '@/types/product';

export const storefrontApi = {
  getShopById: async (shopId: number | string): Promise<Shop> => {
    try {
      const shop = await apiClient.get<Shop>(`/api/storefront/shops/${shopId}`);
      if (shop && shop.id) {
        return shop;
      }
      throw new Error('Bakery not found');
    } catch (err: any) {
      console.error(`[StorefrontAPI] getShopById(${shopId}) error:`, err);
      throw new Error(err.message || 'Failed to load bakery storefront.');
    }
  },

  searchShops: async (filters: ShopSearchFilters = {}): Promise<Shop[]> => {
    const params: Record<string, string> = {};
    if (filters.state && filters.state.trim() && !filters.state.toLowerCase().startsWith('all')) {
      params.state = filters.state.trim();
    }
    if (filters.district && filters.district.trim() && !filters.district.toLowerCase().startsWith('all')) {
      params.district = filters.district.trim();
    }
    if (filters.city && filters.city.trim() && !filters.city.toLowerCase().startsWith('all')) {
      params.city = filters.city.trim();
    }
    if (filters.area && filters.area.trim() && !filters.area.toLowerCase().startsWith('all')) {
      params.area = filters.area.trim();
    }
    if (filters.businessType && filters.businessType !== 'ALL' && filters.businessType.trim()) {
      params.businessType = filters.businessType.trim();
    }
    if (filters.search && filters.search.trim()) {
      params.search = filters.search.trim();
    }
    if (filters.location && filters.location.trim() && !filters.location.toLowerCase().startsWith('all')) {
      params.location = filters.location.trim();
    }

    try {
      const data = await apiClient.get<Shop[]>('/api/storefront/shops/search', { params });
      return Array.isArray(data) ? data : [];
    } catch (err: any) {
      console.error('[StorefrontAPI] searchShops error:', err);
      throw new Error(err.message || "We couldn't load bakeries right now.");
    }
  },

  getStorefrontProducts: async (shopId: number | string): Promise<Product[]> => {
    try {
      const prods = await apiClient.get<Product[]>(`/api/storefront/shops/${shopId}/products`);
      return Array.isArray(prods) ? prods : [];
    } catch (err: any) {
      console.error(`[StorefrontAPI] getStorefrontProducts(${shopId}) error:`, err);
      return [];
    }
  },

  getProductDetails: async (
    shopId: number | string,
    productId: number | string
  ): Promise<Product> => {
    return apiClient.get<Product>(`/api/storefront/shops/${shopId}/products/${productId}`);
  },

  getStorefrontCategories: async (shopId: number | string): Promise<Category[]> => {
    try {
      const data = await apiClient.get<Category[]>(`/api/storefront/shops/${shopId}/categories`);
      return Array.isArray(data) ? data : [];
    } catch (err: any) {
      console.error(`[StorefrontAPI] getStorefrontCategories(${shopId}) error:`, err);
      return [];
    }
  },

  validateCoupon: async (
    shopId: number | string,
    code: string,
    subtotal: number
  ): Promise<{
    valid: boolean;
    code?: string;
    discountType?: 'PERCENTAGE' | 'FLAT';
    discountValue?: number;
    discountAmount?: number;
    minOrderValue?: number;
    maxDiscountCap?: number;
    newSubtotal?: number;
    message?: string;
  }> => {
    return apiClient.post(
      `/api/storefront/shops/${shopId}/coupons/validate`,
      { code, subtotal }
    );
  },

  getShopFeedback: async (shopId: number | string): Promise<any[]> => {
    try {
      const data = await apiClient.get<any[]>(`/api/storefront/shops/${shopId}/feedback`);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  submitFeedback: async (
    shopId: number | string,
    payload: {
      customerDisplayName?: string;
      rating: number;
      comment: string;
      orderReference?: string;
    }
  ): Promise<any> => {
    return apiClient.post(`/api/storefront/shops/${shopId}/feedback`, payload);
  },
};
