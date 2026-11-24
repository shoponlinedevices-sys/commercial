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

const countCartItems = (cartLines: { quantity: number }[]) =>
  cartLines.reduce((count, line) => count + line.quantity, 0);

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
        setCartCount(countCartItems(cartLines));
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  }, [isAuthenticated, user?.id]);

  const addToCart = async (productId: number, quantity: number = 1, image?: string) => {
    if (!isAuthenticated || !user?.id) {
      throw new Error('User not authenticated');
    }

    let existingCartLineId: number | undefined;
    let previousQuantity: number | undefined;
    try {
      const cartLines = await cartService.getCartLinesByUserId(user.id);
      const existingLine = cartLines.find((line) => line.productId === productId);
      if (existingLine) {
        existingCartLineId = existingLine.id;
        previousQuantity = Number(existingLine.quantity);
      } else {
        previousQuantity = 0;
      }
    } catch (error) {
      console.error('Error checking cart before adding product:', error);
    }

    try {
      ++cartCountRequestId.current;
      if (existingCartLineId !== undefined && previousQuantity !== undefined) {
        await cartService.updateCartLineQuantity(existingCartLineId, previousQuantity + quantity);
      } else {
        await cartService.addToCart({
          userId: user.id,
          productId,
          quantity,
          image
        });
      }
      await refreshCartCount();
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (previousQuantity !== undefined) {
        try {
          const cartLines = await cartService.getCartLinesByUserId(user.id);
          const addedLine = cartLines.find((line) => line.productId === productId);
          if (addedLine && addedLine.quantity >= previousQuantity + quantity) {
            setCartCount(countCartItems(cartLines));
            return;
          }
        } catch (verificationError) {
          console.error('Error verifying cart after failed add:', verificationError);
        }
      }
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
