"use client";

import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      
      {/* Left side: Mobile menu toggle & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">
          Owner Dashboard
        </h1>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors">
          <Bell size={20} />
          {/* Notification badge indicator */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 mx-2"></div>

        <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-brand-plum focus:outline-none">
          <div className="w-8 h-8 bg-brand-cream rounded-full flex items-center justify-center text-brand-plum border border-brand-plum/20">
            <User size={16} />
          </div>
          <span className="hidden sm:block">My Bakery</span>
        </button>
      </div>

    </header>
  );
}
