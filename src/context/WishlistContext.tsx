import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';

export interface WishlistItem {
  productId: string;
  variantId?: string;
  variantLabel?: string;
  weight?: string;
  price?: number;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string, variantId?: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (productId: string, variantId?: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'sappay_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
        setWishlistItems([]);
      }
    }
    setIsInitialized(true);
  }, []);

  // Persist to localStorage whenever wishlist changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isInitialized]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems((prev) => {
      const exists = prev.some(
        (w) => w.productId === item.productId && w.variantId === item.variantId
      );
      if (!exists) {
        return [...prev, item];
      }
      return prev;
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string, variantId?: string) => {
    setWishlistItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      )
    );
  }, []);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems((prev) => {
      const exists = prev.some(
        (w) => w.productId === item.productId && w.variantId === item.variantId
      );
      if (exists) {
        return prev.filter(
          (w) => !(w.productId === item.productId && w.variantId === item.variantId)
        );
      }
      return [...prev, item];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string, variantId?: string): boolean => {
      return wishlistItems.some(
        (item) => item.productId === productId && item.variantId === variantId
      );
    },
    [wishlistItems]
  );

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
