import { apiClient } from './client';
import { Order, GuestOrderRequest, OrderStatus } from '@/types/order';

export const ordersApi = {
  createGuestOrder: async (shopId: number | string, orderData: GuestOrderRequest): Promise<Order> => {
    return apiClient.post<Order>(`/api/storefront/shops/${shopId}/orders`, orderData);
  },

  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    return apiClient.get<Order>(`/api/storefront/orders/${orderNumber}`);
  },

  getOwnerOrders: async (status?: string): Promise<Order[]> => {
    return apiClient.get<Order[]>('/api/owner/orders', { params: { status } });
  },

  updateOrderStatus: async (orderId: number, status: OrderStatus): Promise<Order> => {
    return apiClient.patch<Order>(`/api/owner/orders/${orderId}/status`, { status });
  },
};
