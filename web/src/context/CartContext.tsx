'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '@/services/cart.service';

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
  addToCart: (productId: number, quantity?: number, image?: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const countCartProductTypes = (productIds: number[]) => new Set(productIds).size;

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const cartCountRequestId = useRef(0);

  const refreshCartCount = useCallback(async () => {
    const requestId = ++cartCountRequestId.current;
    if (!isAuthenticated || !user?.id) {
      setCartCount(0);
      return;
    }

    try {
      const cartLines = await cartService.getCartLinesByUserId(user.id);
      if (requestId === cartCountRequestId.current) {
        setCartCount(countCartProductTypes(cartLines.map((line) => line.productId)));
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  }, [isAuthenticated, user?.id]);

  const addToCart = async (productId: number, quantity: number = 1, image?: string) => {
    if (!isAuthenticated || !user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      ++cartCountRequestId.current;
      await cartService.addToCart({
        userId: user.id,
        productId,
        quantity,
        image
      });
      await refreshCartCount();
    } catch (error) {
      console.error('Error adding to cart:', error);
      await refreshCartCount();
      throw error;
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
