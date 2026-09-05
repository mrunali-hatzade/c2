import { apiClient } from './client';
import { DeliverySlot, CreateDeliverySlotRequest } from '@/types/deliverySlot';

export const deliverySlotsApi = {
  getStorefrontSlots: async (shopId: number | string): Promise<DeliverySlot[]> => {
    return apiClient.get<DeliverySlot[]>(`/api/storefront/shops/${shopId}/delivery-slots`);
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

  deleteSlot: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/api/owner/delivery-slots/${id}`);
  },
};
