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

  updateOrderStatus: async (orderId: number, status: string): Promise<Order> => {
    return apiClient.patch<Order>(`/api/owner/orders/${orderId}/status`, { status });
  },

  getOrderDetails: async (id: number): Promise<Order> => {
    return apiClient.get<Order>(`/api/owner/orders/${id}`);
  },

  downloadInvoice: async (id: number, orderNumber: string): Promise<void> => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const token = typeof window !== 'undefined' ? localStorage.getItem('cakestore_token') : null;

    const response = await fetch(`${API_BASE_URL}/api/owner/orders/${id}/invoice`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error(`Failed to download invoice: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${orderNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
