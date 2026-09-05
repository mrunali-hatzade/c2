"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentSubscription } from "@/lib/api/subscription";
import { getStoredRole, getStoredToken, isStoredTokenExpired, clearAuthSession } from "@/lib/api/auth";

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = getStoredToken();
    if (!token || isStoredTokenExpired()) {
      clearAuthSession();
      router.replace("/login");
      return;
    }

    const role = getStoredRole();
    if (role === "ADMIN") {
      // Admin attempted to access owner dashboard -> redirect to Admin Console
      router.replace("/admin");
      return;
    }

    // Check subscription status for Shop Owner
    const verifySubscription = async () => {
      try {
        const sub = await getCurrentSubscription();
        if (sub) {
          const isExpired = sub.status === "EXPIRED" || 
            sub.status === "SUSPENDED" ||
            (sub.expiryDate && new Date(sub.expiryDate).getTime() < Date.now());

          // If expired and not already on the subscription renewal page, redirect to renew
          if (isExpired && pathname !== "/dashboard/owner/subscription") {
            router.replace("/dashboard/owner/subscription");
            return;
          }
        }
        setAuthorized(true);
      } catch (e) {
        // Allow pass-through on network glitch so owner isn't locked out
        setAuthorized(true);
      }
    };

    verifySubscription();
  }, [router, pathname]);

  if (!authorized) return null;

  return <>{children}</>;
}
