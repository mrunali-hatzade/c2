import { apiClient } from './client';

export type NotificationType =
  | 'NEW_ORDER'
  | 'NEW_ENQUIRY'
  | 'NEW_FEEDBACK'
  | 'CUSTOM_ORDER_REQUEST'
  | 'ADMIN_MESSAGE'
  | 'SUBSCRIPTION_EXPIRING'
  | 'SUBSCRIPTION_EXPIRED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'DOCUMENT_VERIFICATION';

export interface NotificationRecord {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export const notificationsApi = {
  getNotifications: async (): Promise<NotificationRecord[]> => {
    return apiClient.get<NotificationRecord[]>('/api/notifications');
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await apiClient.get<UnreadCountResponse>('/api/notifications/unread-count');
    return res.unreadCount ?? 0;
  },

  markAsRead: async (id: number): Promise<void> => {
    await apiClient.patch(`/api/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/api/notifications/read-all');
  },
};