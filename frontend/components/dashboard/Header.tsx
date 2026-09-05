"use client";

import React, { useEffect, useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface HeaderProps {
  onMenuClick: () => void;
  shopName?: string;
  ownerName?: string;
}

interface ShopProfile {
  id: number;
  businessName?: string;
  businessCategory?: string;
  logoUrl?: string;
}

export default function Header({ onMenuClick, shopName, ownerName }: HeaderProps) {
  const [profile, setProfile] = useState<ShopProfile | null>(null);

  useEffect(() => {
    if (!shopName) {
      apiClient<ShopProfile>('/api/shops/my-shop')
        .then((res) => setProfile(res))
        .catch(() => {
          // Fallback gracefully if endpoint is unavailable
        });
    }
  }, [shopName]);

  const displayName = shopName || profile?.businessName || "My Bakery";
  const displayRole = ownerName || "Owner";

  return (
    <header className="h-16 bg-white border-b border-gray-200/80 shadow-2xs flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shrink-0">
      
      {/* Left side: Mobile menu toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-gray-800 p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Right side: Notifications & Shop Owner Identity */}
      <div className="flex items-center gap-3 sm:gap-5">
        
        {/* Notification Bell */}
        <button 
          className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={19} />
          {/* Notification unread badge indicator */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-7 w-px bg-gray-200 hidden sm:block"></div>

        {/* Shop Owner Profile Pill */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-full bg-[#FAF0F2] text-[#5B1C2E] font-bold text-xs flex items-center justify-center border border-[#5B1C2E]/20 shadow-2xs shrink-0 overflow-hidden">
            {profile?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.logoUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span>{displayName.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-gray-900 leading-tight">
              {displayName}
            </span>
            <span className="text-3xs text-gray-500 font-medium leading-tight">
              {displayRole}
            </span>
          </div>
        </div>

      </div>

    </header>
  );
}
