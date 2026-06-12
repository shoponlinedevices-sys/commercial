'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '@/services/cart.service';

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    if (!isAuthenticated || !user?.id) {
      setCartCount(0);
      return;
    }

    try {
      const cartLines = await cartService.getCartLinesByUserId(user.id);
      const count = cartLines.filter(line => line.status === 1).length;
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, [isAuthenticated, user?.id]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
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
