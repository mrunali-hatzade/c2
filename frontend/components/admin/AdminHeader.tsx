"use client";

import React from 'react';
import { Menu, ShieldCheck, User } from 'lucide-react';

interface AdminHeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
            Platform Production Mode
          </span>
        </div>
      </div>

      {/* Admin Identity Badge */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-900">Platform SuperAdmin</p>
          <p className="text-3xs text-slate-400">Full System Privileges</p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
          <ShieldCheck size={18} className="text-indigo-400" />
        </div>
      </div>
    </header>
  );
};
