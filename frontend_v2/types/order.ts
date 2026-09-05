export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  customMessage?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  shopId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliverySlotId?: number;
  totalAmount: number;
  discountAmount?: number;
  status: OrderStatus;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
  items: OrderItem[];
}

export interface GuestOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliverySlotId?: number;
  specialInstructions?: string;
  couponCode?: string;
  items: {
    productId: number;
    quantity: number;
    customMessage?: string;
  }[];
}
