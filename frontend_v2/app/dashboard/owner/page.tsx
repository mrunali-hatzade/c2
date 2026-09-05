'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cake, ShoppingBag, TrendingUp, Clock, Plus, ArrowRight } from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import { ordersApi } from '@/lib/api/orders';
import { Product } from '@/types/product';
import { Order } from '@/types/order';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';

export default function OwnerOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsApi.getOwnerProducts().catch(() => []),
      ordersApi.getOwnerOrders().catch(() => []),
    ]).then(([prods, ords]) => {
      setProducts(prods);
      setOrders(ords);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <LoadingState message="Loading bakery metrics..." />;

  const pendingOrders = orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED');
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-owner-muted">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-brand-plum flex items-center justify-center">
              <Cake className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-owner-heading mt-2">{products.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center mt-1">
            Active in catalog
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-owner-muted">Pending Orders</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-owner-heading mt-2">{pendingOrders.length}</p>
          <span className="text-[11px] text-amber-600 font-medium inline-flex items-center mt-1">
            Action required
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-owner-muted">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-owner-heading mt-2">{orders.length}</p>
          <span className="text-[11px] text-blue-600 font-medium inline-flex items-center mt-1">
            Lifetime orders
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-owner-muted">Total Volume</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-owner-heading mt-2">₹{totalRevenue}</p>
          <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center mt-1">
            Revenue processed
          </span>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-owner-border mb-4">
          <h3 className="font-serif font-bold text-base text-owner-heading">Recent Orders</h3>
          <Link href="/dashboard/owner/orders">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-owner-muted text-center py-8">No orders received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-owner-border text-owner-muted">
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Delivery Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-owner-border">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-owner-canvas/50">
                    <td className="py-3 px-3 font-semibold text-owner-heading">#{ord.orderNumber}</td>
                    <td className="py-3 px-3">{ord.customerName}</td>
                    <td className="py-3 px-3">{ord.deliveryDate}</td>
                    <td className="py-3 px-3 font-semibold">₹{ord.totalAmount}</td>
                    <td className="py-3 px-3">
                      <Badge variant={ord.status === 'DELIVERED' ? 'success' : 'warning'} size="sm">
                        {ord.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
