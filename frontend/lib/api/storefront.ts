import { apiClient } from "./client";
import { StorefrontShop, Product } from "@/types/storefront";
import { MOCK_BAKERIES, MOCK_FEATURED_CAKES } from "@/lib/constants/mockData";

export interface FetchShopsResult {
  data: StorefrontShop[];
  isFromBackend: boolean;
  error?: string;
}

export interface FetchProductsResult {
  data: Product[];
  isFromBackend: boolean;
  error?: string;
}

export interface StructuredShopFilters {
  state?: string;
  district?: string;
  city?: string;
  area?: string;
  businessType?: string;
  search?: string;
  location?: string;
}

function isAllFilterOption(value?: string): boolean {
  if (!value) return true;
  const lower = value.trim().toLowerCase();
  return lower === "all" || lower.startsWith("all ");
}

/**
 * Maps frontend category tabs to backend BusinessType enum
 */
export function mapCategoryToBusinessType(category?: string): string | undefined {
  if (!category || category === "All Bakeries") return undefined;
  if (category.includes("Home Baker")) return "HOME_BAKERY";
  if (category.includes("Cake Shop")) return "BAKERY_SHOP";
  if (category.includes("Artisan") || category.includes("Studio")) return "CAKE_STUDIO";
  if (category.includes("Online")) return "ONLINE_CAKE_BUSINESS";
  return undefined;
}

/**
 * Structured marketplace search API:
 * GET /api/storefront/shops/search?state=...&district=...&city=...&area=...&businessType=...&search=...
 */
export async function fetchShops(filters: StructuredShopFilters = {}): Promise<FetchShopsResult> {
  try {
    const params = new URLSearchParams();

    if (filters.state && !isAllFilterOption(filters.state)) {
      params.append("state", filters.state.trim());
    }
    if (filters.district && !isAllFilterOption(filters.district)) {
      params.append("district", filters.district.trim());
    }
    if (filters.city && !isAllFilterOption(filters.city)) {
      params.append("city", filters.city.trim());
    }
    if (filters.area && !isAllFilterOption(filters.area)) {
      params.append("area", filters.area.trim());
    }
    if (filters.businessType && !isAllFilterOption(filters.businessType)) {
      params.append("businessType", filters.businessType.trim());
    }
    if (filters.search && filters.search.trim()) {
      params.append("search", filters.search.trim());
    }
    if (filters.location && filters.location.trim()) {
      params.append("location", filters.location.trim());
    }

    const queryString = params.toString();
    const endpoint = `/api/storefront/shops/search${queryString ? `?${queryString}` : ""}`;

    const liveShops = await apiClient<StorefrontShop[]>(endpoint);

    // If backend answered (even with 0 shops), this is a valid response from backend!
    if (Array.isArray(liveShops)) {
      console.log(`[Storefront API] Backend search returned ${liveShops.length} shops for query: ${queryString || "all"}`);

      // Map only real supported fields. Do not inject fake ratings, fake review counts, or fake delivery times.
      const realShops: StorefrontShop[] = liveShops.map((shop) => ({
        id: shop.id,
        businessName: shop.businessName,
        description: shop.description,
        businessCategory: shop.businessCategory,
        businessType: shop.businessType,
        area: shop.area,
        city: shop.city,
        district: shop.district,
        state: shop.state,
        pincode: shop.pincode,
        address: shop.address,
        phone: shop.phone,
        logoUrl: shop.logoUrl,
        coverImageUrl: shop.coverImageUrl,
        latitude: shop.latitude,
        longitude: shop.longitude,
      }));

      return {
        data: realShops,
        isFromBackend: true,
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(
      `[DEV FALLBACK] Backend API (/api/storefront/shops/search) unavailable or returned error: ${errorMsg}. Falling back to local mock data.`
    );
    return {
      data: MOCK_BAKERIES,
      isFromBackend: false,
      error: errorMsg,
    };
  }

  return {
    data: MOCK_BAKERIES,
    isFromBackend: false,
  };
}

/**
 * Legacy search shops by location (backward compatibility):
 * GET /api/storefront/shops/search?location={location}
 */
export async function fetchShopsByLocation(location: string = ""): Promise<FetchShopsResult> {
  return fetchShops({ location });
}

export interface FetchShopDetailsResult {
  shop: StorefrontShop | null;
  isUnavailable?: boolean;
  isNotFound?: boolean;
  isFromBackend: boolean;
  error?: string;
}

/**
 * Fetches shop details for a public storefront:
 * GET /api/storefront/shops/{shopId}
 */
export async function fetchShopDetails(shopId: number | string): Promise<FetchShopDetailsResult> {
  try {
    const shop = await apiClient<StorefrontShop>(`/api/storefront/shops/${shopId}`);
    if (shop && shop.id) {
      return {
        shop,
        isFromBackend: true,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Shop is currently unavailable")) {
      return {
        shop: null,
        isUnavailable: true,
        isFromBackend: true,
        error: "Bakery is currently unavailable",
      };
    }
    if (msg.includes("Shop not found")) {
      return {
        shop: null,
        isNotFound: true,
        isFromBackend: true,
        error: "Bakery not found",
      };
    }
    return {
      shop: null,
      isFromBackend: false,
      error: msg,
    };
  }
  return {
    shop: null,
    isNotFound: true,
    isFromBackend: true,
    error: "Bakery not found",
  };
}

export interface FetchShopProductsResult {
  data: Product[];
  isFromBackend: boolean;
  error?: string;
}

/**
 * Fetches real products for a specific shop:
 * GET /api/storefront/shops/{shopId}/products
 */
export async function fetchShopProducts(shopId: number | string): Promise<FetchShopProductsResult> {
  try {
    const products = await apiClient<Product[]>(`/api/storefront/shops/${shopId}/products`);
    if (Array.isArray(products)) {
      console.log(`[Storefront API] Successfully fetched ${products.length} products for shop ${shopId}`);
      return {
        data: products,
        isFromBackend: true,
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[Storefront API] Could not fetch products for shop ${shopId}:`, errorMsg);
    return {
      data: [],
      isFromBackend: false,
      error: errorMsg,
    };
  }

  return {
    data: [],
    isFromBackend: false,
  };
}

export interface FetchProductDetailsResult {
  product: Product | null;
  isUnavailable?: boolean;
  isNotFound?: boolean;
  isFromBackend: boolean;
  error?: string;
}

/**
 * Fetches real details for a specific product belonging to a shop:
 * GET /api/storefront/shops/{shopId}/products/{productId}
 */
export async function fetchProductDetails(
  shopId: number | string,
  productId: number | string
): Promise<FetchProductDetailsResult> {
  try {
    const product = await apiClient<Product>(`/api/storefront/shops/${shopId}/products/${productId}`);
    if (product && product.id) {
      return {
        product,
        isFromBackend: true,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Product is currently unavailable") || msg.includes("Shop is currently unavailable")) {
      return {
        product: null,
        isUnavailable: true,
        isFromBackend: true,
        error: msg,
      };
    }
    if (msg.includes("Product not found") || msg.includes("Shop not found")) {
      return {
        product: null,
        isNotFound: true,
        isFromBackend: true,
        error: msg,
      };
    }
    return {
      product: null,
      isFromBackend: false,
      error: msg,
    };
  }

  return {
    product: null,
    isNotFound: true,
    isFromBackend: true,
    error: "Product not found",
  };
}

export interface ProductEnquiryPayload {
  shopId: number;
  productId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  quantity?: number;
  preferredDate?: string;
  message?: string;
}

export interface ProductEnquiryResult {
  success: boolean;
  enquiryId?: number;
  data?: any;
  error?: string;
}

/**
 * Submits a customer enquiry for a specific product at a bakery:
 * POST /api/storefront/enquiries
 */
export async function submitProductEnquiry(
  payload: ProductEnquiryPayload
): Promise<ProductEnquiryResult> {
  try {
    const data = await apiClient<any>("/api/storefront/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      enquiryId: data?.id,
      data,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: msg,
    };
  }
}

/**
 * Fetches featured cakes across active shops or from available backend shops:
 */
export async function fetchFeaturedCakes(shops: StorefrontShop[] = []): Promise<FetchProductsResult> {
  try {
    if (shops.length > 0) {
      const allProductPromises = shops.slice(0, 5).map(async (shop) => {
        try {
          const prods = await apiClient<Product[]>(`/api/storefront/shops/${shop.id}/products`);
          if (Array.isArray(prods) && prods.length > 0) {
            return prods.map((p, idx) => ({
              ...p,
              shopId: shop.id,
              shopName: shop.businessName,
              category: p.category || (idx % 2 === 0 ? "Chocolate Cakes" : "Birthday Cakes"),
              rating: p.rating ?? 4.8,
              imageUrl: p.imageUrl && p.imageUrl.startsWith("http") && !p.imageUrl.includes("example.com")
                ? p.imageUrl
                : MOCK_FEATURED_CAKES[idx % MOCK_FEATURED_CAKES.length]?.imageUrl || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
            }));
          }
        } catch {
          // Ignore individual shop failures
        }
        return [];
      });

      const results = await Promise.all(allProductPromises);
      const combined = results.flat();

      if (combined.length > 0) {
        return {
          data: combined,
          isFromBackend: true,
        };
      }
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(
      `[DEV FALLBACK] Backend API (/api/storefront/shops/{shopId}/products) returned error: ${errorMsg}. Falling back to local mock cakes.`
    );
  }

  return {
    data: MOCK_FEATURED_CAKES,
    isFromBackend: false,
  };
}


export interface StorefrontOrderItemRequest {
  productId: number;
  quantity: number;
  variantId?: number;
  dietaryPreference?: string;
  cakeMessage?: string;
  photoReferenceUrl?: string;
  addonIds?: number[];
}

export interface GuestOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  deliveryAddress: string;
  items: StorefrontOrderItemRequest[];
  deliveryDate: string;
  deliverySlotId: number;
  couponCode?: string;
}

/**
 * Place a guest order for a specific shop
 * POST /api/storefront/shops/{shopId}/orders
 */
export async function placeGuestOrder(shopId: number, request: GuestOrderRequest): Promise<any> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const response = await fetch(`${API_BASE_URL}/api/storefront/shops/${shopId}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch (e) {
      // Ignore JSON parse error if response is not JSON
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export interface StorefrontDeliverySlot {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

/**
 * Fetch delivery slots for a shop
 * GET /api/storefront/shops/{shopId}/delivery-slots
 */
export async function getStorefrontDeliverySlots(shopId: number): Promise<StorefrontDeliverySlot[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const response = await fetch(`${API_BASE_URL}/api/storefront/shops/${shopId}/delivery-slots`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    console.warn(`Failed to fetch delivery slots for shop ${shopId}`);
    return [];
  }

  return response.json();
}
