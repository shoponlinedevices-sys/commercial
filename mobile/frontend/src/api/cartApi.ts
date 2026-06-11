import { authorizedRequest } from './apiClient';
import { rawApiRequest } from './httpClient';
import { ICart, IAddToCart, ICartLine } from './interface';

export async function getCart(userId: number): Promise<ICart> {
    console.log('[cartApi] Fetching cart for userId:', userId);
    const response = await authorizedRequest<any>(`/cart/by-user-id/${userId}`, {
        method: 'GET'
    });
    console.log('[cartApi] Raw response:', response);
    console.log('[cartApi] Response.cart:', response?.cart);
    console.log('[cartApi] Response.cartLines:', response?.cartLines);
    console.log('[cartApi] Is response an array?', Array.isArray(response));
    // Handle both wrapped response { cart: ICart } and direct response ICart
    const result = response?.cart || response || { cartLines: [] };
    console.log('[cartApi] Final result:', result);
    return result;
}

export async function addProductToCart(cart: IAddToCart): Promise<ICart> {
    return await rawApiRequest<ICart>('/cart', {
    method: 'POST',
    body: JSON.stringify(cart)
  });
}

export async function rmCartLine(cartLineId: number): Promise<void> {
  try {
    await rawApiRequest(`/cart/lines/${cartLineId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error removing cart line:', error);
    throw error;
  }
}

export async function getCartLinesByUserId(userId: number): Promise<ICartLine[]> {
  try{
    console.log('getCartLinesByUserId', userId);
    const response = await rawApiRequest<ICartLine[]>(`/cart/lines/user/${userId}`, {
      method: 'GET'
    });
    // Ensure response is always an array
    return Array.isArray(response) ? response : [];
  }
  catch (error) {
    console.error('Error fetching cart lines:', error);
    // Return empty array on error to prevent filter errors
    return [];
  }
}

export async function clearCartByUserId(userId: number): Promise<void> {
  try {
    await authorizedRequest<void>(`/cart/user/${userId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}
