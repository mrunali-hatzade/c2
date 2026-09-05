import { apiClient } from './client';

export interface SubscriptionPlanSummary {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  durationDays: number;
  features?: string;
  isActive: boolean;
}

export type SubscriptionStatusType = 
  | 'PENDING'
  | 'ACTIVE'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'GRACE_PERIOD'
  | 'SUSPENDED'
  | 'CANCELLED';

export interface SubscriptionRecord {
  id: number;
  plan?: SubscriptionPlanSummary | null;
  autoRenew: boolean;
  status: SubscriptionStatusType;
  amount: number;
  startDate?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMockResult {
  message: string;
  orderId: string;
  paymentId: string;
}

/**
 * Fetch the authenticated owner's current active or latest subscription.
 */
export async function getCurrentSubscription(): Promise<SubscriptionRecord | null> {
  try {
    return await apiClient<SubscriptionRecord>('/api/owner/subscriptions/current');
  } catch (err: unknown) {
    return null;
  }
}

/**
 * Process a test/pilot checkout payment to activate or renew the owner's subscription.
 */
export async function processMockSubscriptionPayment(amount: number): Promise<PaymentMockResult> {
  return apiClient<PaymentMockResult>('/api/owner/payments/mock-checkout', {
    method: 'POST',
    body: JSON.stringify({ amount: amount.toString() }),
  });
}
