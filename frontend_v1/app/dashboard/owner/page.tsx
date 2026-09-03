"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

type DashboardStats = {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  shopStatus: string;
  subscriptionStatus: string;
};

export default function OwnerDashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient<DashboardStats>('/api/shops/my-shop/stats')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        Error loading dashboard: {error}
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Revenue',
      value: `₹${data?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      trend: '',
    },
    {
      name: 'Total Orders',
      value: data?.totalOrders?.toString() ?? '0',
      icon: ShoppingBag,
      trend: '',
    },
    {
      name: 'New Customers',
      value: 'N/A',
      icon: Users,
      trend: '',
    },
    {
      name: 'Active Cakes',
      value: data?.activeProducts?.toString() ?? '0',
      icon: TrendingUp,
      trend: '',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here’s what’s happening with your bakery today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                <Icon size={20} className="text-gray-400" />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.trend && <p className="text-xs text-brand-plum mt-1 font-medium">{stat.trend}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder for Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-80 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg bg-gray-50">
            <p className="text-gray-400 text-sm">No recent orders to display.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-80 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Selling Cakes</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg bg-gray-50">
            <p className="text-gray-400 text-sm">Not enough data to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
