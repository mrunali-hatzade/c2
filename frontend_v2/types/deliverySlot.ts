export interface DeliverySlot {
  id: number;
  shopId?: number;
  dayOfWeek: string;
  name?: string;
  startTime: string; // HH:mm or HH:mm:ss
  endTime: string;   // HH:mm or HH:mm:ss
  maxOrders: number;
  maxOrdersPerDay?: number;
  isActive: boolean;
}

export interface CreateDeliverySlotRequest {
  dayOfWeek: string;
  name?: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  maxOrdersPerDay?: number;
  isActive: boolean;
}
