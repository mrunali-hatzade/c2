'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Store,
  CreditCard,
  MessageSquare,
  MessageCircle,
  Mail,
  Bell,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ExternalLink,
  ChefHat,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import AdminNotificationBell from '@/components/admin/AdminNotificationBell';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'ROLE_ADMIN' || (user?.role as unknown as string) === 'ADMIN';

  // Auth guard: redirect to login if not logged in or not an admin
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const platformNavItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Bakery Management', href: '/admin/shops', icon: Store },
    { label: 'Plans & Subscriptions', href: '/admin/plans', icon: CreditCard },
  ];

  const communicationNavItems = [
    { label: 'Platform Feedback', href: '/admin/feedback', icon: MessageCircle },
    { label: 'Contact Enquiries', href: '/admin/enquiries', icon: Mail },
    { label: 'Broadcasts', href: '/admin/messages', icon: MessageSquare },
  ];

  const systemNavItems = [
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 h-full max-h-screen lg:h-screen bg-slate-950 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 shrink-0 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white block leading-none tracking-tight">
                CakeStore
              </span>
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold mt-1 block">
                Super Admin
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 py-6 flex-1 min-h-0 space-y-6 overflow-y-auto overflow-x-hidden">
          {/* PLATFORM GROUP */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400/90">
              Platform
            </div>
            <div className="space-y-1.5">
              {platformNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* COMMUNICATION GROUP */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400/90">
              Communication
            </div>
            <div className="space-y-1.5">
              {communicationNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* SYSTEM GROUP */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400/90">
              System
            </div>
            <div className="space-y-1.5">
              {systemNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* PORTALS GROUP */}
          <div className="pt-2">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400/90">
              Portals
            </div>
            <div className="space-y-1.5">
              <Link
                href="/"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-[18px] h-[18px]" />
                  <span>Customer Market</span>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md font-semibold">
                  Live
                </span>
              </Link>
              <Link
                href="/dashboard/owner"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ChefHat className="w-[18px] h-[18px]" />
                  <span>Owner Dashboard</span>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md font-semibold">
                  SaaS
                </span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Super Admin Profile & Sign Out */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-950/50 shrink-0 mt-auto">
          <div className="mb-3 px-1">
            <p className="text-sm text-white font-semibold truncate">
              {user?.email || 'admin@cakeplatform.com'}
            </p>
            <p className="text-[11px] text-indigo-400 font-semibold tracking-wider uppercase mt-0.5">
              Super Administrator
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 border border-rose-900/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                Platform Governance
              </h2>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Multi-Tenant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              API Live (Port 8080)
            </span>

            {/* Admin Global Notification Bell */}
            <AdminNotificationBell />
          </div>
        </header>

        <main className="flex-1 min-h-0 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
