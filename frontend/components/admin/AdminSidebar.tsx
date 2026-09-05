"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Store, 
  CreditCard, 
  Bell, 
  LogOut, 
  X,
  ExternalLink
} from 'lucide-react';

import { clearAuthSession } from '@/lib/api/auth';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuthSession();
    router.push('/login');
  };

  const navItems = [
    { 
      name: 'Overview', 
      href: '/admin', 
      icon: LayoutDashboard 
    },
    { 
      name: 'Bakery Directory', 
      href: '/admin/shops', 
      icon: Store 
    },
    { 
      name: 'SaaS Plans', 
      href: '/admin/plans', 
      icon: CreditCard 
    },
    { 
      name: 'Broadcasts', 
      href: '/admin/messages', 
      icon: Bell 
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F172A] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800 shadow-xl`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-wide block leading-none">
                CakeStore
              </span>
              <span className="text-3xs font-semibold text-indigo-400 uppercase tracking-wider block mt-1">
                Admin Console
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          <div className="px-3 pb-2">
            <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider">
              Platform Governance
            </span>
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2">
            <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Portals
            </span>
          </div>

          <Link
            href="/dashboard/owner"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store size={14} className="text-slate-400" />
              <span>Owner Dashboard</span>
            </span>
            <ExternalLink size={12} className="text-slate-400" />
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-slate-400" />
              <span>Marketplace</span>
            </span>
            <ExternalLink size={12} className="text-slate-400" />
          </Link>
        </div>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};
