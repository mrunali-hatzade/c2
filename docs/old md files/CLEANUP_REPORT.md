# CakeStore SaaS Platform — Cleanup Report & File Audit

**Audit Date:** September 2026  
**Scope:** `frontend_v1/`, `backend/`, and root project directories.  
**Rule:** NO file is deleted without rigorous reference and dependency analysis.

---

## 1. Candidate Files & Folders Audit Table

| File / Folder | Reason | Used / Unused | Duplicate? | Safe to Delete? | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `frontend_v1/src/data/locations.ts` | 2-line re-export file `export * from "../../data/locations";`. | **UNUSED** (0 references) | Yes (`frontend_v1/data/locations.ts` is the original) | **YES** | Safe to delete. Removes entire redundant `src/` directory. |
| `frontend_v1/app/shops/[id]/StorefrontPageClient.tsx` | 570-line obsolete mock storefront client from pre-Phase-C. `/shops/[id]/page.tsx` now cleanly redirects to `/shop/[id]`. | **UNUSED** (0 references) | Yes (Superseeded by canonical `/shop/[id]/page.tsx`) | **YES** | Safe to delete. |
| `frontend_v1/components/storefront/` (Entire folder, 9 files: `CustomCakeBuilder.tsx`, `ProductDetailModal.tsx`, `StorefrontFeatures.tsx`, `StorefrontFooter.tsx`, `StorefrontHero.tsx`, `StorefrontMenu.tsx`, `StorefrontNavbar.tsx`, `StorefrontOccasions.tsx`, `StorefrontStory.tsx`) | Early V1 storefront prototype components. Replaced in Phase C & D by verified `/shop/[id]/page.tsx` and `ProductDetailModal.tsx`. | **UNUSED** (0 references across entire codebase) | Yes | **YES** | Safe to delete. Eliminates confusion with active storefront code. |
| `frontend_v1/components/storefront-v2/StorefrontNavbarV2.tsx` | Exploratory storefront navbar. | **UNUSED** (Only imported by dead `StorefrontPageClient.tsx`) | Yes | **YES** | Safe to delete after `StorefrontPageClient.tsx` is removed. |
| `frontend_v1/components/storefront-v2/StorefrontHeroV2.tsx` | Exploratory storefront hero banner. | **UNUSED** (Only imported by dead `StorefrontPageClient.tsx`) | Yes | **YES** | Safe to delete after `StorefrontPageClient.tsx` is removed. |
| `frontend_v1/components/storefront-v2/StorefrontFooterV2.tsx` | Exploratory storefront footer. | **UNUSED** (Only imported by dead `StorefrontPageClient.tsx`) | Yes | **YES** | Safe to delete after `StorefrontPageClient.tsx` is removed. |
| `frontend_v1/components/storefront-v2/ShopStatusIndicator.tsx` | Storefront open/closed status badge prototype. | **UNUSED** (Only imported by dead `StorefrontPageClient.tsx`) | No | **REQUIRES_REVIEW** | Retain or move to `components/storefront/` for future shop hours enhancement. |
| `frontend_v1/components/storefront-v2/ProductModal.tsx` | Old prototype product modal with hardcoded cart items. Superseeded in Phase D by verified `ProductDetailModal.tsx`. | **UNUSED** (Only imported by dead `StorefrontPageClient.tsx`) | Yes | **YES** | Safe to delete. |
| `frontend_v1/components/storefront-v2/CartDrawer.tsx` | Mock cart drawer prototype. | **UNUSED** (Only imported by dead `StorefrontPageClient.tsx`) | No | **REQUIRES_REVIEW** | Retain in `components/checkout/` for Phase 4 customer cart implementation. |
| `frontend_v1/components/storefront-v2/CheckoutModal.tsx` | Mock checkout modal prototype. | **UNUSED** (Only imported by dead `StorefrontPageClient.tsx`) | No | **REQUIRES_REVIEW** | Retain in `components/checkout/` for Phase 4 customer checkout implementation. |
| `frontend_v1/components/dashboard/owner/OwnerOverviewTab.tsx` | Abandoned mock Kanban overview tab with hardcoded orders. | **UNUSED** (0 references) | Yes (Replaced by `app/dashboard/owner/page.tsx`) | **YES** | Safe to delete. |
| `frontend_v1/components/dashboard/owner/OwnerProductsTab.tsx` | Abandoned tab-based product manager. | **UNUSED** (0 references) | Yes (Replaced by `app/dashboard/owner/products/page.tsx`) | **YES** | Safe to delete. |
| `frontend_v1/components/dashboard/owner/AddEditProductModal.tsx` | Modal used only by abandoned `OwnerProductsTab.tsx`. `app/dashboard/owner/products/page.tsx` has its own built-in modal. | **UNUSED** (Only imported by unused `OwnerProductsTab.tsx`) | Yes | **YES** | Safe to delete. |
| `frontend_v1/components/dashboard/owner/OwnerOrdersTab.tsx` | Abandoned tab-based orders manager. | **UNUSED** (0 references) | Yes (Replaced by `app/dashboard/owner/orders/page.tsx`) | **YES** | Safe to delete. |
| `frontend_v1/components/dashboard/owner/OwnerCouponsTab.tsx` | Tab prototype for coupons. | **UNUSED** (0 references) | No | **REQUIRES_REVIEW** | Retain as reference when building Owner Coupons UI. |
| `frontend_v1/components/dashboard/owner/OwnerCustomersTab.tsx` | Tab prototype for customer CRM. | **UNUSED** (0 references) | No | **REQUIRES_REVIEW** | Retain as reference when building Owner Customers UI. |
| `frontend_v1/components/dashboard/owner/OwnerSettingsTab.tsx` | Tab prototype for shop settings. | **UNUSED** (0 references) | No | **REQUIRES_REVIEW** | Retain as reference when building Owner Settings UI. |
| `frontend_v1/components/dashboard/owner/OwnerSubscriptionTab.tsx` | Tab prototype for subscription info. | **UNUSED** (0 references) | No | **REQUIRES_REVIEW** | Retain as reference when building Owner Subscription UI. |
| `frontend_v1/components/dashboard/owner/OwnerHeader.tsx` | Old header prototype from tab layout. | **UNUSED** (0 references) | Yes (`components/dashboard/Header.tsx` is active) | **YES** | Safe to delete. |
| `frontend_v1/components/dashboard/owner/OwnerSidebar.tsx` | Old sidebar prototype from tab layout. | **UNUSED** (0 references) | Yes (`components/dashboard/Sidebar.tsx` is active) | **YES** | Safe to delete. |
| `frontend_v1/components/marketplace/BakerySectionV2.tsx` | Alternate exploratory bakery section. | **UNUSED** (0 references) | Yes (`BakeryGrid.tsx` is active) | **YES** | Safe to delete. |
| `frontend_v1/components/marketplace/BakeryCardV2.tsx` | Alternate exploratory bakery card. | **UNUSED** (Only imported by `BakerySectionV2.tsx`) | Yes (`BakeryCard.tsx` is active) | **YES** | Safe to delete. |
| `frontend_v1/components/marketplace/FeaturedCakesV2.tsx` | Alternate exploratory featured cakes section. | **UNUSED** (0 references) | Yes | **YES** | Safe to delete. |
| `frontend_v1/components/marketplace/HeroSectionV2.tsx` | Alternate exploratory hero section. | **UNUSED** (0 references) | Yes (`HeroSection.tsx` is active) | **YES** | Safe to delete. |
| `frontend_v1/components/marketplace/HowItWorksV2.tsx` | Alternate exploratory how-it-works section. | **UNUSED** (0 references) | Yes (`HowItWorks.tsx` is active) | **YES** | Safe to delete. |
| `frontend_v1/components/marketplace/OwnerCTAV2.tsx` | Alternate exploratory owner CTA banner. | **UNUSED** (0 references) | Yes (`OwnerCTA.tsx` is active) | **YES** | Safe to delete. |
| `frontend_v1/components/marketplace/CategorySection.tsx` | Unreferenced category carousel exploration. | **UNUSED** (0 references) | Yes | **YES** | Safe to delete. |
| `frontend_v1/storefront.css` | Old custom stylesheet. | **UNUSED** (Not imported in `layout.tsx` or `globals.css`) | No | **YES** | Safe to delete. |
| `Cake_Platform_PRD.md`, `Cake_Platform_PRD_v2.md`, `PRD.md` | Older draft PRDs superseded by `Cake_Platform_PRD_Final.md`. | Superseded | Yes | **REQUIRES_REVIEW** | Retain in docs for historical reference; do not delete without user direction. |

---

## 2. Summary of Cleanup Strategy

1. **Delete Confirmed Dead/Duplicate Prototypes:**
   - Redundant `frontend_v1/src/` folder.
   - Dead `StorefrontPageClient.tsx` and its exclusive children (`StorefrontNavbarV2.tsx`, `StorefrontHeroV2.tsx`, `StorefrontFooterV2.tsx`, `ProductModal.tsx`).
   - Entire unreferenced `components/storefront/` directory (9 dead files).
   - Duplicate unreferenced marketplace V2 exploratory files (`BakerySectionV2.tsx`, `BakeryCardV2.tsx`, `FeaturedCakesV2.tsx`, `HeroSectionV2.tsx`, `HowItWorksV2.tsx`, `OwnerCTAV2.tsx`, `CategorySection.tsx`).
   - Dead owner tab prototypes (`OwnerOverviewTab.tsx`, `OwnerProductsTab.tsx`, `OwnerOrdersTab.tsx`, `AddEditProductModal.tsx`, `OwnerHeader.tsx`, `OwnerSidebar.tsx`).
   - Unreferenced `frontend_v1/storefront.css`.

2. **Preserve For Future Feature Implementation:**
   - `CartDrawer.tsx` & `CheckoutModal.tsx` (Useful skeleton for Phase 4 Customer Checkout).
   - `OwnerCouponsTab.tsx`, `OwnerCustomersTab.tsx`, `OwnerSettingsTab.tsx`, `OwnerSubscriptionTab.tsx` (Useful skeletons for Owner CRM/Settings/Billing).
   - `lib/constants/mockData.ts` (Required safety fallback for offline dev resilience).
   - `Cake_Platform_PRD_Final.md` and `CakeStore_Frontend_PRD_v2.md` (Product truth).
