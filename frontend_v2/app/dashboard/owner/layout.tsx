'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Cake, ShoppingBag, Calendar, BarChart3,
  Tag, Users, MessageSquareQuote, Star, Settings, CreditCard,
  LogOut, Store, ExternalLink, Menu, Globe, X, RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { OwnerProvider, useOwner } from '@/context/OwnerContext';
import { Button } from '@/components/ui/Button';
import NotificationBell from '@/components/owner/NotificationBell';

function OwnerLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { shop, refreshDashboard, isRefreshing, refreshStatus, refreshError } = useOwner();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  const navItems = [
    { label: 'Overview', href: '/dashboard/owner', icon: LayoutDashboard },
    { label: 'Products', href: '/dashboard/owner/products', icon: Cake },
    { label: 'Orders', href: '/dashboard/owner/orders', icon: ShoppingBag },
    { label: 'Delivery Slots', href: '/dashboard/owner/delivery-slots', icon: Calendar },
    { label: 'Storefront Website', href: '/dashboard/owner/website', icon: Globe },
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-owner-canvas">
        <div className="w-8 h-8 border-2 border-brand-plum border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
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
    </>
  );

  const SidebarShell = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <div className="p-6 border-b border-white/10 shrink-0 flex items-center justify-between">
        <Link href="/dashboard/owner" className="flex items-center gap-2.5 min-w-0" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-9 h-9 rounded-xl bg-brand-plum text-white flex items-center justify-center shadow-soft shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span
              className="font-serif text-lg font-bold text-white block leading-tight truncate"
              title={shop?.businessName || 'My Bakery'}
            >
              {shop?.businessName || 'My Bakery'}
            </span>
            <span className="text-[10px] text-owner-sidebar-text uppercase tracking-widest font-medium block">
              Owner Portal
            </span>
          </div>
        </Link>
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-owner-sidebar-text hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="p-4 flex-1 min-h-0 space-y-1 overflow-y-auto">
        <NavLinks />
      </nav>
      <div className="p-4 border-t border-white/10 shrink-0 mt-auto">
        <div className="mb-3 px-2">
          <p className="text-xs text-white font-medium truncate">{user?.email || 'Bakery Owner'}</p>
          <p className="text-[10px] text-owner-sidebar-text">Shop ID: {shop?.id || user?.shopId || 'N/A'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-owner-canvas overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen shrink-0 bg-owner-sidebar text-owner-sidebar-text flex-col border-r border-owner-sidebar/80">
        <SidebarShell />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative z-10 w-72 h-full max-h-screen bg-owner-sidebar text-owner-sidebar-text flex flex-col shadow-2xl">
            <SidebarShell isMobile={true} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 shrink-0 bg-white border-b border-owner-border px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-owner-muted hover:text-owner-heading rounded-xl hover:bg-owner-canvas transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-serif font-bold text-lg text-owner-heading">Bakery Management</h2>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Operational Notification Bell & Popover */}
            <NotificationBell />

            {/* Moved & Functional Top Header Refresh Button */}
            <button
              onClick={refreshDashboard}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-owner-border bg-owner-canvas hover:bg-brand-cream text-xs font-semibold text-owner-heading transition-all disabled:opacity-60 cursor-pointer shadow-2xs"
              aria-label="Refresh dashboard data"
              title="Reload dashboard data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-brand-plum ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isRefreshing ? 'Refreshing...' : refreshStatus === 'updated' ? 'Data Updated' : 'Refresh'}
              </span>
            </button>

            {/* Single View Store Button */}
            <Link href={`/shop/${shop?.id || user?.shopId || ''}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5 shadow-2xs">
                <Store className="w-3.5 h-3.5 text-brand-plum" />
                <span className="hidden sm:inline">View Store</span>
                <ExternalLink className="w-3 h-3 text-owner-muted" />
              </Button>
            </Link>
          </div>
        </header>

        {refreshError && (
          <div className="px-4 sm:px-6 pt-3 shrink-0">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
              <span>{refreshError}</span>
            </div>
          </div>
        )}

        <main className="flex-1 min-h-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <OwnerProvider>
      <OwnerLayoutContent>{children}</OwnerLayoutContent>
    </OwnerProvider>
  );
}
