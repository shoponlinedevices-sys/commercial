'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '@/services/cart.service';

interface CartContextType {
  cartCount: number;
  cartQuantities: Record<number, number>;
  refreshCartCount: () => Promise<void>;
  addToCart: (productId: number, quantity?: number, image?: string) => Promise<void>;
  setCartQuantity: (productId: number, quantity: number, image?: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const countCartItems = (cartLines: { quantity: number }[]) =>
  cartLines.reduce((count, line) => count + line.quantity, 0);

const getCartQuantities = (cartLines: { productId: number; quantity: number }[]) =>
  cartLines.reduce<Record<number, number>>((quantities, line) => {
    quantities[line.productId] = line.quantity;
    return quantities;
  }, {});

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});
  const cartCountRequestId = useRef(0);

  const refreshCartCount = useCallback(async () => {
    const requestId = ++cartCountRequestId.current;
    if (!isAuthenticated || !user?.id) {
      setCartCount(0);
      setCartQuantities({});
      return;
    }

    try {
      const cartLines = await cartService.getCartLinesByUserId(user.id);
      if (requestId === cartCountRequestId.current) {
        setCartCount(countCartItems(cartLines));
        setCartQuantities(getCartQuantities(cartLines));
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  }, [isAuthenticated, user?.id]);

  const addToCart = async (productId: number, quantity: number = 1, image?: string) => {
    if (!isAuthenticated || !user?.id) {
      throw new Error('User not authenticated');
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Cart quantity must be a positive integer');
    }

    const previousQuantity = cartQuantities[productId] ?? 0;
    try {
      ++cartCountRequestId.current;
      await cartService.addToCart({
        userId: user.id,
        productId,
        quantity,
        image,
      });
      setCartCount((count) => count + quantity);
      setCartQuantities((quantities) => ({
        ...quantities,
        [productId]: (quantities[productId] ?? previousQuantity) + quantity,
      }));
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const setCartQuantity = async (productId: number, quantity: number, image?: string) => {
    if (!isAuthenticated || !user?.id) {
      throw new Error('User not authenticated');
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error('Cart quantity must be a non-negative integer');
    }

    const cartLines = await cartService.getCartLinesByUserId(user.id);
    const existingLine = cartLines.find((line) => line.productId === productId);
    const previousQuantity = cartQuantities[productId] ?? Number(existingLine?.quantity ?? 0);

    if (existingLine) {
      if (existingLine.id === undefined) {
        throw new Error('Cart line ID is missing');
      }

      if (quantity === 0) {
        await cartService.removeCartLine(existingLine.id);
      } else {
        await cartService.updateCartLineQuantity(existingLine.id, quantity);
      }
    } else if (quantity > 0) {
      await cartService.addToCart({
        userId: user.id,
        productId,
        quantity,
        image,
      });
    }

    ++cartCountRequestId.current;
    setCartCount((count) => count + quantity - previousQuantity);
    setCartQuantities((quantities) => {
      const updatedQuantities = { ...quantities };
      if (quantity === 0) {
        delete updatedQuantities[productId];
      } else {
        updatedQuantities[productId] = quantity;
      }
      return updatedQuantities;
    });
  };

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, cartQuantities, refreshCartCount, addToCart, setCartQuantity }}>
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
