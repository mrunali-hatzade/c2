"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPlatformStats } from '@/lib/api/admin';
import { getStoredRole, getStoredToken, isStoredTokenExpired, clearAuthSession } from '@/lib/api/auth';

interface Props {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: Props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = getStoredToken();
    if (!token || isStoredTokenExpired()) {
      clearAuthSession();
      router.replace('/login');
      return;
    }

    const role = getStoredRole();
    if (role === 'SHOP_OWNER') {
      // Authenticated user is a Shop Owner, not an Admin
      router.replace('/dashboard/owner');
      return;
    }

    // Verify token with backend protected admin endpoint
    const verifyAdmin = async () => {
      try {
        await getPlatformStats();
        setAuthorized(true);
      } catch (err) {
        // Token invalid or unauthorized for admin
        clearAuthSession();
        router.replace('/login');
      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center space-y-3 text-white">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Verifying Administrator Privileges...
        </p>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
