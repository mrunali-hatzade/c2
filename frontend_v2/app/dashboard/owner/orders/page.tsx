'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, CheckCircle, Clock } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import { Order, OrderStatus } from '@/types/order';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await ordersApi.getOwnerOrders();
      setOrders(data || []);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: number, status: OrderStatus) => {
    try {
      await ordersApi.updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  if (isLoading) return <LoadingState message="Loading orders..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif font-bold text-2xl text-owner-heading">Order Management</h1>
        <p className="text-xs text-owner-muted mt-0.5">Track and update active fulfillment statuses for your incoming bakery orders</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-6 h-6" />}
          title="No Orders Received"
          description="Customer orders placed on your storefront will appear here with instant notifications."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-owner-border bg-owner-canvas/40 text-owner-muted">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Delivery Date</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-owner-border">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-owner-canvas/30">
                    <td className="py-3.5 px-4 font-semibold text-owner-heading">#{ord.orderNumber}</td>
                    <td className="py-3.5 px-4">{ord.customerName}</td>
                    <td className="py-3.5 px-4 text-owner-muted">{ord.customerPhone}</td>
                    <td className="py-3.5 px-4">{ord.deliveryDate}</td>
                    <td className="py-3.5 px-4 font-semibold text-owner-heading">₹{ord.totalAmount}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {ord.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'CONFIRMED')}
                          className="px-2.5 py-1 bg-brand-plum text-white rounded-lg text-xs hover:bg-brand-plum-hover transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {ord.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'PREPARING')}
                          className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-xs hover:bg-amber-700 transition-colors"
                        >
                          Baking
                        </button>
                      )}
                      {ord.status === 'PREPARING' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'DELIVERED')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs hover:bg-emerald-700 transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
