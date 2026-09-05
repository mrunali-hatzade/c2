import { apiClient } from './client';

export interface StorefrontOrderItemPayload {
  productId: number;
  productName?: string;
  unitPrice?: number;
  quantity: number;
  variantId?: number;
  variantName?: string;
  dietaryPreference?: 'REGULAR' | 'EGGLESS' | 'GLUTEN_FREE';
  cakeMessage?: string;
  photoReferenceUrl?: string;
  addonIds?: number[];
}

export interface GuestOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: 'COD' | 'ONLINE_PAYMENT';
  deliveryAddress: string;
  deliveryDate: string; // YYYY-MM-DD
  deliverySlotId: number;
  couponCode?: string;
  items: StorefrontOrderItemPayload[];
}

export interface DeliverySlotItem {
  id: number;
  slotName: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface OrderItemDetail {
  id: number;
  productNameSnapshot: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  variantName?: string;
  dietaryPreference?: string;
  cakeMessage?: string;
  addonsSummary?: string;
}

export interface PlacedOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  totalAmount: number;
  deliveryDate?: string;
  createdAt: string;
  items: OrderItemDetail[];
  shop?: {
    id: number;
    businessName: string;
    phone?: string;
    email?: string;
  };
}

/**
 * Fetch available delivery slots for a bakery storefront.
 */
export async function fetchStorefrontDeliverySlots(shopId: number): Promise<DeliverySlotItem[]> {
  try {
    return await apiClient<DeliverySlotItem[]>(`/api/storefront/shops/${shopId}/delivery-slots`);
  } catch {
    return [];
  }
}

/**
 * Place a guest order with a bakery shop.
 */
export async function submitGuestOrder(shopId: number, payload: GuestOrderPayload): Promise<PlacedOrder> {
  return apiClient<PlacedOrder>(`/api/storefront/shops/${shopId}/orders`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Track an order by its unique public orderNumber.
 */
export async function getOrderTracking(orderNumber: string): Promise<PlacedOrder> {
  return apiClient<PlacedOrder>(`/api/storefront/shops/orders/${encodeURIComponent(orderNumber)}`);
}

/**
 * URL for customer PDF invoice download.
 */
export function getInvoiceDownloadUrl(orderNumber: string): string {
  return `http://localhost:8080/api/storefront/shops/orders/${encodeURIComponent(orderNumber)}/invoice`;
}
