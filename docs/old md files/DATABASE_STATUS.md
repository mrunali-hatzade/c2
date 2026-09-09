# CakeStore SaaS Platform — Database Status & Schema Audit

**Database:** PostgreSQL 18  
**Migration Tool:** Flyway 10  
**Audit Date:** September 2026

---

## 1. Flyway Migration Inventory

| Migration Version | Description | Script Name | Tables Created / Modified | Purpose | Dependencies | Applied Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **V1** | init schema | `V1__init_schema.sql` | `users`, `shops`, `products`, `subscriptions`, `payments`, `orders`, `order_items`, `activity_logs` | Foundational multi-tenant relational schema. | None | **SUCCESS ✅** |
| **V2** | add verification and location | `V2__add_verification_and_location.sql` | Modified `shops`, created `business_documents` | Added hierarchical location fields (`state`, `district`, `city`, `area`, `pincode`, `lat`, `lng`), `fssai_registration`, and document uploads. | V1 | **SUCCESS ✅** |
| **V3** | add subscriptions and payouts | `V3__add_subscriptions_and_payouts.sql` | Created `subscription_plans`, `shop_payout_details`, modified `subscriptions` | Added subscription plans, auto-renewal flag, and owner bank/UPI payout details. | V1, V2 | **SUCCESS ✅** |
| **V4** | add notifications | `V4__add_notifications.sql` | Created `notifications` | Added in-app alerts table with unread status indexing. | V1 | **SUCCESS ✅** |
| **V5** | orders and customers | `V5__orders_and_customers.sql` | Modified `orders` | Added guest customer name, email, payment method, transaction ID. | V1 | **SUCCESS ✅** |
| **V6** | feedback and enquiries | `V6__feedback_and_enquiries.sql` | Created `feedback`, `enquiries`, `custom_cake_requests` | Added customer review/rating pipeline, general inquiries, and dedicated custom cake request leads. | V1, V2 | **SUCCESS ✅** |
| **V7** | cake variants and slots | `V7__cake_variants_and_slots.sql` | Created `product_variants`, `product_addons`, `shop_delivery_slots`, modified `order_items`, `orders` | Weight/size variants, optional addons, bakery delivery slots, order customization snapshots. | V1 | **SUCCESS ✅** |
| **V8** | coupons and discounts | `V8__coupons_and_discounts.sql` | Created `coupons`, modified `orders` | Bakery coupon codes, percentage/flat discounts, coupon tracking on orders. | V1 | **SUCCESS ✅** |
| **V9** | order lifecycle | `V9__order_lifecycle.sql` | Created `order_status_history` | Audit log tracking order status transitions and timestamps. | V1, V5, V7 | **SUCCESS ✅** |

---

## 2. Table-by-Table Schema Inventory (21 Tables)

1. **`users`** (Primary platform accounts): `id`, `email`, `password_hash`, `role`, `full_name`, `mobile`, `status`, `created_at`, `updated_at`.
2. **`shops`** (Multi-tenant bakeries): `id`, `owner_id`, `business_name`, `description`, `phone`, `email`, `address`, `city`, `state`, `pincode`, `business_category`, `logo_url`, `cover_image_url`, `status`, `business_type`, `years_in_business`, `fssai_registration`, `address_line_1`, `address_line_2`, `area`, `district`, `latitude`, `longitude`, `verification_status`, `created_at`, `updated_at`.
3. **`products`** (Bakery menu): `id`, `shop_id`, `name`, `description`, `price`, `image_url`, `availability`, `status`, `created_at`, `updated_at`.
4. **`product_variants`** (Sizes/Weights): `id`, `product_id`, `name`, `price`, `is_available`, `created_at`, `updated_at`.
5. **`product_addons`** (Addons): `id`, `product_id`, `name`, `price`, `is_available`, `created_at`, `updated_at`.
6. **`shop_delivery_slots`** (Delivery/Pickup Windows): `id`, `shop_id`, `day_of_week`, `start_time`, `end_time`, `max_orders`, `is_active`, `created_at`, `updated_at`.
7. **`orders`** (Orders): `id`, `shop_id`, `customer_id`, `order_number`, `subtotal`, `delivery_charge`, `total_amount`, `payment_status`, `order_status`, `delivery_address`, `customer_phone`, `customer_name`, `customer_email`, `payment_method`, `transaction_id`, `paid_at`, `delivery_slot_id`, `delivery_date`, `discount_amount`, `coupon_code`, `created_at`, `updated_at`.
8. **`order_items`** (Order line items): `id`, `order_id`, `product_id`, `product_name_snapshot`, `unit_price`, `quantity`, `total_price`, `variant_name`, `dietary_preference`, `cake_message`, `photo_reference_url`, `addons_summary`.
9. **`order_status_history`** (Order transition audit): `id`, `order_id`, `previous_status`, `new_status`, `changed_by_user_id`, `reason`, `changed_at`.
10. **`coupons`** (Discounts): `id`, `shop_id`, `code`, `discount_type`, `discount_value`, `min_order_value`, `max_discount_cap`, `start_date`, `expiry_date`, `usage_limit`, `used_count`, `is_active`, `created_at`, `updated_at`.
11. **`custom_cake_requests`** (Custom cake enquiry leads): `id`, `shop_id`, `customer_name`, `customer_email`, `customer_mobile`, `occasion`, `cake_type`, `flavour`, `servings`, `design_description`, `reference_image_url`, `budget`, `required_date`, `delivery_preference`, `status`, `owner_response`, `created_at`, `updated_at`.
12. **`enquiries`** (General inquiries): `id`, `shop_id`, `customer_name`, `customer_email`, `enquiry_type`, `message`, `owner_reply`, `status`, `created_at`, `updated_at`.
13. **`feedback`** (Ratings & reviews): `id`, `shop_id`, `customer_display_name`, `rating`, `comment`, `order_reference`, `owner_reply`, `deleted_at`, `deleted_by`, `created_at`, `updated_at`.
14. **`subscriptions`** (Bakery subscription instances): `id`, `shop_id`, `status`, `amount`, `start_date`, `expiry_date`, `plan_id`, `auto_renew`, `created_at`, `updated_at`.
15. **`subscription_plans`** (SaaS pricing tiers): `id`, `name`, `description`, `price`, `currency`, `duration_days`, `features`, `is_active`, `created_at`, `updated_at`.
16. **`payments`** (Payment ledger): `id`, `shop_id`, `subscription_id`, `amount`, `currency`, `provider`, `provider_order_id`, `provider_payment_id`, `status`, `failure_reason`, `paid_at`, `created_at`, `updated_at`.
17. **`shop_payout_details`** (Bakery settlement info): `id`, `shop_id`, `bank_account_number`, `ifsc_code`, `beneficiary_name`, `upi_id`, `razorpay_account_id`, `created_at`, `updated_at`.
18. **`business_documents`** (KYC/Verification files): `id`, `shop_id`, `document_type`, `file_url`, `status`, `created_at`, `updated_at`.
19. **`notifications`** (In-app notifications): `id`, `recipient_id`, `type`, `title`, `message`, `reference_id`, `is_read`, `created_at`.
20. **`activity_logs`** (Platform audit log): `id`, `actor_user_id`, `shop_id`, `action`, `entity_type`, `entity_id`, `metadata`, `timestamp`.
21. **`flyway_schema_history`** (Flyway migration state).

---

## 3. PRD Gap Analysis

| PRD Feature | Database Support in Schema | Notes |
| :--- | :--- | :--- |
| **Multi-tier location filtering** | Supported (`state`, `district`, `city`, `area`) | Fully indexed and operational. |
| **Bakery Accreditation (FSSAI, Years in Business)** | Supported (`fssai_registration`, `years_in_business`, `verification_status`) | Present in `shops`. |
| **Dietary Tag on Products** | **Missing from `products` table** | Currently `dietary_preference` only exists on `order_items`. If products need a default tag (e.g. Pure Veg / Eggless), a future migration adding `dietary_type` to `products` should be scheduled. (Not created in Phase 0 per strict instructions). |
| **Category Table** | Embedded in `shops.business_category` and `products` | The platform currently uses string category fields rather than a standalone `categories` lookup table. This is functional and meets current requirements. |
