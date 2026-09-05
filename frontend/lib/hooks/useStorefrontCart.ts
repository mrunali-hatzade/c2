"use client";

import { useState, useEffect, useCallback } from "react";
import { StorefrontOrderItemPayload } from "@/lib/api/customerCheckout";

export interface CartItemWithMeta extends StorefrontOrderItemPayload {
  imageUrl?: string;
  weight?: string;
  tags?: string[];
}

export interface CartStorageState {
  shopId: number;
  shopName: string;
  items: CartItemWithMeta[];
  couponCode?: string;
}

const CART_STORAGE_KEY = "cake_cart";
const CART_EVENT_NAME = "cake_cart_updated";

export function useStorefrontCart(shopId?: number, shopName?: string) {
  const [items, setItems] = useState<CartItemWithMeta[]>([]);
  const [activeShopId, setActiveShopId] = useState<number | undefined>(shopId);
  const [activeShopName, setActiveShopName] = useState<string | undefined>(shopName);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string>("SWEET20");
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage
  const loadCart = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed: CartStorageState = JSON.parse(raw);
        if (parsed.items && Array.isArray(parsed.items)) {
          // If shopId is specified and doesn't match, or if shopId matches
          if (!shopId || parsed.shopId === shopId) {
            setItems(parsed.items);
            setActiveShopId(parsed.shopId);
            setActiveShopName(parsed.shopName);
            if (parsed.couponCode) setCouponCode(parsed.couponCode);
          }
        }
      }
    } catch (err) {
      console.error("Error reading cart from localStorage:", err);
    }
  }, [shopId]);

  useEffect(() => {
    setIsMounted(true);
    loadCart();

    const handleStorageChange = () => {
      loadCart();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(CART_EVENT_NAME, handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(CART_EVENT_NAME, handleStorageChange);
    };
  }, [loadCart]);

  // Persist to localStorage and dispatch custom event
  const persistCart = useCallback(
    (newItems: CartItemWithMeta[], code?: string) => {
      if (typeof window === "undefined") return;
      const sId = shopId || activeShopId || 4;
      const sName = shopName || activeShopName || "Bakery Storefront";
      const payload: CartStorageState = {
        shopId: sId,
        shopName: sName,
        items: newItems,
        couponCode: code !== undefined ? code : couponCode,
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
      window.dispatchEvent(new Event(CART_EVENT_NAME));
    },
    [shopId, activeShopId, shopName, activeShopName, couponCode]
  );

  const addItem = useCallback(
    (item: CartItemWithMeta) => {
      setItems((prev) => {
        const existingIdx = prev.findIndex((i) => i.productId === item.productId);
        let next: CartItemWithMeta[];
        if (existingIdx >= 0) {
          next = [...prev];
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: next[existingIdx].quantity + (item.quantity || 1),
            cakeMessage: item.cakeMessage || next[existingIdx].cakeMessage,
            dietaryPreference: item.dietaryPreference || next[existingIdx].dietaryPreference,
          };
        } else {
          next = [...prev, { ...item, quantity: item.quantity || 1 }];
        }
        persistCart(next);
        return next;
      });
      setIsCartOpen(true);
    },
    [persistCart]
  );

  const updateQuantity = useCallback(
    (productId: number, qty: number) => {
      setItems((prev) => {
        let next: CartItemWithMeta[];
        if (qty <= 0) {
          next = prev.filter((i) => i.productId !== productId);
        } else {
          next = prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i));
        }
        persistCart(next);
        return next;
      });
    },
    [persistCart]
  );

  const removeItem = useCallback(
    (productId: number) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.productId !== productId);
        persistCart(next);
        return next;
      });
    },
    [persistCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new Event(CART_EVENT_NAME));
    }
  }, []);

  const applyCoupon = useCallback(
    (code: string) => {
      setCouponCode(code);
      persistCart(items, code);
    },
    [items, persistCart]
  );

  // Computed Values
  const subtotal = items.reduce((acc, item) => acc + (item.unitPrice || 0) * (item.quantity || 1), 0);
  const discount = couponCode === "SWEET20" && subtotal > 0 ? Math.min(500, Math.round(subtotal * 0.2)) : 0;
  const deliveryFee = subtotal > 0 ? 99 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const totalItemCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return {
    items,
    itemCount: isMounted ? totalItemCount : 0,
    subtotal,
    discount,
    deliveryFee,
    total,
    couponCode,
    isCartOpen,
    setIsCartOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    isMounted,
  };
}
