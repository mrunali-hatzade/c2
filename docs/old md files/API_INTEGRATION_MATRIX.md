# CakeStore SaaS Platform — API Integration Matrix

**Version:** 1.0 (Phase 0 Audit)  
**Total Backend Endpoints:** 63  
**Audited Against:** Live Spring Boot Backend, Controllers, Services, Repositories, PostgreSQL Database, and Frontend API Clients.

---

## 1. Active Frontend to Backend Integrations

### A. Customer Marketplace & Public Storefront

| Frontend Consumer | Method | Endpoint | Backend Controller | Backend Service | DB Entity / Table | Auth Req? | Role Req? | Real / Mock? | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `lib/api/storefront.ts` (`fetchShops`) | `GET` | `/api/storefront/shops/search` | `CustomerStorefrontController` | `CustomerStorefrontService` | `Shop` / `shops` | No (Public) | None | **REAL** | **VERIFIED ✅** |
| `lib/api/storefront.ts` (`fetchShopDetails`) | `GET` | `/api/storefront/shops/{shopId}` | `CustomerStorefrontController` | `CustomerStorefrontService` | `Shop` / `shops` | No (Public) | None | **REAL** | **VERIFIED ✅** |
| `lib/api/storefront.ts` (`fetchShopProducts`) | `GET` | `/api/storefront/shops/{shopId}/products` | `CustomerStorefrontController` | `CustomerStorefrontService` | `Product` / `products` | No (Public) | None | **REAL** | **VERIFIED ✅** |
| `lib/api/storefront.ts` (`fetchProductDetails`) | `GET` | `/api/storefront/shops/{shopId}/products/{productId}` | `CustomerStorefrontController` | `CustomerStorefrontService` | `Product` / `products` | No (Public) | None | **REAL** | **VERIFIED ✅** |
| `lib/api/storefront.ts` (`submitProductEnquiry`) | `POST` | `/api/storefront/enquiries` | `CustomerStorefrontEnquiryController` | `CustomerStorefrontService` | `CustomCakeRequest` / `custom_cake_requests` | No (Public) | None | **REAL** | **VERIFIED ✅** |

---

### B. Owner Authentication & Onboarding

| Frontend Consumer | Method | Endpoint | Backend Controller | Backend Service | DB Entity / Table | Auth Req? | Role Req? | Real / Mock? | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `lib/api/auth.ts` (`loginOwner`) | `POST` | `/api/auth/login` | `AuthController` | `AuthService` | `User` / `users` | No (Public) | None | **REAL** | **VERIFIED ✅** |
| `lib/api.ts` (`registerOwner`) | `POST` | `/api/auth/register` (mapped from `/api/auth`) | `AuthController` | `AuthService` | `User`, `Shop` / `users`, `shops` | No (Public) | None | **REAL** | **VERIFIED ✅** |

---

### C. Owner Dashboard Operations

| Frontend Consumer | Method | Endpoint | Backend Controller | Backend Service | DB Entity / Table | Auth Req? | Role Req? | Real / Mock? | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `app/dashboard/owner/page.tsx` | `GET` | `/api/shops/my-shop/stats` | `ShopController` | `OwnerDashboardService` | `Product`, `Order` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/products.ts` (`getOwnerProducts`) | `GET` | `/api/owner/products` | `OwnerProductController` | `ProductService` | `Product` / `products` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/products.ts` (`createOwnerProduct`) | `POST` | `/api/owner/products` | `OwnerProductController` | `ProductService` | `Product`, `ProductVariant`, `ProductAddon` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/products.ts` (`updateOwnerProduct`) | `PUT` | `/api/owner/products/{id}` | `OwnerProductController` | `ProductService` | `Product`, `ProductVariant`, `ProductAddon` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/products.ts` (`deleteOwnerProduct`) | `DELETE` | `/api/owner/products/{id}` | `OwnerProductController` | `ProductService` | `Product` / `products` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/products.ts` (`uploadProductImage`) | `POST` | `/api/owner/media/upload` | `MediaController` | `CloudinaryService` | Local / Cloudinary | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/orders.ts` (`getOwnerOrders`) | `GET` | `/api/owner/orders` | `OwnerOrderController` | `OrderService` | `Order` / `orders` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/orders.ts` (`getOrderDetails`) | `GET` | `/api/owner/orders/{id}` | `OwnerOrderController` | `OrderService` | `Order`, `OrderItem` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/orders.ts` (`updateOrderStatus`) | `PATCH` | `/api/owner/orders/{id}/status` | `OwnerOrderController` | `OrderService` | `Order` / `orders` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/orders.ts` (`downloadInvoice`) | `GET` | `/api/owner/orders/{id}/invoice` | `OwnerOrderController` | `OrderService` | `Order` / `orders` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/deliverySlots.ts` (`getSlots`) | `GET` | `/api/owner/delivery-slots` | `OwnerDeliverySlotController` | `DeliverySlotService` | `ShopDeliverySlot` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/deliverySlots.ts` (`createSlot`) | `POST` | `/api/owner/delivery-slots` | `OwnerDeliverySlotController` | `DeliverySlotService` | `ShopDeliverySlot` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/deliverySlots.ts` (`updateSlot`) | `PUT` | `/api/owner/delivery-slots/{id}` | `OwnerDeliverySlotController` | `DeliverySlotService` | `ShopDeliverySlot` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/deliverySlots.ts` (`updateStatus`) | `PATCH` | `/api/owner/delivery-slots/{id}/status` | `OwnerDeliverySlotController` | `DeliverySlotService` | `ShopDeliverySlot` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |
| `lib/api/deliverySlots.ts` (`deleteSlot`) | `DELETE` | `/api/owner/delivery-slots/{id}` | `OwnerDeliverySlotController` | `DeliverySlotService` | `ShopDeliverySlot` | Yes (JWT) | `ROLE_SHOP_OWNER` | **REAL** | **VERIFIED ✅** |

---

## 2. Backend Endpoints with Missing Frontend Consumers (`BACKEND EXISTS / FRONTEND MISSING`)

The following 46 endpoints are implemented and unit tested on the backend, but currently have **NO** frontend consumer screens:

### A. Admin Endpoints (Frontend Completely Missing)
| Method | Endpoint | Controller | Service | Purpose | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard/stats` | `AdminDashboardController` | `AdminDashboardService` | Platform total shops, orders, revenue, active bakeries | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/admin/shops` | `AdminDashboardController` | `AdminDashboardService` | List all platform shops with status filters | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/admin/shops/{shopId}` | `AdminDashboardController` | `AdminDashboardService` | Full bakery verification & audit details | `BACKEND EXISTS / FRONTEND MISSING` |
| `PATCH` | `/api/admin/shops/{shopId}/status` | `AdminDashboardController` | `AdminDashboardService` | Approve, Reject, Inactivate, or Suspend shop | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/admin/messages` | `AdminMessageController` | `NotificationService` | Broadcast platform announcements to bakers | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/admin/plans` | `AdminSubscriptionPlanController` | `SubscriptionService` | View all platform SaaS pricing plans | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/admin/plans` | `AdminSubscriptionPlanController` | `SubscriptionService` | Create new SaaS pricing plan | `BACKEND EXISTS / FRONTEND MISSING` |
| `PUT` | `/api/admin/plans/{id}` | `AdminSubscriptionPlanController` | `SubscriptionService` | Update SaaS pricing plan | `BACKEND EXISTS / FRONTEND MISSING` |
| `PATCH` | `/api/admin/plans/{id}/status` | `AdminSubscriptionPlanController` | `SubscriptionService` | Toggle SaaS pricing plan active/inactive | `BACKEND EXISTS / FRONTEND MISSING` |

### B. Owner Enquiries, Custom Cakes & CRM Endpoints (Frontend Missing)
| Method | Endpoint | Controller | Service | Purpose | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/owner/custom-cakes` | `OwnerInteractionController` | `OwnerInteractionService` | List all incoming custom cake enquiries | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/owner/custom-cakes/{id}/respond` | `OwnerInteractionController` | `OwnerInteractionService` | Respond to custom cake enquiry with quote | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/owner/enquiries` | `OwnerInteractionController` | `OwnerInteractionService` | List general customer enquiries | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/owner/enquiries/{id}/reply` | `OwnerInteractionController` | `OwnerInteractionService` | Reply to customer enquiry | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/owner/customers` | `OwnerCustomerController` | `ShopService` | View customer CRM list & spend totals | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/owner/customers/{email}` | `OwnerCustomerController` | `ShopService` | Customer profile & order history | `BACKEND EXISTS / FRONTEND MISSING` |

### C. Owner Analytics, Coupons, Reviews & Settings Endpoints (Frontend Missing)
| Method | Endpoint | Controller | Service | Purpose | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/owner/analytics/dashboard` | `OwnerAnalyticsController` | `ShopService` | Daily/weekly revenue and order volume trends | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/owner/coupons` | `OwnerCouponController` | `ShopService` | List bakery discount coupon codes | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/owner/coupons` | `OwnerCouponController` | `ShopService` | Create bakery discount coupon code | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/owner/feedback` | `OwnerInteractionController` | `OwnerInteractionService` | List customer ratings & reviews | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/owner/feedback/{id}/reply` | `OwnerInteractionController` | `OwnerInteractionService` | Post owner public reply to review | `BACKEND EXISTS / FRONTEND MISSING` |
| `DELETE` | `/api/owner/feedback/{id}` | `OwnerInteractionController` | `OwnerInteractionService` | Moderation flag / delete feedback | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/shops/my-shop` | `ShopController` | `ShopService` | Get bakery profile settings | `BACKEND EXISTS / FRONTEND MISSING` |
| `PUT` | `/api/shops/my-shop` | `ShopController` | `ShopService` | Update bakery profile, address, contact | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/shops/my-shop/payouts` | `ShopPayoutController` | `ShopService` | Get bank payout details & UPI ID | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/shops/my-shop/payouts` | `ShopPayoutController` | `ShopService` | Save bank payout details & UPI ID | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/owner/subscriptions/current` | `OwnerSubscriptionController` | `SubscriptionService` | Current subscription tier, expiry, auto-renew | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/owner/payments/mock-checkout` | `OwnerPaymentController` | `PaymentService` | Simulate subscription renewal payment | `BACKEND EXISTS / FRONTEND MISSING` |

### D. Customer Storefront Ordering & Reviews Endpoints (Frontend Missing)
| Method | Endpoint | Controller | Service | Purpose | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/storefront/shops/{shopId}/delivery-slots` | `CustomerStorefrontController` | `CustomerStorefrontService` | Fetch available delivery slots for checkout | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/storefront/shops/{shopId}/orders` | `CustomerStorefrontController` | `CustomerStorefrontService` | Place guest/customer order with items & slot | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/storefront/shops/orders/{orderNumber}/invoice` | `CustomerStorefrontController` | `CustomerStorefrontService` | Customer order invoice download | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/storefront/shops/{shopId}/custom-cakes` | `CustomerInteractionController` | `InteractionService` | Submit custom cake request via storefront | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/storefront/shops/{shopId}/feedback` | `CustomerInteractionController` | `InteractionService` | View customer ratings & reviews on storefront | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/storefront/shops/{shopId}/feedback` | `CustomerInteractionController` | `InteractionService` | Submit rating & review after purchase | `BACKEND EXISTS / FRONTEND MISSING` |

### E. Notifications & System Webhooks
| Method | Endpoint | Controller | Service | Purpose | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | `NotificationController` | `NotificationService` | In-app notification feed | `BACKEND EXISTS / FRONTEND MISSING` |
| `GET` | `/api/notifications/unread-count` | `NotificationController` | `NotificationService` | Notification badge counter | `BACKEND EXISTS / FRONTEND MISSING` |
| `PATCH` | `/api/notifications/{id}/read` | `NotificationController` | `NotificationService` | Mark notification read | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/webhooks/razorpay` | `WebhookController` | `PaymentService` | Razorpay payment webhook callback | `BACKEND EXISTS / (Awaiting Live Webhook)` |
| `GET` | `/api/verification/documents` | `VerificationController` | `ShopService` | Document status check | `BACKEND EXISTS / FRONTEND MISSING` |
| `POST` | `/api/verification/documents` | `VerificationController` | `ShopService` | Supplementary document upload | `BACKEND EXISTS / FRONTEND MISSING` |
