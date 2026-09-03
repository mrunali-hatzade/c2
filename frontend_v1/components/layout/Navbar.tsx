"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  ChevronDown,
  Search,
  ShoppingBag,
  Menu,
} from "lucide-react";
import { POPULAR_LOCATIONS } from "@/lib/constants/categories";
import { MobileMenu } from "./MobileMenu";

interface NavbarProps {
  selectedLocation?: string;
  onSelectLocation?: (location: string) => void;
  cartCount?: number;
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedLocation = "Pune",
  onSelectLocation = () => {},
  cartCount = 0,
  onSearchClick,
}) => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define nav items with their routes and corresponding homepage section IDs
  const navItems = [
    { label: "Home", href: "/", id: "home", sectionId: "hero" },
    { label: "Explore Bakeries", href: "/explore", id: "explore", sectionId: "bakeries" },
    { label: "How It Works", href: "/how-it-works", id: "how-it-works", sectionId: "how-it-works" },
    { label: "For Owners", href: "/for-owners", id: "for-owners", sectionId: "owner-cta" },
    { label: "Pricing", href: "/pricing", id: "pricing" },
    { label: "Contact Us", href: "/contact", id: "contact" },
  ];

  // Synchronize active menu based on pathname OR homepage scroll position
  useEffect(() => {
    // 1. If we are on a dedicated sub-page, highlight that page's menu item
    if (pathname && pathname !== "/") {
      if (pathname.startsWith("/explore")) setActiveSection("explore");
      else if (pathname.startsWith("/how-it-works")) setActiveSection("how-it-works");
      else if (pathname.startsWith("/for-owners")) setActiveSection("for-owners");
      else if (pathname.startsWith("/pricing")) setActiveSection("pricing");
      else if (pathname.startsWith("/contact")) setActiveSection("contact");
      else setActiveSection("");
      return;
    }

    // 2. If on Homepage ("/"), track scroll position and highlight the section in view
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 180; // Offset for navbar height

          const bakeriesEl = document.getElementById("bakeries");
          const howItWorksEl = document.getElementById("how-it-works");
          const ownerCtaEl = document.getElementById("owner-cta");

          const bakeriesTop = bakeriesEl?.offsetTop ?? Infinity;
          const howItWorksTop = howItWorksEl?.offsetTop ?? Infinity;
          const ownerCtaTop = ownerCtaEl?.offsetTop ?? Infinity;

          if (scrollPos >= ownerCtaTop) {
            setActiveSection("for-owners");
          } else if (scrollPos >= howItWorksTop) {
            setActiveSection("how-it-works");
          } else if (scrollPos >= bakeriesTop) {
            setActiveSection("explore");
          } else {
            setActiveSection("home");
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (
    e: React.MouseEvent,
    item: { href: string; id: string; sectionId?: string }
  ) => {
    setActiveSection(item.id);

    // If clicking "Home" while already at "/", scroll smoothly to top
    if (item.id === "home" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // For all other menu items (/explore, /how-it-works, /for-owners, /pricing, /contact),
    // allow natural Link routing so it opens the dedicated page directly!
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border/70 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-6 lg:gap-8">
              <Link
                href="/"
                onClick={(e) => handleNavClick(e, { href: "/", id: "home", sectionId: "hero" })}
                className="flex items-center gap-2 group flex-shrink-0"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-blush flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
                  🧁
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold font-serif tracking-tight text-brand-espresso flex items-center">
                    Cake<span className="text-brand-plum">Store</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Navigation Links with Active Indicator */}
            <nav className="hidden xl:flex items-center gap-7 text-base font-medium">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`relative py-2 transition-all ${
                      isActive
                        ? "text-brand-plum font-bold"
                        : "text-brand-espresso/75 hover:text-brand-plum"
                    }`}
                  >
                    <span>{item.label}</span>
                    {/* Active highlight indicator bar */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-brand-plum rounded-full animate-in fade-in zoom-in-95 duration-200" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search, Cart, Login/Register */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={onSearchClick}
                className="p-2 rounded-full text-brand-espresso hover:bg-brand-plum-light hover:text-brand-plum transition-colors"
                title="Search cakes & bakeries"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Button with Count Badge */}
              <Link
                href="/checkout"
                className="relative p-2 rounded-full text-brand-espresso hover:bg-brand-plum-light hover:text-brand-plum transition-colors"
                title="View cart & checkout"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-plum text-white text-2xs font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              </Link>

              {/* Login / Register Pill Button */}
              <Link
                href="/for-owners"
                className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full bg-brand-plum text-white text-sm font-semibold hover:bg-brand-plum-hover transition-all shadow-soft active:scale-95"
              >
                Login / Register
              </Link>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg xl:hidden text-brand-espresso hover:bg-brand-plum-light transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={onSelectLocation}
        cartCount={cartCount}
        activeSection={activeSection}
        onNavItemClick={(item) => handleNavClick({ preventDefault: () => {} } as React.MouseEvent, item)}
      />
    </>
  );
};
