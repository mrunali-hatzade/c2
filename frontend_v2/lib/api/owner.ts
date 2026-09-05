import { apiClient } from './client';
import {
  DashboardAnalytics,
  Coupon,
  CreateCouponRequest,
  OwnerCustomer,
  CustomCakeEnquiry,
  EnquiryStatus,
  BakeryReview,
  ShopSettings,
  OwnerSubscription,
} from '@/types/owner';

// Offline fallback mock data
const MOCK_ANALYTICS: DashboardAnalytics = {
  totalRevenue: 48500,
  totalOrders: 38,
  salesByDay: {
    Monday: 4200,
    Tuesday: 5800,
    Wednesday: 3900,
    Thursday: 6700,
    Friday: 9400,
    Saturday: 11200,
    Sunday: 7300,
  },
  topSellingProducts: {
    'Dutch Truffle Cake': 14,
    'Fresh Strawberry Gateau': 9,
    'Red Velvet Cream Cheese': 8,
    'Belgian Chocolate Bento': 7,
  },
  conversionRate: 4.8,
  averageOrderValue: 1276,
  activeProductsCount: 16,
};

const MOCK_COUPONS: Coupon[] = [
  {
    id: '1',
    code: 'SWEET10',
    discountPercent: 10,
    minOrderAmount: 499,
    validUntil: '2026-12-31',
    isActive: true,
    usageCount: 24,
  },
  {
    id: '2',
    code: 'FESTIVE50',
    flatDiscount: 50,
    minOrderAmount: 799,
    validUntil: '2026-11-15',
    isActive: true,
    usageCount: 12,
  },
  {
    id: '3',
    code: 'WELCOMEBENTO',
    discountPercent: 15,
    minOrderAmount: 350,
    validUntil: '2026-08-01',
    isActive: false,
    usageCount: 45,
  },
];

const MOCK_CUSTOMERS: OwnerCustomer[] = [
  {
    id: '1',
    name: 'Pooja Deshmukh',
    email: 'pooja.d@gmail.com',
    phone: '+91 98231 44521',
    totalOrders: 5,
    totalSpend: 5450,
    lastOrderDate: '2026-09-02',
    address: 'B-402, Pradhikaran, Akurdi, Pune',
  },
  {
    id: '2',
    name: 'Amitabh Sharma',
    email: 'amitabh.s@yahoo.com',
    phone: '+91 98110 88234',
    totalOrders: 3,
    totalSpend: 3100,
    lastOrderDate: '2026-08-28',
    address: 'A-12, Green Acres, Baner, Pune',
  },
  {
    id: '3',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@outlook.com',
    phone: '+91 97654 32109',
    totalOrders: 2,
    totalSpend: 1950,
    lastOrderDate: '2026-08-19',
    address: 'Flat 101, Datta Nagar, Ravet, Pune',
  },
];

const MOCK_ENQUIRIES: CustomCakeEnquiry[] = [
  {
    id: '1',
    customerName: 'Rohit Kadam',
    customerPhone: '+91 98901 12345',
    customerEmail: 'rohit.kadam@gmail.com',
    occasion: '1st Birthday Celebration',
    flavor: 'Belgian Chocolate + Berry Coulis',
    weightKg: 2.5,
    budget: 3500,
    eventDate: '2026-09-12',
    referenceImageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80',
    status: 'NEW',
    notes: 'Need blue hot air balloon theme with cute golden edible stars. Eggless preferred.',
    createdAt: '2026-09-04T10:15:00Z',
  },
  {
    id: '2',
    customerName: 'Ananya Sen',
    customerPhone: '+91 98765 43210',
    customerEmail: 'ananya.sen@gmail.com',
    occasion: '25th Wedding Silver Anniversary',
    flavor: 'Red Velvet with Cream Cheese',
    weightKg: 3,
    budget: 4500,
    eventDate: '2026-09-18',
    referenceImageUrl: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=600&q=80',
    status: 'QUOTED',
    quotedPrice: 4200,
    notes: 'Two-tier cake with silver edible foil and fresh white carnations.',
    createdAt: '2026-09-03T14:30:00Z',
  },
];

const MOCK_REVIEWS: BakeryReview[] = [
  {
    id: '1',
    customerName: 'Tanvi Joshi',
    rating: 5,
    comment: 'The chocolate truffle cake was absolute heaven! Delivered right at the 6 PM slot in pristine condition. Highly recommended.',
    createdAt: '2026-09-01',
    orderNumber: 'ORD-98214',
    cakeName: 'Dutch Truffle Cake',
    reply: 'Thank you so much Tanvi! We loved baking this for your celebration.',
    replyDate: '2026-09-02',
  },
  {
    id: '2',
    customerName: 'Kunal Patil',
    rating: 4,
    comment: 'Very tasty cake, beautiful piping and finish. Would appreciate slightly less sugar, but overall very happy with our order!',
    createdAt: '2026-08-27',
    orderNumber: 'ORD-97812',
    cakeName: 'Fresh Fruit Gateau',
  },
];

const MOCK_SETTINGS: ShopSettings = {
  businessName: 'Artisan Oven Boutique Bakery',
  businessType: 'CUSTOM_CAKE_STUDIO',
  description: 'Handcrafted customized designer cakes, gourmet desserts and celebration bakes made fresh with love in Akurdi, Pune.',
  phone: '+91 98231 00000',
  email: 'hello@artisanoven.in',
  addressLine1: 'Shop No. 4, Pride Horizon',
  addressLine2: 'Near Akurdi Railway Station',
  area: 'Akurdi',
  city: 'Pimpri-Chinchwad',
  district: 'Pune',
  state: 'Maharashtra',
  pincode: '411035',
  fssaiRegistration: 'FSSAI-21523000000123',
  isPureVeg: false,
  openingTime: '09:00',
  closingTime: '22:00',
  coverImageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
  logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80',
  instagramUrl: 'https://instagram.com/artisanovenbakes',
  whatsappNumber: '+919823100000',
};

const MOCK_SUBSCRIPTION: OwnerSubscription = {
  planId: 'pro-baker',
  planName: 'Pro Baker Studio Suite',
  price: 350,
  billingCycle: 'monthly',
  status: 'ACTIVE',
  renewalDate: '2026-10-04',
  ordersProcessedThisMonth: 38,
  ordersLimit: 1000,
  features: [
    'Branded Custom Storefront',
    'Unlimited Cake & Product Catalog',
    'Kitchen Order Management & Kanban',
    '0% Commission on Direct Customer Orders',
    'WhatsApp Order Notifications',
    'Custom Delivery Slots Calendar',
    'Customer Review & CRM Suite',
  ],
};

export const ownerApi = {
  // Analytics
  getAnalytics: async (): Promise<DashboardAnalytics> => {
    try {
      return await apiClient.get<DashboardAnalytics>('/api/owner/analytics');
    } catch {
      return MOCK_ANALYTICS;
    }
  },

  // Coupons
  getCoupons: async (): Promise<Coupon[]> => {
    try {
      return await apiClient.get<Coupon[]>('/api/owner/coupons');
    } catch {
      return MOCK_COUPONS;
    }
  },

  createCoupon: async (data: CreateCouponRequest): Promise<Coupon> => {
    try {
      return await apiClient.post<Coupon>('/api/owner/coupons', data);
    } catch {
      const newCoupon: Coupon = {
        id: String(Date.now()),
        code: data.code.toUpperCase(),
        discountPercent: data.discountPercent,
        flatDiscount: data.flatDiscount,
        minOrderAmount: data.minOrderAmount,
        validUntil: data.validUntil,
        isActive: true,
        usageCount: 0,
      };
      return newCoupon;
    }
  },

  toggleCoupon: async (id: string | number): Promise<void> => {
    try {
      await apiClient.patch(`/api/owner/coupons/${id}/toggle`);
    } catch {
      // Mock toggle
    }
  },

  deleteCoupon: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(`/api/owner/coupons/${id}`);
    } catch {
      // Mock delete
    }
  },

  // Customers
  getCustomers: async (): Promise<OwnerCustomer[]> => {
    try {
      return await apiClient.get<OwnerCustomer[]>('/api/owner/customers');
    } catch {
      return MOCK_CUSTOMERS;
    }
  },

  // Enquiries
  getEnquiries: async (): Promise<CustomCakeEnquiry[]> => {
    try {
      return await apiClient.get<CustomCakeEnquiry[]>('/api/owner/enquiries');
    } catch {
      return MOCK_ENQUIRIES;
    }
  },

  updateEnquiryStatus: async (id: string | number, status: EnquiryStatus, quotedPrice?: number): Promise<void> => {
    try {
      await apiClient.patch(`/api/owner/enquiries/${id}/status`, { status, quotedPrice });
    } catch {
      // Mock update
    }
  },

  // Reviews
  getReviews: async (): Promise<BakeryReview[]> => {
    try {
      return await apiClient.get<BakeryReview[]>('/api/owner/reviews');
    } catch {
      return MOCK_REVIEWS;
    }
  },

  replyToReview: async (id: string | number, reply: string): Promise<void> => {
    try {
      await apiClient.post(`/api/owner/reviews/${id}/reply`, { reply });
    } catch {
      // Mock reply
    }
  },

  // Shop Settings
  getShopSettings: async (): Promise<ShopSettings> => {
    try {
      return await apiClient.get<ShopSettings>('/api/shops/my-shop');
    } catch {
      return MOCK_SETTINGS;
    }
  },

  updateShopSettings: async (data: Partial<ShopSettings>): Promise<ShopSettings> => {
    try {
      return await apiClient.put<ShopSettings>('/api/shops/my-shop', data);
    } catch {
      return { ...MOCK_SETTINGS, ...data };
    }
  },

  // Subscription
  getSubscription: async (): Promise<OwnerSubscription> => {
    try {
      return await apiClient.get<OwnerSubscription>('/api/owner/subscriptions');
    } catch {
      return MOCK_SUBSCRIPTION;
    }
  },
};
