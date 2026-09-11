import { apiClient } from './client';
import {
  AdminNotification,
  AdminNotificationCategory,
} from '@/types/adminNotifications';

export const adminNotificationsApi = {
  /**
   * Super Admin: Fetch notifications filtered by category, read state, or search.
   */
  async getNotifications(params?: {
    category?: AdminNotificationCategory;
    isRead?: boolean;
    search?: string;
  }): Promise<AdminNotification[]> {
    try {
      return await apiClient.get<AdminNotification[]>('/api/admin/notifications', { params });
    } catch (err: any) {
      if (err?.status === 404 || err?.status === 500) {
        return [];
      }
      throw err;
    }
  },

  /**
   * Super Admin: Get unread notifications count for badge.
   */
  async getUnreadCount(): Promise<number> {
    try {
      const res = await apiClient.get<{ unreadCount: number }>('/api/admin/notifications/unread-count');
      return res.unreadCount ?? 0;
    } catch (err: any) {
      return 0;
    }
  },

  /**
   * Super Admin: Mark single notification as read.
   */
  async markAsRead(id: string): Promise<void> {
    try {
      await apiClient.patch(`/api/admin/notifications/${id}/read`, {});
    } catch (err: any) {
      if (err?.status !== 404) {
        console.warn('Failed to mark notification read:', err);
      }
    }
  },

  /**
   * Super Admin: Mark all notifications as read.
   */
  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.post('/api/admin/notifications/mark-all-read', {});
    } catch (err: any) {
      if (err?.status !== 404) {
        console.warn('Failed to mark all notifications read:', err);
      }
    }
  },
};
