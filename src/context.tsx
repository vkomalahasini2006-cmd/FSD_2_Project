import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CartItem, Product } from './types';
import { dateAfter, today } from './utils';
import { useAuth } from './auth-context';

type AppContextValue = {
  cart: CartItem[];
  wishlist: string[];
  clearCart: () => void;
  addToCart: (product: Product, startDate?: string, endDate?: string) => void;
  removeFromCart: (id: string) => void;
  updateCartDates: (id: string, startDate: string, endDate: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);
const defaultStart = today();
const defaultEnd = dateAfter(2);

type UserShoppingData = {
  userId: string | null;
  cart: CartItem[];
  wishlist: string[];
};

function readStoredData<T>(key: string, isValid: (value: unknown) => value is T, emptyValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return emptyValue;

    const value: unknown = JSON.parse(stored);
    if (isValid(value)) return value;
    console.error(`Ignoring invalid RentKart data in localStorage key "${key}"`);
  } catch (error) {
    console.error(`Unable to read RentKart data from localStorage key "${key}"`, error);
  }

  return emptyValue;
}

function isCartItemArray(value: unknown): value is CartItem[] {
  return Array.isArray(value) && value.every((item) =>
    typeof item === 'object' &&
    item !== null &&
    'product' in item &&
    typeof item.product === 'object' &&
    item.product !== null &&
    'id' in item.product &&
    typeof item.product.id === 'string' &&
    'startDate' in item &&
    typeof item.startDate === 'string' &&
    'endDate' in item &&
    typeof item.endDate === 'string'
  );
}

function isWishlistArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [shoppingData, setShoppingData] = useState<UserShoppingData>({
    userId: null,
    cart: [],
    wishlist: [],
  });

  useEffect(() => {
    if (!userId) {
      setShoppingData({ userId: null, cart: [], wishlist: [] });
      return;
    }

    const storageId = encodeURIComponent(userId);
    setShoppingData({
      userId,
      cart: readStoredData(`rentkart-cart:${storageId}`, isCartItemArray, []),
      wishlist: readStoredData(`rentkart-wishlist:${storageId}`, isWishlistArray, []),
    });
  }, [userId]);

  useEffect(() => {
    if (!userId || shoppingData.userId !== userId) return;

    const storageId = encodeURIComponent(userId);
    localStorage.setItem(`rentkart-cart:${storageId}`, JSON.stringify(shoppingData.cart));
    localStorage.setItem(`rentkart-wishlist:${storageId}`, JSON.stringify(shoppingData.wishlist));
  }, [shoppingData, userId]);

  const cart = useMemo(
    () => shoppingData.userId === userId ? shoppingData.cart : [],
    [shoppingData, userId],
  );
  const wishlist = useMemo(
    () => shoppingData.userId === userId ? shoppingData.wishlist : [],
    [shoppingData, userId],
  );

  const value = useMemo<AppContextValue>(() => ({
    cart,
    wishlist,
    clearCart: () => setShoppingData((current) => ({
      userId,
      cart: [],
      wishlist: current.userId === userId ? current.wishlist : [],
    })),
    addToCart: (product, startDate = defaultStart, endDate = defaultEnd) => setShoppingData((current) => {
      const currentCart = current.userId === userId ? current.cart : [];
      return {
        userId,
        cart: currentCart.some((item) => item.product.id === product.id)
          ? currentCart.map((item) => item.product.id === product.id ? { ...item, startDate, endDate } : item)
          : [...currentCart, { product, startDate, endDate }],
        wishlist: current.userId === userId ? current.wishlist : [],
      };
    }),
    removeFromCart: (id) => setShoppingData((current) => ({
      userId,
      cart: (current.userId === userId ? current.cart : []).filter((item) => item.product.id !== id),
      wishlist: current.userId === userId ? current.wishlist : [],
    })),
    updateCartDates: (id, startDate, endDate) => setShoppingData((current) => ({
      userId,
      cart: (current.userId === userId ? current.cart : []).map((item) => item.product.id === id ? { ...item, startDate, endDate } : item),
      wishlist: current.userId === userId ? current.wishlist : [],
    })),
    toggleWishlist: (id) => setShoppingData((current) => {
      const currentWishlist = current.userId === userId ? current.wishlist : [];
      return {
        userId,
        cart: current.userId === userId ? current.cart : [],
        wishlist: currentWishlist.includes(id) ? currentWishlist.filter((item) => item !== id) : [...currentWishlist, id],
      };
    }),
    isWishlisted: (id) => wishlist.includes(id),
  }), [cart, wishlist, userId]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
