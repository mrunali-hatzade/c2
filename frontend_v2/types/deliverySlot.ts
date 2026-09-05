export interface DeliverySlot {
  id: number;
  shopId: number;
  name: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  maxOrdersPerDay: number;
  isActive: boolean;
}

export interface CreateDeliverySlotRequest {
  name: string;
  startTime: string;
  endTime: string;
  maxOrdersPerDay: number;
  isActive: boolean;
}
