import { apiClient } from './client';

export interface PublicReview {
  id: number;
  customerDisplayName: string;
  rating: number;
  reviewText: string;
  isVerifiedPurchase: boolean;
  ownerReply?: string;
  ownerRepliedAt?: string;
  createdAt: string;
}

export interface ProductReviewsSummary {
  productId: number;
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<number, number>;
  reviews: PublicReview[];
}

export interface OrderItemEligibility {
  orderItemId: number;
  productId?: number;
  productName: string;
  variantName?: string;
  isDelivered: boolean;
  hasReviewed: boolean;
  isEligible: boolean;
  existingReviewId?: number;
  existingRating?: number;
}

export interface SubmitReviewPayload {
  orderNumber: string;
  customerPhone: string;
  orderItemId: number;
  rating: number;
  reviewText?: string;
}

export interface OwnerProductReview {
  id: number;
  productId?: number;
  productName: string;
  productImage?: string;
  orderNumber: string;
  customerName: string;
  rating: number;
  reviewText: string;
  isVerifiedPurchase: boolean;
  ownerReply?: string;
  ownerRepliedAt?: string;
  createdAt: string;
}

export const reviewsApi = {
  getProductReviews: async (
    shopId: number | string,
    productId: number | string
  ): Promise<ProductReviewsSummary> => {
    try {
      return await apiClient.get<ProductReviewsSummary>(
        `/api/storefront/shops/${shopId}/products/${productId}/reviews`
      );
    } catch {
      return {
        productId: Number(productId),
        averageRating: 0.0,
        totalReviews: 0,
        ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        reviews: [],
      };
    }
  },

  submitProductReview: async (
    shopId: number | string,
    productId: number | string,
    payload: SubmitReviewPayload
  ): Promise<PublicReview> => {
    return apiClient.post<PublicReview>(
      `/api/storefront/shops/${shopId}/products/${productId}/reviews`,
      payload
    );
  },

  checkOrderEligibility: async (
    shopId: number | string,
    orderNumber: string,
    phone: string = ''
  ): Promise<OrderItemEligibility[]> => {
    try {
      return await apiClient.get<OrderItemEligibility[]>(
        `/api/storefront/shops/${shopId}/reviews/eligibility`,
        { params: { orderNumber, phone } }
      );
    } catch {
      return [];
    }
  },

  getOwnerProductReviews: async (): Promise<OwnerProductReview[]> => {
    return apiClient.get<OwnerProductReview[]>('/api/owner/product-reviews');
  },

  replyToProductReview: async (
    reviewId: number | string,
    reply: string
  ): Promise<OwnerProductReview> => {
    return apiClient.post<OwnerProductReview>(
      `/api/owner/product-reviews/${reviewId}/reply`,
      { reply }
    );
  },
};
