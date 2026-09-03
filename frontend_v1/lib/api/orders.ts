
import { apiClient } from './client';

export interface OrderItem {
  id: number;
  productNameSnapshot: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  variantName?: string;
  dietaryPreference?: string;
  cakeMessage?: string;
  photoReferenceUrl?: string;
  addonsSummary?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  deliveryAddress?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
  discountAmount?: number;
  couponCode?: string;
  items: OrderItem[];
}

export async function getOwnerOrders(): Promise<Order[]> {
  const response = await apiClient<Order[]>('/api/owner/orders', { method: 'GET' });
  return response;
}

export async function getOrderDetails(id: number): Promise<Order> {
  const response = await apiClient<Order>(`/api/owner/orders/${id}`, { method: 'GET' });
  return response;
}

export async function updateOrderStatus(id: number, status: string): Promise<Order> {
  const response = await apiClient<Order>(`/api/owner/orders/${id}/status`, { 
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status })
  });
  return response;
}

export async function downloadInvoice(id: number, orderNumber: string): Promise<void> {
  // We can't easily use apiClient for blobs if it expects JSON. Let's use raw fetch.
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const response = await fetch(`${API_BASE_URL}/api/owner/orders/${id}/invoice`, {
    method: 'GET',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
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
}
