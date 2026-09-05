import { apiClient } from './client';
import { Shop, ShopSearchFilters } from '@/types/shop';
import { Product } from '@/types/product';
import { MOCK_INDIAN_BAKERIES } from '@/lib/constants/indianLocations';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    shopId: 1,
    name: 'Belgian Dark Truffle Celebration Cake',
    description: 'Rich 70% Callebaut dark chocolate sponge layered with smooth ganache, dark chocolate curls, and hand-rolled truffles.',
    price: 899,
    category: 'BIRTHDAY_CAKES',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    inStock: true,
    weightGrams: 1000,
    preparationTimeHours: 4,
  },
  {
    id: 102,
    shopId: 1,
    name: 'Royal Red Velvet Cream Cheese Cake',
    description: 'Crimson cocoa velvet sponge layered with silky Philadelphia cream cheese frosting and delicate white chocolate shavings.',
    price: 949,
    category: 'CUSTOM_DESIGN',
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
    isEggless: false,
    inStock: true,
    weightGrams: 1000,
    preparationTimeHours: 6,
  },
  {
    id: 103,
    shopId: 1,
    name: 'Alphonso Mango & Vanilla Entremet',
    description: 'Seasonal Ratnagiri mango compote, light vanilla bean mascarpone mousse, and delicate French almond sponge.',
    price: 1099,
    category: 'DESSERTS',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    inStock: true,
    weightGrams: 1000,
    preparationTimeHours: 4,
  },
  {
    id: 104,
    shopId: 1,
    name: 'Caramelized Lotus Biscoff Cheesecake',
    description: 'Slow-baked New York style cheesecake topped with warm caramelized Lotus Biscoff spread and spiced cookie crumbs.',
    price: 1199,
    category: 'DESSERTS',
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    inStock: true,
    weightGrams: 1000,
    preparationTimeHours: 12,
  },
  {
    id: 105,
    shopId: 1,
    name: 'Classic Black Forest Kirsch Gateau',
    description: 'Dark cocoa sponge soaked in cherry nectar, filled with fresh dairy whipped cream and macerated dark cherries.',
    price: 799,
    category: 'BIRTHDAY_CAKES',
    imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    inStock: true,
    weightGrams: 1000,
    preparationTimeHours: 4,
  },
  {
    id: 106,
    shopId: 1,
    name: 'Wild Blueberry Glazed Cheesecake',
    description: 'Creamy cold-set cheesecake with butter graham crust, topped with tart wild blueberry compote reduction.',
    price: 1049,
    category: 'DESSERTS',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    inStock: true,
    weightGrams: 1000,
    preparationTimeHours: 8,
  },
  {
    id: 107,
    shopId: 1,
    name: 'Pistachio & Saffron Rosewater Tier',
    description: 'Royal Indian celebration sponge infused with Kashmiri saffron, Persian rosewater cream, and crushed Iranian pistachios.',
    price: 1299,
    category: 'WEDDING_CAKES',
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    inStock: true,
    weightGrams: 1500,
    preparationTimeHours: 24,
  },
  {
    id: 108,
    shopId: 1,
    name: 'French Gourmet Macarons Gift Box (12 pcs)',
    description: 'Delicate almond meringue shells filled with chocolate ganache, pistachio praline, raspberry compote, and salted caramel.',
    price: 649,
    category: 'COOKIES',
    imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
    isEggless: false,
    inStock: true,
    weightGrams: 300,
    preparationTimeHours: 2,
  },
  {
    id: 109,
    shopId: 1,
    name: 'Assorted Gourmet Cupcakes (Box of 6)',
    description: 'Vanilla bean, double chocolate fudge, red velvet cream cheese, and Nutella piped artisan cupcakes.',
    price: 499,
    category: 'CUPCAKES',
    imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    inStock: true,
    weightGrams: 450,
    preparationTimeHours: 3,
  },
];

export const storefrontApi = {
  getShopById: async (shopId: number | string): Promise<Shop> => {
    try {
      const shop = await apiClient.get<Shop>(`/api/storefront/shops/${shopId}`);
      if (shop && shop.id) {
        const isLegacyUk =
          (shop.city || '').toLowerCase() === 'london' ||
          (shop.state || '').toLowerCase().includes('london');

        return {
          ...shop,
          businessName: shop.businessName || "John's Artisanal Cakes",
          address: isLegacyUk ? 'Shop 4, Akurdi Main Road, Near Railway Station' : (shop.address || shop.addressLine1 || ''),
          addressLine1: isLegacyUk ? 'Shop 4, Akurdi Main Road, Near Railway Station' : (shop.addressLine1 || shop.address || ''),
          city: isLegacyUk ? 'Pune' : shop.city,
          district: isLegacyUk ? 'Pune' : (shop.district || 'Pune'),
          state: isLegacyUk ? 'Maharashtra' : shop.state,
          pincode: isLegacyUk ? '411035' : (shop.pincode || '411035'),
          phone: isLegacyUk ? '+91 98765 43210' : (shop.phone || '+91 98765 43210'),
          fssaiRegistration: shop.fssaiRegistration || '11523024000981',
          businessCategory: shop.businessCategory || 'Artisanal Cake Boutique',
          coverImageUrl:
            shop.coverImageUrl && !shop.coverImageUrl.includes('example.com')
              ? shop.coverImageUrl
              : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=80',
          logoUrl:
            shop.logoUrl && !shop.logoUrl.includes('example.com')
              ? shop.logoUrl
              : 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=200&q=80',
        };
      }
    } catch (err) {
      console.warn(`[StorefrontAPI] getShopById(${shopId}) fallback:`, err);
    }
    const found = MOCK_INDIAN_BAKERIES.find((s) => s.id === Number(shopId));
    if (found) return found;
    return MOCK_INDIAN_BAKERIES[0];
  },

  searchShops: async (filters: ShopSearchFilters = {}): Promise<Shop[]> => {
    try {
      const data = await apiClient.get<Shop[]>('/api/storefront/shops/search', {
        params: filters as any,
      });
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      console.warn('[StorefrontAPI] searchShops failed, using Indian places fallback:', err);
    }

    // Filter fallback bakeries by Indian location, search keyword, or business type
    return MOCK_INDIAN_BAKERIES.filter((shop) => {
      if (filters.location && filters.location.trim()) {
        const loc = filters.location.toLowerCase().trim();
        const isNearbyRequest =
          loc.includes('near by') ||
          loc.includes('nearby') ||
          loc.includes('near me') ||
          loc.includes('current location');

        if (!isNearbyRequest) {
          const matchesCity = shop.city.toLowerCase().includes(loc);
          const matchesState = shop.state.toLowerCase().includes(loc);
          const matchesAddress = shop.addressLine1.toLowerCase().includes(loc);
          if (!matchesCity && !matchesState && !matchesAddress) return false;
        }
      }

      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const matchesName = shop.businessName.toLowerCase().includes(q);
        const matchesDesc = (shop.businessDescription || '').toLowerCase().includes(q);
        const matchesCat = (shop.businessCategory || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      if (filters.businessType && filters.businessType !== 'ALL') {
        if (shop.businessType !== filters.businessType) return false;
      }

      return true;
    }).sort((a, b) => {
      // If nearby me requested, sort fastest delivery first
      const loc = (filters.location || '').toLowerCase();
      if (loc.includes('near by') || loc.includes('nearby') || loc.includes('near me')) {
        return (a.deliveryTimeMinutes || 30) - (b.deliveryTimeMinutes || 30);
      }
      return (b.rating || 0) - (a.rating || 0);
    });
  },

  getStorefrontProducts: async (shopId: number | string): Promise<Product[]> => {
    try {
      const prods = await apiClient.get<Product[]>(`/api/storefront/shops/${shopId}/products`);
      if (Array.isArray(prods) && prods.length > 0) return prods;
    } catch (err) {
      console.warn(`[StorefrontAPI] getStorefrontProducts(${shopId}) fallback:`, err);
    }
    return MOCK_PRODUCTS;
  },

  getProductDetails: async (
    shopId: number | string,
    productId: number | string
  ): Promise<Product> => {
    try {
      return await apiClient.get<Product>(`/api/storefront/shops/${shopId}/products/${productId}`);
    } catch (err) {
      console.warn(`[StorefrontAPI] getProductDetails(${shopId}, ${productId}) fallback:`, err);
      const found = MOCK_PRODUCTS.find((p) => p.id === Number(productId));
      return found || MOCK_PRODUCTS[0];
    }
  },
};
