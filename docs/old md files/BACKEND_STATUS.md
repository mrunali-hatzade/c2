# CakeStore SaaS Platform — Backend Architectural & Module Status

**Version:** 1.0 (Phase 0 Audit)  
**Backend Framework:** Spring Boot 3.3.2 / Java 17 / Maven  
**Build Status:** Clean Compile (`mvn test` PASS: 34 tests, 0 failures)

---

## 1. Module-by-Module Classification

| Module | Classification | Controllers | Services | Repositories | Entities | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`modules/auth`** | `IMPLEMENTED` | `AuthController` | `AuthService` | `UserRepository` | `User` | Complete JWT authentication, registration, password hashing. |
| **`modules/shop`** | `IMPLEMENTED` | `ShopController`, `OwnerAnalyticsController`, `OwnerCouponController`, `OwnerCustomerController`, `OwnerDeliverySlotController`, `VerificationController`, `ShopPayoutController` | `ShopService`, `OwnerDashboardService`, `DeliverySlotService` | `ShopRepository`, `CouponRepository`, `ShopDeliverySlotRepository`, `ShopPayoutDetailsRepository`, `BusinessDocumentRepository` | `Shop`, `Coupon`, `ShopDeliverySlot`, `ShopPayoutDetails`, `BusinessDocument` | Complete multi-tenant isolation, location matching, metrics, and slots. |
| **`modules/product`** | `IMPLEMENTED` | `OwnerProductController` | `ProductService` | `ProductRepository`, `ProductVariantRepository`, `ProductAddonRepository` | `Product`, `ProductVariant`, `ProductAddon` | Full product catalog, weight/size variants, addons. |
| **`modules/order`** | `IMPLEMENTED` | `OwnerOrderController`, `WebhookController` | `OrderService` | `OrderRepository`, `OrderItemRepository` | `Order`, `OrderItem` | Complete order lifecycle, status history, PDF invoice generation. |
| **`modules/storefront`** | `IMPLEMENTED` | `CustomerStorefrontController`, `CustomerStorefrontEnquiryController` | `CustomerStorefrontService` | `ShopRepository`, `ProductRepository`, `CustomCakeRequestRepository`, `ShopDeliverySlotRepository` | Reads `Shop`, `Product`, creates `CustomCakeRequest` | Public search, bakery showcase, product detail retrieval, customer enquiry. |
| **`modules/interaction`** | `IMPLEMENTED` | `CustomerInteractionController`, `OwnerInteractionController` | `InteractionService`, `OwnerInteractionService` | `CustomCakeRequestRepository`, `EnquiryRepository`, `FeedbackRepository` | `CustomCakeRequest`, `Enquiry`, `Feedback` | Enquiries, custom cake requests, reviews, owner replies. |
| **`modules/subscription`** | `IMPLEMENTED` | `OwnerSubscriptionController` | `SubscriptionService` | `SubscriptionRepository`, `SubscriptionPlanRepository` | `Subscription`, `SubscriptionPlan` | Tiered plans, subscription period calculation, auto-renewal flag. |
| **`modules/admin`** | `IMPLEMENTED` | `AdminDashboardController`, `AdminSubscriptionPlanController`, `AdminMessageController` | `AdminDashboardService`, `SubscriptionService`, `NotificationService` | `ShopRepository`, `UserRepository`, `OrderRepository`, `SubscriptionPlanRepository` | Reads all entities | Complete admin stats, shop approvals/suspensions, broadcast messaging. |
| **`modules/notification`** | `IMPLEMENTED` | `NotificationController` | `NotificationService`, `SmsService` | `NotificationRepository` | `Notification` | In-app alerts, unread counts, SMS mock abstraction. |
| **`modules/payment`** | `PARTIAL / MOCK` | `OwnerPaymentController` | `PaymentService`, `RazorpayService` | `PaymentRepository` | `Payment` | Backend entity & mock checkout exist. Real Razorpay production keys needed. |
| **`modules/media`** | `IMPLEMENTED` | `MediaController` | `CloudinaryService` | None | None | Uploads to Cloudinary if keys present; falls back to local disk storage (`/uploads`). |
| **`modules/audit`** | `IMPLEMENTED` | None | `ActivityLoggerService` | `ActivityLogRepository` | `ActivityLog` | System-wide event logger. |
| **`modules/user`** | `IMPLEMENTED` | None (handled via Auth) | `UserService` | `UserRepository` | `User` | User entity, roles (`ROLE_CUSTOMER`, `ROLE_SHOP_OWNER`, `ROLE_ADMIN`). |
| **`security`** | `IMPLEMENTED` | None | `CustomUserDetailsService` | None | None | `SecurityConfig`, `JwtAuthenticationFilter`, `JwtTokenProvider`, `SubscriptionInterceptor`. |

---

## 2. Technical Findings in Backend

1. **No Duplicate Business Logic:** Controllers delegate cleanly to domain services.
2. **Mock Payment Functionality:**
   - `OwnerPaymentController.java` provides `POST /api/owner/payments/mock-checkout` which automatically marks subscription payments as `SUCCESS` for local development.
   - `RazorpayService.java` is integrated with Razorpay Java SDK `com.razorpay:razorpay-java:1.4.6`. It safely checks whether Razorpay API keys are configured before calling the Razorpay API.
3. **Missing Java Entity for `order_status_history`:**
   - Table `order_status_history` exists in PostgreSQL (created by `V9__order_lifecycle.sql`), but there is no dedicated JPA `@Entity` mapped to it (order status changes are currently updated directly on the `Order` entity). This does not block compilation or operation, but mapping a JPA entity would allow structured auditing.
4. **Subscription Interceptor:**
   - `SubscriptionInterceptor.java` checks whether a bakery's subscription is `ACTIVE` before allowing certain owner actions.
5. **Rate Limiting:**
   - `RateLimitingFilter.java` implements token-bucket rate limiting to protect public endpoints against abuse.
