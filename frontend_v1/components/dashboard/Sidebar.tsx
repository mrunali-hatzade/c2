"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Cake, 
  CreditCard, 
  Settings, 
  LogOut,
  Truck,
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard/owner', icon: LayoutDashboard },
  { name: 'Orders', href: '/dashboard/owner/orders', icon: ShoppingCart },
  { name: 'Products', href: '/dashboard/owner/products', icon: Cake },
  { name: 'Delivery Slots', href: '/dashboard/owner/delivery-slots', icon: Truck },
  { name: 'Subscription', href: '/dashboard/owner/subscription', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/owner/settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 shadow-sm
        transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Logo area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link href="/dashboard/owner" className="text-xl font-bold text-brand-plum">
            CakeStore
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium
                    ${isActive 
                      ? 'bg-brand-plum text-white' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-brand-plum'
                    }
                  `}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-gray-200">
            <button 
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium text-red-600 hover:bg-red-50"
              onClick={() => {
                localStorage.removeItem('authToken');
                router.replace('/login');
              }}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
