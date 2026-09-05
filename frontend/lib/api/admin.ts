import { apiClient } from './client';

export interface DashboardStats {
  totalShops: number;
  activeShops: number;
  suspendedShops: number;
  pendingShops: number;
  totalUsers: number;
  totalRevenue: number;
}

export interface AdminShopSummary {
  shopId: number;
  businessName: string;
  ownerName?: string;
  ownerEmail?: string;
  shopStatus: string;
  registeredAt: string;
}

export interface AdminShopDetails {
  shop: {
    id: number;
    businessName: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    fssaiRegistration?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  subscriptions?: any[];
  payments?: any[];
  activityLogs?: any[];
  totalProducts: number;
  totalOrders: number;
}

export interface AdminPlan {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  durationDays: number;
  features?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminMessagePayload {
  title: string;
  message: string;
  specificOwnerId?: number;
  sendEmail?: boolean;
}

/**
 * Fetch top-level platform statistics for Admin Dashboard.
 */
export async function getPlatformStats(): Promise<DashboardStats> {
  return apiClient<DashboardStats>('/api/admin/dashboard/stats');
}

/**
 * Fetch all registered bakery shops across the platform.
 */
export async function getAllAdminShops(): Promise<AdminShopSummary[]> {
  return apiClient<AdminShopSummary[]>('/api/admin/shops');
}

/**
 * Fetch deep operational details for a specific bakery shop.
 */
export async function getAdminShopDetails(shopId: number): Promise<AdminShopDetails> {
  return apiClient<AdminShopDetails>(`/api/admin/shops/${shopId}`);
}

/**
 * Update shop operational status (ACTIVE, SUSPENDED, INACTIVE).
 */
export async function updateShopStatus(shopId: number, status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'): Promise<any> {
  return apiClient<any>(`/api/admin/shops/${shopId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * Fetch platform subscription plans.
 */
export async function getAdminPlans(): Promise<AdminPlan[]> {
  return apiClient<AdminPlan[]>('/api/admin/plans');
}

/**
 * Toggle plan active status.
 */
export async function togglePlanStatus(id: number, isActive: boolean): Promise<AdminPlan> {
  return apiClient<AdminPlan>(`/api/admin/plans/${id}/status?isActive=${isActive}`, {
    method: 'PATCH',
  });
}

/**
 * Broadcast an announcement message to all or specific bakery owners.
 */
export async function sendAdminMessage(payload: AdminMessagePayload): Promise<string> {
  return apiClient<string>('/api/admin/messages', {
    method: 'POST',
    body: JSON.stringify({
      title: payload.title,
      message: payload.message,
      specificOwnerId: payload.specificOwnerId || null,
      sendEmail: payload.sendEmail || false,
    }),
  });
}
