'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Cake,
  ShoppingBag,
  Calendar,
  BarChart3,
  Tag,
  Users,
  MessageSquareQuote,
  Star,
  Settings,
  CreditCard,
  LogOut,
  Store,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';

export default function OwnerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Overview', href: '/dashboard/owner', icon: LayoutDashboard },
    { label: 'Products', href: '/dashboard/owner/products', icon: Cake },
    { label: 'Orders', href: '/dashboard/owner/orders', icon: ShoppingBag },
    { label: 'Delivery Slots', href: '/dashboard/owner/delivery-slots', icon: Calendar },
    { label: 'Analytics', href: '/dashboard/owner/analytics', icon: BarChart3 },
    { label: 'Coupons', href: '/dashboard/owner/coupons', icon: Tag },
    { label: 'Customers', href: '/dashboard/owner/customers', icon: Users },
    { label: 'Custom Enquiries', href: '/dashboard/owner/enquiries', icon: MessageSquareQuote },
    { label: 'Reviews', href: '/dashboard/owner/reviews', icon: Star },
    { label: 'Store Settings', href: '/dashboard/owner/settings', icon: Settings },
    { label: 'Subscription', href: '/dashboard/owner/subscription', icon: CreditCard },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-owner-canvas">
      {/* Sidebar */}
      <aside className="w-64 bg-owner-sidebar text-owner-sidebar-text flex flex-col shrink-0 border-r border-owner-sidebar/80">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-plum text-white flex items-center justify-center shadow-soft">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white block leading-none">
                CakeStore
              </span>
              <span className="text-[10px] text-owner-sidebar-text uppercase tracking-widest font-medium">
                Owner Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-owner-sidebar-active text-white shadow-sm'
                    : 'text-owner-sidebar-text hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Owner Profile & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="mb-3 px-2">
            <p className="text-xs text-white font-medium truncate">{user?.email || 'Bakery Owner'}</p>
            <p className="text-[10px] text-owner-sidebar-text">Shop ID: {user?.shopId || 'N/A'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-owner-border px-6 flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-owner-heading">Bakery Management</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 text-owner-muted hover:text-owner-heading rounded-full hover:bg-owner-canvas transition-colors">
                <Bell className="w-4 h-4" />
              </button>
            </div>
            {user?.shopId && (
              <Link href={`/shop/${user.shopId}`} target="_blank">
                <Button variant="outline" size="sm">
                  <Store className="w-3.5 h-3.5 mr-1 text-brand-plum" />
                  View Live Storefront
                </Button>
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
