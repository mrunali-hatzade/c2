import { apiClient } from './client';

export interface OrderItemSummary {
  id: number;
  productNameSnapshot: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CustomerOrderSummary {
  id: number;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  deliveryAddress?: string;
  createdAt: string;
  items?: OrderItemSummary[];
}

export interface CustomerProfile {
  name: string;
  email: string;
  mobile?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  orderHistory?: CustomerOrderSummary[];
}

/**
 * Fetch all unique customer profiles for the authenticated shop owner.
 */
export async function getOwnerCustomers(): Promise<CustomerProfile[]> {
  return apiClient<CustomerProfile[]>('/api/owner/customers');
}

/**
 * Fetch detailed profile and order history for a specific customer email.
 */
export async function getCustomerProfile(email: string): Promise<CustomerProfile> {
  return apiClient<CustomerProfile>(`/api/owner/customers/${encodeURIComponent(email)}`);
}
