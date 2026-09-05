"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuthSession } from '@/lib/api/auth';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Cake, 
  Truck,
  MessageSquare, 
  Users, 
  Star, 
  TrendingUp, 
  Globe, 
  CreditCard, 
  Settings, 
  Tag,
  LogOut,
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  ordersBadgeCount?: number;
  enquiriesBadgeCount?: number;
}

export default function Sidebar({ 
  isOpen, 
  setIsOpen,
  ordersBadgeCount,
  enquiriesBadgeCount,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard/owner', 
      icon: LayoutDashboard,
      badge: null,
      status: 'active'
    },
    { 
      name: 'Orders', 
      href: '/dashboard/owner/orders', 
      icon: ShoppingCart,
      badge: ordersBadgeCount && ordersBadgeCount > 0 ? ordersBadgeCount : null,
      status: 'active'
    },
    { 
      name: 'Products', 
      href: '/dashboard/owner/products', 
      icon: Cake,
      badge: null,
      status: 'active'
    },
    { 
      name: 'Delivery Slots', 
      href: '/dashboard/owner/delivery-slots', 
      icon: Truck,
      badge: null,
      status: 'active'
    },
    { 
      name: 'Enquiries', 
      href: '/dashboard/owner/enquiries', 
      icon: MessageSquare,
      badge: enquiriesBadgeCount && enquiriesBadgeCount > 0 ? enquiriesBadgeCount : null,
      status: 'active'
    },
    { 
      name: 'Customers', 
      href: '/dashboard/owner/customers', 
      icon: Users,
      badge: null,
      status: 'active'
    },
    { 
      name: 'Feedback', 
      href: '/dashboard/owner/reviews', 
      icon: Star,
      badge: null,
      status: 'active'
    },
    { 
      name: 'Coupons', 
      href: '/dashboard/owner/coupons', 
      icon: Tag,
      badge: null,
      status: 'active'
    },
    { 
      name: 'Analytics', 
      href: '/dashboard/owner/analytics', 
      icon: TrendingUp,
      badge: null,
      status: 'active'
    },
    { 
      name: 'Website', 
      href: '/dashboard/owner/website', 
      icon: Globe,
      badge: null,
      status: 'active'
    },
    { 
      name: 'Subscription', 
      href: '/dashboard/owner/subscription', 
      icon: CreditCard,
      badge: null,
      status: 'active'
    },
    { 
      name: 'Settings', 
      href: '/dashboard/owner/settings', 
      icon: Settings,
      badge: null,
      status: 'active'
    },
  ];

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    setIsOpen(false);
    if (item.status === 'upcoming' && !['/dashboard/owner/subscription', '/dashboard/owner/settings', '/dashboard/owner/customers'].includes(item.href)) {
      // Allow navigation or show notice if needed
    }
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container with deep wine/plum background */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-[#3D101E] text-white flex flex-col
        transition-transform duration-300 ease-in-out border-r border-white/5
        md:relative md:translate-x-0 shrink-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <Link href="/dashboard/owner" className="flex items-center gap-2 group">
            <span className="text-2xl font-serif font-bold tracking-tight text-white group-hover:text-brand-blush transition-colors">
              Cake<span className="text-[#E5989B]">Store</span>
            </span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation scrollable list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(item, e)}
                className={`
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold
                  ${isActive 
                    ? 'bg-[#5B1C2E] text-white shadow-sm font-bold border border-white/10' 
                    : 'text-[#E5D0D6] hover:bg-[#4A1525] hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-[#E5989B]' : 'text-[#E5D0D6]/80'} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`
                    text-3xs font-bold px-1.5 py-0.5 rounded-full
                    ${typeof item.badge === 'number' 
                      ? 'bg-rose-500 text-white min-w-4 text-center' 
                      : 'bg-white/10 text-white/80'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Logout Action */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button 
            className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-xs font-semibold text-[#E5D0D6] hover:bg-red-950/40 hover:text-rose-300 cursor-pointer"
            onClick={() => {
              clearAuthSession();
              router.replace('/login');
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
