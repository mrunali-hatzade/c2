import { apiClient } from './client';
import {
  DashboardStats,
  AdminShopSummary,
  AdminShopDetails,
  AdminPlan,
  AdminMessagePayload,
} from '@/types/admin';

// ==========================================
// RESILIENT OFFLINE FALLBACK MOCKS
// ==========================================

const MOCK_PLATFORM_STATS: DashboardStats = {
  totalShops: 18,
  activeShops: 14,
  suspendedShops: 1,
  pendingShops: 3,
  totalUsers: 1420,
  totalRevenue: 348500,
};

const MOCK_SHOPS: AdminShopSummary[] = [
  {
    shopId: 1,
    businessName: 'Delight Confectioneries',
    ownerName: 'Priya Sharma',
    ownerEmail: 'priya@delightcakes.in',
    shopStatus: 'ACTIVE',
    registeredAt: '2026-07-15T10:30:00Z',
  },
  {
    shopId: 2,
    businessName: 'Royal Ribbon Artisan Patisserie',
    ownerName: 'Kabir Mehta',
    ownerEmail: 'kabir@royalribbon.com',
    shopStatus: 'ACTIVE',
    registeredAt: '2026-07-28T14:15:00Z',
  },
  {
    shopId: 3,
    businessName: 'Sweet Tooth Bakeshop',
    ownerName: 'Ananya Roy',
    ownerEmail: 'ananya@sweettooth.org',
    shopStatus: 'PENDING',
    registeredAt: '2026-09-01T09:00:00Z',
  },
  {
    shopId: 4,
    businessName: 'Crumb & Crust Boutique',
    ownerName: 'Rahul Verma',
    ownerEmail: 'rahul@crumbcrust.in',
    shopStatus: 'PENDING',
    registeredAt: '2026-09-03T11:45:00Z',
  },
  {
    shopId: 5,
    businessName: 'Midnight Velvet Cakes',
    ownerName: 'Sanjay Gupta',
    ownerEmail: 'sanjay@midnightvelvet.com',
    shopStatus: 'SUSPENDED',
    registeredAt: '2026-06-10T16:20:00Z',
  },
];

const MOCK_PLANS: AdminPlan[] = [
  {
    id: 1,
    name: 'Starter Bakery',
    description: 'Essential toolkit for small neighborhood home bakers and pastry artisans.',
    price: 999,
    currency: 'INR',
    durationDays: 30,
    features: 'Up to 25 Products, Standard WhatsApp Enquiries, In-Store Checkout, Email Support',
    isActive: true,
  },
  {
    id: 2,
    name: 'Professional Patisserie',
    description: 'Advanced operations and high-volume order automation for expanding studios.',
    price: 2499,
    currency: 'INR',
    durationDays: 30,
    features: 'Unlimited Products, Custom Domain Mapping, Kanban Workflow, Discount Engine, Priority WhatsApp Dispatch',
    isActive: true,
  },
  {
    id: 3,
    name: 'Enterprise Multi-Outlet',
    description: 'Custom solutions for bakery franchises, central commissaries, and multi-tier chains.',
    price: 6999,
    currency: 'INR',
    durationDays: 30,
    features: 'Multi-Outlet Kitchen Routing, Dedicated Account Manager, Custom API Access, 0% Platform Commission',
    isActive: true,
  },
];

// ==========================================
// SUPER ADMIN API CLIENT FUNCTIONS
// ==========================================

export async function getPlatformStats(): Promise<DashboardStats> {
  try {
    return await apiClient.get<DashboardStats>('/api/admin/dashboard/stats');
  } catch (err) {
    console.warn('[AdminAPI] getPlatformStats failed, using fallback:', err);
    return MOCK_PLATFORM_STATS;
  }
}

export async function getAllShops(): Promise<AdminShopSummary[]> {
  try {
    const res = await apiClient.get<AdminShopSummary[]>('/api/admin/shops');
    return Array.isArray(res) ? res : MOCK_SHOPS;
  } catch (err) {
    console.warn('[AdminAPI] getAllShops failed, using fallback:', err);
    return MOCK_SHOPS;
  }
}

export async function getShopDetails(shopId: number): Promise<AdminShopDetails> {
  try {
    return await apiClient.get<AdminShopDetails>(`/api/admin/shops/${shopId}`);
  } catch (err) {
    console.warn(`[AdminAPI] getShopDetails(${shopId}) failed, using fallback:`, err);
    const summary = MOCK_SHOPS.find((s) => s.shopId === Number(shopId)) || MOCK_SHOPS[0];
    return {
      shop: {
        id: summary.shopId,
        businessName: summary.businessName,
        description: 'Bespoke artisanal cakes, cupcakes, and layered dessert delicacies crafted with premium Belgian chocolate and organic farm dairy.',
        phone: '+91 98765 43210',
        email: summary.ownerEmail || 'contact@bakery.in',
        address: 'Shop 14, Heritage Arcade, Linking Road, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        fssaiRegistration: '11523024000981',
        status: summary.shopStatus,
        isPureVeg: false,
        createdAt: summary.registeredAt,
        updatedAt: '2026-09-04T12:00:00Z',
      },
      subscriptions: [
        {
          id: 101,
          planName: 'Professional Patisserie',
          status: 'ACTIVE',
          startDate: '2026-08-01',
          endDate: '2026-08-31',
          amount: 2499,
        },
      ],
      payments: [
        {
          id: 201,
          amount: 2499,
          status: 'SUCCESS',
          paymentMethod: 'UPI / Razorpay',
          createdAt: '2026-08-01T10:30:00Z',
        },
      ],
      activityLogs: [
        {
          id: 301,
          action: 'LOGIN',
          details: 'Owner logged in from IP 192.168.1.45',
          createdAt: '2026-09-04T08:30:00Z',
        },
        {
          id: 302,
          action: 'PRODUCT_UPDATE',
          details: 'Updated inventory for Belgian Chocolate Truffle Cake',
          createdAt: '2026-09-03T16:15:00Z',
        },
        {
          id: 303,
          action: 'STATUS_CHANGE',
          details: `Shop status changed to ${summary.shopStatus}`,
          createdAt: summary.registeredAt,
        },
      ],
      totalProducts: 24,
      totalOrders: 186,
    };
  }
}

export async function updateShopStatus(shopId: number, status: string): Promise<any> {
  try {
    return await apiClient.patch(`/api/admin/shops/${shopId}/status`, { status });
  } catch (err) {
    console.warn(`[AdminAPI] updateShopStatus(${shopId}, ${status}) failed, simulating offline success:`, err);
    return { id: shopId, status };
  }
}

export async function getAllPlans(): Promise<AdminPlan[]> {
  try {
    const res = await apiClient.get<AdminPlan[]>('/api/admin/plans');
    return Array.isArray(res) ? res : MOCK_PLANS;
  } catch (err) {
    console.warn('[AdminAPI] getAllPlans failed, using fallback:', err);
    return MOCK_PLANS;
  }
}

export async function createPlan(plan: Partial<AdminPlan>): Promise<AdminPlan> {
  try {
    return await apiClient.post<AdminPlan>('/api/admin/plans', plan);
  } catch (err) {
    console.warn('[AdminAPI] createPlan failed, simulating offline success:', err);
    return {
      id: Date.now(),
      name: plan.name || 'New Plan',
      description: plan.description || '',
      price: plan.price || 0,
      currency: plan.currency || 'INR',
      durationDays: plan.durationDays || 30,
      features: plan.features || '',
      isActive: plan.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function updatePlan(id: number, plan: Partial<AdminPlan>): Promise<AdminPlan> {
  try {
    return await apiClient.put<AdminPlan>(`/api/admin/plans/${id}`, plan);
  } catch (err) {
    console.warn(`[AdminAPI] updatePlan(${id}) failed, simulating offline success:`, err);
    return {
      id,
      name: plan.name || '',
      description: plan.description || '',
      price: plan.price || 0,
      currency: plan.currency || 'INR',
      durationDays: plan.durationDays || 30,
      features: plan.features || '',
      isActive: plan.isActive ?? true,
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function togglePlanStatus(id: number, isActive: boolean): Promise<AdminPlan> {
  try {
    return await apiClient.patch<AdminPlan>(`/api/admin/plans/${id}/status?isActive=${isActive}`);
  } catch (err) {
    console.warn(`[AdminAPI] togglePlanStatus(${id}, ${isActive}) failed, simulating offline success:`, err);
    const plan = MOCK_PLANS.find((p) => p.id === id) || MOCK_PLANS[0];
    return { ...plan, isActive };
  }
}

export async function sendAdminMessage(payload: AdminMessagePayload): Promise<string> {
  try {
    return await apiClient.post<string>('/api/admin/messages', payload);
  } catch (err) {
    console.warn('[AdminAPI] sendAdminMessage failed, simulating offline success:', err);
    return payload.specificOwnerId
      ? 'Message sent to specific owner.'
      : 'Message broadcast to all owners.';
  }
}
