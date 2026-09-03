# CakeStore SaaS Platform — Comprehensive Project Inventory

**Document Version:** 1.0 (Phase 0 Audit)  
**Date:** September 2026  
**Audited Against:** Actual Source Code, PostgreSQL 18, Cake_Platform_PRD_Final.md, CakeStore_Frontend_PRD_v2.md, and Official UI References.

---

## A. Project Overview

CakeStore is a multi-tenant B2B2C SaaS platform built for independent bakery and cake business owners. It provides three interconnected core experiences within a single unified platform:

1. **Customer Marketplace & Public Storefronts:** Location-based bakery discovery (State → District → City → Area/Village), categorized bakery profiles, real product showcases, and customer cake enquiries/ordering.
2. **Shop Owner Dashboard:** Dedicated bakery workspace for managing cake catalogues, variants, addons, delivery/pickup slots, incoming orders, customer enquiries, and subscription renewals.
3. **Platform Admin Panel:** Centralized oversight dashboard for platform administrators to review new bakery registrations, approve/reject/suspend shops, manage subscription plans, and review platform-wide metrics.

---

## B. Technology Stack

| Layer | Technologies | Current State |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14.2.5 (App Router), React 18, TypeScript | Production build passing |
| **Styling & Icons** | Tailwind CSS 3.4.1, Lucide React, Custom Theme (Ruby Crimson, Plum, Warm Cream) | Implemented & verified |
| **Backend Framework** | Java 17, Spring Boot 3.3.2, Maven, Spring Security 6 | Compiled & passing all tests |
| **Database & ORM** | PostgreSQL 18, Hibernate 6, Spring Data JPA, Flyway 10 | 21 tables created, 9 migrations |
| **Authentication** | JWT (Stateless Bearer Token, JJWT 0.12.5), BCrypt password hashing | Implemented |
| **Payments** | Razorpay SDK (Backend client exists, mock checkout available) | Backend ready, live keys pending |
| **Media / File Storage** | Cloudinary / Local filesystem fallback | Implemented |
| **API Client** | Native Fetch wrapper (`apiClient`), central header & error handling | Implemented |
| **Testing** | JUnit 5, Mockito, VS Code REST Client (`.http`), Node.js verification suites | 34 backend tests passing, 12 e2e |

---

## C. Backend Architecture

The backend (`backend/src/main/java/com/cakeplatform/api`) follows a modular Spring Boot domain-driven package layout:

- **`modules/auth`**: User registration, login, JWT token issuance, password encryption.
- **`modules/shop`**: Shop entity, multi-tenant owner linkage, location hierarchy, status lifecycle, payout details, delivery slots, analytics, and coupons.
- **`modules/product`**: Product catalog, multi-tier pricing, product variants (weights/sizes), and addons (candles, toppers).
- **`modules/order`**: Order lifecycle, order items with customization snapshots, delivery slot associations, status transitions, and PDF invoices.
- **`modules/storefront`**: Public customer endpoints for marketplace search, bakery profiles, real product retrieval, and customer enquiries.
- **`modules/interaction`**: Customer enquiries, custom cake requests, customer feedback/reviews, owner replies.
- **`modules/subscription`**: Tiered subscription plans, shop subscription lifecycle, auto-renewal flags.
- **`modules/admin`**: Platform admin statistics, shop approval/suspension workflows, subscription plan CRUD.
- **`modules/notification`**: Internal user notifications and admin broadcast messaging.
- **`modules/audit`**: System-wide activity logging (`ActivityLog`).
- **`modules/media`**: File upload handler (Cloudinary integration + local fallback).
- **`modules/payment`**: Payment tracking, Razorpay webhook receiver, mock checkout.

---

## D. Frontend Architecture

The active frontend (`frontend_v1/`) is structured using Next.js App Router:

- **`app/`**: Route handlers and pages.
  - Public Marketplace: `/`, `/explore`, `/how-it-works`, `/pricing`, `/for-owners`, `/contact`
  - Public Storefront: `/shop/[id]` (Canonical), `/shops/[id]` (Redirects to `/shop/[id]`)
  - Authentication: `/(auth)/login`
  - Onboarding: `/onboarding` (4-step multi-page wizard with persistent context)
  - Owner Dashboard: `/dashboard/owner`, `/dashboard/owner/orders`, `/dashboard/owner/products`, `/dashboard/owner/delivery-slots`
- **`components/`**:
  - `layout/`: Navbar, Footer, AnnouncementBar, MobileMenu
  - `marketplace/`: HeroSection, BakeryGrid, BakeryCard, LocationFilterBar, BusinessCategoryTabs, HowItWorks, TrustBenefits, OwnerCTA, CustomerTestimonials
  - `storefront-v2/`: ProductDetailModal (Real product showcase + customer enquiry flow)
  - `dashboard/`: DashboardLayoutWrapper, Sidebar, Header
- **`lib/`**:
  - `api/`: Centralized HTTP clients (`client.ts`, `auth.ts`, `storefront.ts`, `products.ts`, `orders.ts`, `deliverySlots.ts`)
  - `constants/`: Category mappings, development fallback data
- **`data/`**: State/district/city/village location hierarchy datasets (`locations.ts`)
- **`types/`**: TypeScript interfaces for shops, products, orders, delivery slots, and enquiries.

---

## E. Database Architecture

PostgreSQL contains 21 relational tables managed through Flyway:
1. `users`: Platform credentials, roles (`CUSTOMER`, `SHOP_OWNER`, `ADMIN`), status.
2. `shops`: Bakery tenant entity with geographical fields (`state`, `district`, `city`, `area`, `pincode`, `lat`, `lng`), business metadata, FSSAI registration, and verification status.
3. `products`: Bakery menu items, base price, image URL, availability toggle.
4. `product_variants`: Weight/size variations (`0.5 kg`, `1 kg`, etc.) linked to products.
5. `product_addons`: Extra addons (sparkle candles, photo print) linked to products.
6. `shop_delivery_slots`: Weekly recurring order delivery/pickup capacity slots.
7. `orders`: Order header, guest/customer details, order number, delivery slot link, payment status, order status.
8. `order_items`: Order line items with snapshot of product name, variant, customization message, and dietary preference.
9. `order_status_history`: Audit log of order status transitions.
10. `coupons`: Bakery-specific promotional discount codes.
11. `custom_cake_requests`: Dedicated custom cake enquiry and lead pipeline.
12. `enquiries`: General customer inquiries to bakery owners.
13. `feedback`: Customer ratings, reviews, and owner responses.
14. `subscriptions`: Shop subscription periods and statuses.
15. `subscription_plans`: Admin-configured SaaS subscription plans.
16. `payments`: Payment audit logs, provider references (Razorpay), statuses.
17. `shop_payout_details`: Owner bank details, UPI ID, and settlement info.
18. `business_documents`: Verification documents (FSSAI licenses, ID proofs) uploaded by owners.
19. `notifications`: In-app notification alerts for users.
20. `activity_logs`: Administrative and security action log.
21. `flyway_schema_history`: Flyway migration tracking table.

---

## F. Authentication Architecture

- **Stateless JWT:** Handled by Spring Security 6 with `JwtAuthenticationFilter` and `JwtTokenProvider`.
- **Bearer Tokens:** Transmitted via HTTP `Authorization: Bearer <token>`.
- **Client Storage:** Managed in `localStorage` under `authToken`.
- **Public Whitelist (`permitAll`):**
  - `/api/auth/**`
  - `/api/storefront/**`
  - `/uploads/**`
  - `/error`
- **Authenticated:** All `/api/owner/**`, `/api/admin/**`, `/api/shops/my-shop/**` endpoints require a valid JWT.

---

## G. Authorization & Roles

Three user roles defined in `Role.java`:
1. `ROLE_CUSTOMER`: Browse marketplace, view storefront, submit enquiries, place guest/customer orders.
2. `ROLE_SHOP_OWNER`: Access owner dashboard, manage shop profile, products, delivery slots, orders, and view analytics.
3. `ROLE_ADMIN`: Access admin dashboard, approve/reject bakeries, change shop status, configure subscription plans, inspect system logs.

---

## H. Customer Features

| Feature | PRD Reference | Status | Verification Detail |
| :--- | :--- | :--- | :--- |
| **Marketplace Landing** | PRD v2 §4.1 | `[IMPLEMENTED]` | Real location filtering, active shop discovery, category tabs |
| **Location Discovery** | PRD v2 §4.1.2 | `[IMPLEMENTED]` | 4-tier filtering (State, District, City, Area) against real PostgreSQL data |
| **Bakery Search** | PRD v2 §4.1.1 | `[IMPLEMENTED]` | Full-text search on bakery name, description, and products |
| **Bakery Storefront** | PRD v2 §4.2 | `[IMPLEMENTED]` | `/shop/[id]` canonical profile with FSSAI, contact, status badge, cover, logo |
| **Product Showcase** | PRD v2 §4.2.2 | `[IMPLEMENTED]` | Active products strictly isolated to requested bakery |
| **Product Detail Modal** | PRD v2 §4.2.3 | `[IMPLEMENTED]` | Real product imagery, pricing, variants, addons, availability |
| **Customer Cake Enquiry** | PRD v2 §4.2.4 | `[IMPLEMENTED]` | Reuses `custom_cake_requests`, stores PENDING request, WhatsApp trigger |
| **Guest Cart & Checkout** | PRD v2 §4.3 | `[PARTIALLY IMPLEMENTED]` | Backend endpoint `/api/storefront/shops/{id}/orders` exists; frontend checkout modal not yet linked |
| **Order Status Tracking** | PRD v2 §4.4 | `[PARTIALLY IMPLEMENTED]` | Backend invoice & order lookup exist; customer tracking UI not yet built |
| **Customer Reviews** | PRD v2 §4.2.5 | `[BACKEND EXISTS / FRONTEND MISSING]` | Backend tables & controllers exist; public review submission UI not yet built |

---

## I. Owner Features

| Feature | PRD Reference | Status | Verification Detail |
| :--- | :--- | :--- | :--- |
| **Owner Registration** | PRD Final §4.1 | `[IMPLEMENTED]` | 4-step onboarding wizard at `/onboarding`, uploads docs, calls `/api/auth/register` |
| **Owner Login** | PRD Final §4.2 | `[IMPLEMENTED]` | Dedicated login page at `/(auth)/login`, JWT stored, redirects to dashboard |
| **Dashboard Overview** | PRD Final §4.3 | `[IMPLEMENTED]` | `/dashboard/owner` displays real stats via `GET /api/shops/my-shop/stats` |
| **Product Management** | PRD Final §4.4 | `[IMPLEMENTED]` | `/dashboard/owner/products`: Full CRUD, variants, addons, image upload |
| **Order Management** | PRD Final §4.5 | `[IMPLEMENTED]` | `/dashboard/owner/orders`: Order listing, status transitions, invoice download |
| **Delivery Slots** | PRD Final §4.6 | `[IMPLEMENTED]` | `/dashboard/owner/delivery-slots`: Full CRUD and day/time slot toggles |
| **Enquiries Management** | PRD Final §4.7 | `[BACKEND EXISTS / FRONTEND MISSING]` | Backend endpoints `/api/owner/enquiries` and `/api/owner/custom-cakes` exist |
| **Customer Database** | PRD Final §4.8 | `[BACKEND EXISTS / FRONTEND MISSING]` | Backend `/api/owner/customers` exists |
| **Coupon Management** | PRD Final §4.9 | `[BACKEND EXISTS / FRONTEND MISSING]` | Backend `/api/owner/coupons` exists |
| **Reviews & Feedback** | PRD Final §4.10 | `[BACKEND EXISTS / FRONTEND MISSING]` | Backend `/api/owner/feedback` exists |
| **Analytics Dashboard** | PRD Final §4.11 | `[BACKEND EXISTS / FRONTEND MISSING]` | Backend `/api/owner/analytics/dashboard` exists |
| **Subscription & Billing** | PRD Final §4.12 | `[BACKEND EXISTS / FRONTEND MISSING]` | Backend `/api/owner/subscriptions/current` exists |
| **Shop Settings** | PRD Final §4.13 | `[BACKEND EXISTS / FRONTEND MISSING]` | Backend `GET/PUT /api/shops/my-shop` exists |

---

## J. Admin Features

| Feature | PRD Reference | Status | Verification Detail |
| :--- | :--- | :--- | :--- |
| **Admin Login** | PRD Final §5.1 | `[PARTIALLY IMPLEMENTED]` | Backend auth supports `ROLE_ADMIN`; dedicated admin login UI not yet built |
| **Platform Stats** | PRD Final §5.2 | `[BACKEND EXISTS / FRONTEND MISSING]` | `GET /api/admin/dashboard/stats` exists in backend |
| **Bakery Directory** | PRD Final §5.3 | `[BACKEND EXISTS / FRONTEND MISSING]` | `GET /api/admin/shops` exists in backend |
| **Bakery Approval/Status** | PRD Final §5.4 | `[BACKEND EXISTS / FRONTEND MISSING]` | `PATCH /api/admin/shops/{id}/status` exists in backend |
| **Subscription Plans** | PRD Final §5.5 | `[BACKEND EXISTS / FRONTEND MISSING]` | Full CRUD `/api/admin/plans` exists in backend |
| **Broadcast Messages** | PRD Final §5.6 | `[BACKEND EXISTS / FRONTEND MISSING]` | `POST /api/admin/messages` exists in backend |

---

## K. API Inventory (63 Endpoints)

- **Storefront & Public:** 11 endpoints
- **Authentication:** 3 endpoints
- **Owner Operations:** 27 endpoints
- **Admin Operations:** 9 endpoints
- **Notifications & Verification:** 5 endpoints
- **Media & Webhooks:** 2 endpoints
- **Payouts & Subscriptions:** 6 endpoints

*(Complete detailed breakdown provided in `API_INTEGRATION_MATRIX.md`)*

---

## L. Frontend Route Inventory

| Route | Role | Purpose | Backend API Connected | Status | Source File |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Customer | Marketplace Home & Search | `/api/storefront/shops/search` | `[IMPLEMENTED]` | `app/page.tsx` |
| `/explore` | Customer | Explore Bakeries Grid | Client-side filter wrapper | `[IMPLEMENTED]` | `app/explore/page.tsx` |
| `/shop/[id]` | Customer | Bakery Storefront & Showcase | `/api/storefront/shops/{id}`, `/products` | `[IMPLEMENTED]` | `app/shop/[id]/page.tsx` |
| `/shops/[id]` | Customer | Legacy URL Redirection | Redirects to `/shop/[id]` | `[IMPLEMENTED]` | `app/shops/[id]/page.tsx` |
| `/checkout` | Customer | Standalone Checkout page | Old prototype | `[MOCK / PARTIAL]` | `app/checkout/page.tsx` |
| `/how-it-works` | Customer | How Platform Works | Static information | `[IMPLEMENTED]` | `app/how-it-works/page.tsx` |
| `/pricing` | Owner | SaaS Subscription Pricing | Static information | `[IMPLEMENTED]` | `app/pricing/page.tsx` |
| `/for-owners` | Owner | Why Sell on CakeStore | Static information | `[IMPLEMENTED]` | `app/for-owners/page.tsx` |
| `/contact` | Customer | Support contact form | Static information | `[IMPLEMENTED]` | `app/contact/page.tsx` |
| `/(auth)/login` | Owner/Admin | User Login | `/api/auth/login` | `[IMPLEMENTED]` | `app/(auth)/login/page.tsx` |
| `/onboarding` | Owner | Registration Wizard Intro | Context initialization | `[IMPLEMENTED]` | `app/onboarding/page.tsx` |
| `/onboarding/step-1` | Owner | Personal Info Input | Wizard state | `[IMPLEMENTED]` | `app/onboarding/step-1/page.tsx` |
| `/onboarding/step-2` | Owner | Bakery Info Input | Wizard state | `[IMPLEMENTED]` | `app/onboarding/step-2/page.tsx` |
| `/onboarding/step-3` | Owner | Bakery Location Input | Wizard state | `[IMPLEMENTED]` | `app/onboarding/step-3/page.tsx` |
| `/onboarding/step-4` | Owner | Document Upload & Submit | `/api/auth/register` | `[IMPLEMENTED]` | `app/onboarding/step-4/page.tsx` |
| `/dashboard/owner` | Owner | Owner Dashboard Home | `/api/shops/my-shop/stats` | `[IMPLEMENTED]` | `app/dashboard/owner/page.tsx` |
| `/dashboard/owner/products` | Owner | Products & Variant Catalog | `/api/owner/products` | `[IMPLEMENTED]` | `app/dashboard/owner/products/page.tsx` |
| `/dashboard/owner/orders` | Owner | Bakery Orders Management | `/api/owner/orders` | `[IMPLEMENTED]` | `app/dashboard/owner/orders/page.tsx` |
| `/dashboard/owner/delivery-slots` | Owner | Pickup & Delivery Slots | `/api/owner/delivery-slots` | `[IMPLEMENTED]` | `app/dashboard/owner/delivery-slots/page.tsx` |

---

## M. Component Inventory

### 1. Active Components (In Production Use)
- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`
- `components/layout/AnnouncementBar.tsx`
- `components/layout/MobileMenu.tsx`
- `components/marketplace/HeroSection.tsx`
- `components/marketplace/BakeryGrid.tsx`
- `components/marketplace/BakeryCard.tsx`
- `components/marketplace/LocationFilterBar.tsx`
- `components/marketplace/BusinessCategoryTabs.tsx`
- `components/marketplace/HowItWorks.tsx`
- `components/marketplace/TrustBenefits.tsx`
- `components/marketplace/CustomerTestimonials.tsx`
- `components/marketplace/OwnerCTA.tsx`
- `components/storefront-v2/ProductDetailModal.tsx`
- `components/dashboard/DashboardLayoutWrapper.tsx`
- `components/dashboard/Sidebar.tsx`
- `components/dashboard/Header.tsx`
- `components/ui/RatingStars.tsx`
- `components/onboarding/StepNavigator.tsx`
- `components/onboarding/SuccessModal.tsx`

### 2. Confirmed Unreferenced / Obsolete Prototype Components
- `components/storefront/*` (Entire folder: 9 files unreferenced)
- `components/dashboard/owner/Owner*Tab.tsx` (7 tab components unreferenced)
- `components/dashboard/owner/OwnerHeader.tsx`, `OwnerSidebar.tsx`, `AddEditProductModal.tsx` (Unreferenced)
- `components/marketplace/BakerySectionV2.tsx`, `BakeryCardV2.tsx`, `FeaturedCakesV2.tsx`, `HeroSectionV2.tsx`, `HowItWorksV2.tsx`, `OwnerCTAV2.tsx`, `CategorySection.tsx` (Unreferenced duplicates)
- `components/storefront-v2/StorefrontNavbarV2.tsx`, `StorefrontHeroV2.tsx`, `StorefrontFooterV2.tsx`, `ShopStatusIndicator.tsx`, `ProductModal.tsx`, `CartDrawer.tsx`, `CheckoutModal.tsx` (Only imported by unreferenced `StorefrontPageClient.tsx`)

---

## N. Database Table Inventory (21 Tables)

*(Full schema definitions documented in `DATABASE_STATUS.md`)*

---

## O. Flyway Migration Inventory

- `V1__init_schema.sql`
- `V2__add_verification_and_location.sql`
- `V3__add_subscriptions_and_payouts.sql`
- `V4__add_notifications.sql`
- `V5__orders_and_customers.sql`
- `V6__feedback_and_enquiries.sql`
- `V7__cake_variants_and_slots.sql`
- `V8__coupons_and_discounts.sql`
- `V9__order_lifecycle.sql` (Installed in DB)

---

## P. Mock / Fallback Data Inventory

1. **`MOCK_BAKERIES` & `MOCK_FEATURED_CAKES` (`lib/constants/mockData.ts`):** Used only as a fallback when backend network connection fails. When backend is live, real PostgreSQL data is returned.
2. **`CartDrawer.tsx`:** Contains mock ₹50 delivery fee (component is unreferenced).
3. **Form Placeholders:** Standard HTML input placeholder text (e.g. `placeholder="e.g. Aditi Sharma"`).

---

## Q, R, S. Cleanup Candidate Summary

*(Full itemized audit in `CLEANUP_REPORT.md`)*

---

## T. Missing Functionality

1. **Admin Frontend Dashboard:** Zero admin UI screens exist in the frontend (all backend APIs exist).
2. **Owner Enquiries UI:** Backend `/api/owner/enquiries` exists; owner response screen needed.
3. **Owner Analytics UI:** Backend `/api/owner/analytics/dashboard` exists; visual analytics dashboard needed.
4. **Owner Settings & Subscription UI:** Backend `/api/shops/my-shop` and `/api/owner/subscriptions/current` exist; screens needed.
5. **Customer Checkout Modal Integration:** End-to-end guest ordering flow on storefront.

---

## U. Partially Implemented Functionality

1. **Storefront Checkout (`/checkout`):** Prototype page exists with mock fields, not yet hooked to `POST /api/storefront/shops/{id}/orders`.
2. **Order Tracking:** Backend endpoints exist for order details and invoice generation; customer status lookup screen pending.

---

## V. Known Technical Debt

1. **Legacy Route:** `/shops/[id]` exists solely as a redirect to `/shop/[id]`.
2. **Redundant `src/` Directory:** `frontend_v1/src/data/locations.ts` re-exports `frontend_v1/data/locations.ts` without being imported.
3. **Unused Prototype Components:** Accumulation of 25+ unreferenced component files from earlier design explorations.

---

## W. Current Implementation Status Summary

- **Customer Marketplace:** 100% Implemented & Verified
- **Customer Storefront & Product Detail:** 100% Implemented & Verified
- **Customer Enquiries:** 100% Implemented & Verified
- **Owner Onboarding & Auth:** 100% Implemented & Verified
- **Owner Product & Order Management:** 90% Implemented & Verified
- **Owner Enquiries, Analytics, Settings:** 0% (Backend 100%, Frontend 0%)
- **Admin Dashboard:** 0% (Backend 100%, Frontend 0%)

---

## X. Recommended Next Implementation Phases

- **Phase 0:** Audit, Inventory, Safe Cleanup, Verification (Current Phase).
- **Phase 1 (Owner Enquiries & Lead Management):** Connect baker dashboard to incoming custom cake enquiries and general enquiries (`custom_cake_requests` and `enquiries` tables).
- **Phase 2 (Owner Analytics, Subscription & Settings):** Build remaining owner dashboard tabs (revenue analytics, subscription status, bakery profile settings).
- **Phase 3 (Admin Platform Dashboard):** Build the Admin panel for bakery approvals, shop status controls, and subscription plans using existing backend APIs.
- **Phase 4 (Customer Checkout & Guest Orders):** Connect public storefront cart and checkout to `POST /api/storefront/shops/{id}/orders` with delivery slot validation.
