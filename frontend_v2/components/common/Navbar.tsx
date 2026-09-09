'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cake, Menu, X, User } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore Bakeries', href: '/explore' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'For Owners', href: '/for-owners' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
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
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive
                    ? 'text-brand-plum font-semibold'
                    : 'text-brand-espresso/75 hover:text-brand-plum hover:bg-brand-blush/40'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-brand-plum rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Marketplace Auth & Owner Registration CTA */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-brand-espresso hover:text-brand-plum font-semibold">
              Owner Login
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button variant="primary" size="sm" className="shadow-sm font-bold">
              Register Bakery
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-brand-espresso hover:bg-brand-cream-light rounded-xl transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-border/60 bg-white px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-blush text-brand-plum font-semibold'
                    : 'text-brand-espresso hover:bg-brand-cream-light'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-brand-border/60 flex flex-col gap-2 mt-2">
            <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full font-bold" size="sm">
                Register Bakery
              </Button>
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full font-semibold" size="sm">
                Owner Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
