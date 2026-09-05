'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Users, Search, Phone, Mail, MessageCircle, Calendar, ArrowUpRight } from 'lucide-react';
import { ownerApi } from '@/lib/api/owner';
import { OwnerCustomer } from '@/types/owner';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';

export default function OwnerCustomersPage() {
  const [customers, setCustomers] = useState<OwnerCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    ownerApi.getCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.address && c.address.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  const totalSpend = customers.reduce((sum, c) => sum + c.totalSpend, 0);

  if (loading) return <LoadingState message="Loading customer CRM directory..." />;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-owner-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-owner-heading">Customer CRM</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-blush text-brand-plum text-2xs font-bold uppercase tracking-wider">
              {customers.length} Patrons
            </span>
          </div>
          <p className="text-xs sm:text-sm text-owner-muted mt-1">
            Track customer order history, lifetime value, and maintain personal relationships with celebration clients.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-owner-muted bg-owner-canvas px-4 py-2 rounded-xl border border-owner-border">
          <div>
            Total CRM Value: <strong className="text-owner-heading">₹{totalSpend.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-owner-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by customer name, phone, or locality..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-owner-border text-xs sm:text-sm text-owner-heading focus:outline-none focus:border-brand-plum shadow-soft"
        />
      </div>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="py-12 text-center text-xs text-owner-muted">
            No customers match &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-owner-border text-owner-muted bg-owner-canvas/40 uppercase tracking-wider text-2xs font-bold">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Locality / Address</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4">Lifetime Value</th>
                  <th className="py-3 px-4">Last Order</th>
                  <th className="py-3 px-4 text-right">Connect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-owner-border">
                {filteredCustomers.map((cust) => {
                  const cleanPhone = cust.phone.replace(/[^0-9]/g, '');
                  return (
                    <tr key={cust.id} className="hover:bg-owner-canvas/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-blush text-brand-plum font-bold flex items-center justify-center text-xs">
                            {cust.name[0]}
                          </div>
                          <span className="font-semibold text-owner-heading">{cust.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 space-y-0.5">
                        <div className="text-owner-heading font-medium">{cust.phone}</div>
                        <div className="text-owner-muted text-2xs">{cust.email}</div>
                      </td>
                      <td className="py-3 px-4 text-owner-muted max-w-[200px] truncate">
                        {cust.address || '—'}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-owner-heading">
                        {cust.totalOrders}
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-owner-heading">
                        ₹{cust.totalSpend.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-owner-muted">
                        {cust.lastOrderDate || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Message on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <a
                            href={`tel:${cust.phone}`}
                            className="p-1.5 rounded-lg text-brand-plum hover:bg-brand-blush transition-colors"
                            title="Call Customer"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
