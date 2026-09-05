import { apiClient } from './client';

export interface FeedbackRecord {
  id: number;
  customerDisplayName: string;
  rating: number;
  comment?: string;
  orderReference?: string;
  ownerReply?: string;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all customer feedback reviews for the authenticated shop owner.
 */
export async function getOwnerFeedback(): Promise<FeedbackRecord[]> {
  return apiClient<FeedbackRecord[]>('/api/owner/feedback');
}

/**
 * Reply to a customer feedback review.
 */
export async function replyToFeedback(id: number, reply: string): Promise<FeedbackRecord> {
  return apiClient<FeedbackRecord>(`/api/owner/feedback/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ reply: reply.trim() }),
  });
}

/**
 * Moderation action: Delete a feedback review.
 */
export async function deleteFeedback(id: number): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/api/owner/feedback/${id}`, {
    method: 'DELETE',
  });
}
