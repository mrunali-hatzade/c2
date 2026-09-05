'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Store,
  CreditCard,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ExternalLink,
  ChefHat,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Bakery Moderation', href: '/admin/shops', icon: Store },
    { label: 'SaaS Plans', href: '/admin/plans', icon: CreditCard },
    { label: 'System Broadcasts', href: '/admin/messages', icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white block leading-none">
                CakeStore
              </span>
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold">
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
        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Platform Management
          </div>
          {navItems.map((item) => {
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          {/* Quick Platform Jumps */}
          <div className="pt-6 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Portals
          </div>
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Market</span>
            </div>
            <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">Live</span>
          </Link>
          <Link
            href="/dashboard/owner"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Owner Dashboard</span>
            </div>
            <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">SaaS</span>
          </Link>
        </nav>

        {/* Super Admin Profile & Sign Out */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
          <div className="mb-3 px-2">
            <p className="text-xs text-white font-medium truncate">
              {user?.email || 'admin@cakestore.platform'}
            </p>
            <p className="text-[10px] text-indigo-400 font-medium">SUPER_ADMINISTRATOR</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 border border-rose-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              API Live (Port 8080)
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
