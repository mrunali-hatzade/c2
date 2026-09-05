'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cake, Menu, X, Store, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-brand-plum text-white flex items-center justify-center shadow-soft">
            <Cake className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-brand-espresso block leading-none">
              CakeStore
            </span>
            <span className="text-[10px] tracking-wider uppercase text-brand-muted font-medium">
              Artisanal Bakery Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/explore"
            className={`text-sm font-medium transition-colors ${
              pathname === '/explore' ? 'text-brand-plum font-semibold' : 'text-brand-espresso/80 hover:text-brand-plum'
            }`}
          >
            Explore Bakeries
          </Link>
          <Link
            href="/onboarding"
            className={`text-sm font-medium transition-colors ${
              pathname === '/onboarding' ? 'text-brand-plum font-semibold' : 'text-brand-espresso/80 hover:text-brand-plum'
            }`}
          >
            For Bakery Owners
          </Link>
        </nav>

        {/* Auth CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href={user?.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard/owner'}>
                <Button size="sm" variant="outline">
                  <User className="w-3.5 h-3.5 mr-1.5" />
                  {user?.role === 'ROLE_ADMIN' ? 'Admin Panel' : 'Owner Dashboard'}
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={logout}>
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Owner Login
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button variant="primary" size="sm">
                  Register Bakery
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-brand-espresso hover:bg-brand-cream-light rounded-xl transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-border/60 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-brand-espresso"
          >
            Explore Bakeries
          </Link>
          <Link
            href="/onboarding"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-brand-espresso"
          >
            For Bakery Owners
          </Link>
          <div className="pt-3 border-t border-brand-border/60 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href={user?.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard/owner'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full" size="sm">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">
                    Owner Login
                  </Button>
                </Link>
                <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full" size="sm">
                    Register Bakery
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
