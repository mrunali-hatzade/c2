import { apiClient } from './client';

export interface ShopDeliverySlot {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeliverySlotRequest {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  isActive: boolean;
}

export const deliverySlotApi = {
  getSlots: async (): Promise<ShopDeliverySlot[]> => {
    return apiClient<ShopDeliverySlot[]>('/api/owner/delivery-slots', { method: 'GET' });
  },

  createSlot: async (data: DeliverySlotRequest): Promise<ShopDeliverySlot> => {
    return apiClient<ShopDeliverySlot>('/api/owner/delivery-slots', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateSlot: async (id: number, data: DeliverySlotRequest): Promise<ShopDeliverySlot> => {
    return apiClient<ShopDeliverySlot>(`/api/owner/delivery-slots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  updateStatus: async (id: number, isActive: boolean): Promise<ShopDeliverySlot> => {
    return apiClient<ShopDeliverySlot>(`/api/owner/delivery-slots/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive })
    });
  },

  deleteSlot: async (id: number): Promise<void> => {
    await apiClient(`/api/owner/delivery-slots/${id}`, { method: 'DELETE' });
  }
};
