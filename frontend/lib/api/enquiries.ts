import { apiClient } from './client';

export interface CustomCakeRequest {
  id: number;
  customerName: string;
  customerEmail: string;
  customerMobile?: string;
  occasion?: string;
  cakeType?: string;
  flavour?: string;
  servings?: number;
  designDescription?: string;
  referenceImageUrl?: string;
  budget?: number;
  requiredDate?: string; // Format: YYYY-MM-DD
  deliveryPreference?: string;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED' | string;
  ownerResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneralEnquiry {
  id: number;
  customerName: string;
  customerEmail: string;
  enquiryType: string;
  message: string;
  ownerReply?: string;
  status: 'NEW' | 'REPLIED' | string;
  createdAt: string;
  updatedAt: string;
}

export interface ReplyPayload {
  reply: string;
}

/**
 * Fetch all custom cake requests for the authenticated shop owner.
 */
export async function getOwnerCustomCakeRequests(): Promise<CustomCakeRequest[]> {
  return apiClient<CustomCakeRequest[]>('/api/owner/custom-cakes');
}

/**
 * Update status and submit owner response for a custom cake request.
 */
export async function respondToCustomCakeRequest(
  id: number,
  status: string,
  reply?: string
): Promise<CustomCakeRequest> {
  const url = `/api/owner/custom-cakes/${id}/respond?status=${encodeURIComponent(status)}`;
  const body = reply && reply.trim() ? { reply: reply.trim() } : undefined;
  
  return apiClient<CustomCakeRequest>(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Fetch all general storefront inquiries for the authenticated shop owner.
 */
export async function getOwnerEnquiries(): Promise<GeneralEnquiry[]> {
  return apiClient<GeneralEnquiry[]>('/api/owner/enquiries');
}

/**
 * Reply to a general inquiry.
 */
export async function replyToGeneralEnquiry(
  id: number,
  reply: string
): Promise<GeneralEnquiry> {
  return apiClient<GeneralEnquiry>(`/api/owner/enquiries/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ reply: reply.trim() }),
  });
}
