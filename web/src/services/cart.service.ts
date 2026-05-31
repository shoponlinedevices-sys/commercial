import { apiClient } from '../lib/api-client';
import { CART_BASE_URL } from '../lib/api-config';
import { Cart, CartLine, AddToCart } from '../types';

export const cartService = {
  async getCart(userId: number): Promise<Cart> {
    console.log('[Cart Service] Fetching cart for userId:', userId);
    try {
      const response = await apiClient.get<{ cart: Cart }>(`/cart/by-user-id/${userId}`, CART_BASE_URL);
      console.log('[Cart Service] API response:', JSON.stringify(response));
      console.log('[Cart Service] Cart data:', JSON.stringify(response.cart));
      return response.cart || { cartLines: [] };
    } catch (error) {
      console.error('[Cart Service] Error fetching cart:', error);
      // Return empty cart when error occurs (e.g., cart doesn't exist or 500 error)
      return { cartLines: [] };
    }
  },

  async addToCart(cart: AddToCart): Promise<Cart> {
    return await apiClient.post<Cart>('/cart', cart, CART_BASE_URL);
  },

  async removeCartLine(cartLineId: number): Promise<void> {
    await apiClient.delete(`/cart/lines/${cartLineId}`, CART_BASE_URL);
  },

  async getCartLinesByUserId(userId: number): Promise<CartLine[]> {
    try {
      const response = await apiClient.get<CartLine[]>(`/cart/lines/user/${userId}`, CART_BASE_URL);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching cart lines:', error);
      return [];
    }
  },

  async clearCartByUserId(userId: number): Promise<void> {
    await apiClient.delete(`/cart/user/${userId}`, CART_BASE_URL);
  },
};
