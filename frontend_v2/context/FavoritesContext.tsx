'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { useToast } from '@/components/common/Toast';

export interface SavedCakeItem {
  product: Product;
  shopId: number | string;
  shopName: string;
  savedAt: string;
}

interface FavoritesContextType {
  savedCakes: SavedCakeItem[];
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: Product, shopId: number | string, shopName?: string) => void;
  removeFavorite: (productId: number) => void;
  clearFavorites: () => void;
  totalFavorites: number;
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (open: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'cakestore_saved_cakes_v2';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedCakes, setSavedCakes] = useState<SavedCakeItem[]>([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedCakes(JSON.parse(stored));
      }
    } catch {
      setSavedCakes([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCakes));
      } catch {
        // ignore quota errors
      }
    }
  }, [savedCakes, isLoaded]);

  const isFavorite = (productId: number) => {
    return savedCakes.some((item) => item.product.id === productId);
  };

  const toggleFavorite = (product: Product, shopId: number | string, shopName = 'Bakery Boutique') => {
    const exists = savedCakes.some((item) => item.product.id === product.id);
    if (exists) {
      setSavedCakes((prev) => prev.filter((item) => item.product.id !== product.id));
      toast.info(`Removed "${product.name}" from saved cakes`);
    } else {
      const newItem: SavedCakeItem = {
        product,
        shopId,
        shopName,
        savedAt: new Date().toISOString(),
      };
      setSavedCakes((prev) => [newItem, ...prev]);
      toast.success(`Saved "${product.name}" to your wishlist!`);
    }
  };

  const removeFavorite = (productId: number) => {
    setSavedCakes((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearFavorites = () => {
    setSavedCakes([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        savedCakes,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
        totalFavorites: savedCakes.length,
        isFavoritesOpen,
        setIsFavoritesOpen,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
