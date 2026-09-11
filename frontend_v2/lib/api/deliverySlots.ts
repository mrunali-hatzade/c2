import { apiClient } from './client';
import { DeliverySlot, CreateDeliverySlotRequest } from '@/types/deliverySlot';

export const deliverySlotsApi = {
  getStorefrontSlots: async (shopId: number | string, date?: string): Promise<DeliverySlot[]> => {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return apiClient.get<DeliverySlot[]>(`/api/storefront/shops/${shopId}/delivery-slots${query}`);
  },

  getOwnerSlots: async (): Promise<DeliverySlot[]> => {
    return apiClient.get<DeliverySlot[]>('/api/owner/delivery-slots');
  },

  createSlot: async (slot: CreateDeliverySlotRequest): Promise<DeliverySlot> => {
    return apiClient.post<DeliverySlot>('/api/owner/delivery-slots', slot);
  },

  updateSlot: async (id: number, slot: CreateDeliverySlotRequest): Promise<DeliverySlot> => {
    return apiClient.put<DeliverySlot>(`/api/owner/delivery-slots/${id}`, slot);
  },

  toggleSlotStatus: async (id: number, isActive: boolean): Promise<DeliverySlot> => {
    return apiClient.patch<DeliverySlot>(`/api/owner/delivery-slots/${id}/status`, { isActive });
  },

  deleteSlot: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/api/owner/delivery-slots/${id}`);
  },
};
