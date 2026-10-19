import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CartItem, Product } from './types';

type AppContextValue = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, startDate?: string, endDate?: string) => void;
  removeFromCart: (id: string) => void;
  updateCartDates: (id: string, startDate: string, endDate: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);
const defaultStart = '2026-10-18';
const defaultEnd = '2026-10-20';

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('rentkart-cart') ?? '[]'));
  const [wishlist, setWishlist] = useState<string[]>(() => JSON.parse(localStorage.getItem('rentkart-wishlist') ?? '[]'));

  useEffect(() => localStorage.setItem('rentkart-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('rentkart-wishlist', JSON.stringify(wishlist)), [wishlist]);

  const value = useMemo<AppContextValue>(() => ({
    cart,
    wishlist,
    addToCart: (product, startDate = defaultStart, endDate = defaultEnd) => setCart((current) => current.some((item) => item.product.id === product.id) ? current.map((item) => item.product.id === product.id ? { ...item, startDate, endDate } : item) : [...current, { product, startDate, endDate }]),
    removeFromCart: (id) => setCart((current) => current.filter((item) => item.product.id !== id)),
    updateCartDates: (id, startDate, endDate) => setCart((current) => current.map((item) => item.product.id === id ? { ...item, startDate, endDate } : item)),
    toggleWishlist: (id) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
    isWishlisted: (id) => wishlist.includes(id),
  }), [cart, wishlist]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
