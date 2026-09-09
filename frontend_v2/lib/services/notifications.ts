/**
 * Automated Alerts & Notification Staging Service (WhatsApp & SMS)
 * 
 * Prepares automated message templates and triggers for order confirmation,
 * kitchen dispatch, and customer touchpoints.
 * Ready for WhatsApp Cloud API / Twilio SMS production webhook activation.
 */

export interface OrderNotificationPayload {
  customerName: string;
  customerMobile: string;
  orderNumber: string;
  bakeryName: string;
  totalAmount: number;
  deliverySlot?: string;
  orderStatus: string;
}

export const notificationsService = {
  /**
   * Format phone number to international 91 standard
   */
  formatMobile: (mobile: string): string => {
    const cleaned = mobile.replace(/[^0-9]/g, '');
    if (cleaned.length === 10) return `91${cleaned}`;
    return cleaned;
  },

  /**
   * Build a direct WhatsApp web URL with pre-filled order status message
   */
  getWhatsAppUrl: (payload: OrderNotificationPayload): string => {
    const phone = notificationsService.formatMobile(payload.customerMobile);
    const message = `🎂 *Order Update from ${payload.bakeryName}*

Hello ${payload.customerName}!
Your celebration order *#${payload.orderNumber}* (₹${payload.totalAmount}) status is now: *${payload.orderStatus}*.
${payload.deliverySlot ? `🕒 Scheduled Delivery Slot: ${payload.deliverySlot}\n` : ''}
Thank you for choosing ${payload.bakeryName} on CakeStore!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  },

  /**
   * Trigger automated WhatsApp / SMS notification
   * In staging, logs payload. In production, posts to backend notification webhook.
   */
  dispatchAutomatedAlert: async (payload: OrderNotificationPayload): Promise<{ success: boolean; mode: 'staged' | 'live' }> => {
    const isLiveProduction = process.env.NEXT_PUBLIC_ENABLE_AUTOMATED_SMS === 'true';

    if (isLiveProduction) {
      try {
        const res = await fetch('/api/notifications/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        return { success: res.ok, mode: 'live' };
      } catch (err) {
        console.error('[NotificationService] Failed to dispatch live alert:', err);
        return { success: false, mode: 'live' };
      }
    }

    // Staged / Pilot mode: Pre-generate WhatsApp direct URL & log
    console.info(
      `[Notifications:Staged] Automated alert prepared for ${payload.customerName} (${payload.customerMobile}) - Order #${payload.orderNumber}: ${payload.orderStatus}`
    );
    return { success: true, mode: 'staged' };
  },
};
