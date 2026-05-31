import { authorizedRequest } from './apiClient';
import { rawApiRequest } from './httpClient';
import { ICart, IAddToCart, ICartLine } from './interface';

export async function getCart(userId: number): Promise<ICart> {
    const response = await authorizedRequest<{ cart: ICart }>(`/cart/by-user-id/${userId}`, {
        method: 'GET'
    });
    return response.cart;
}

export async function addProductToCart(cart: IAddToCart): Promise<ICart> {
    return await authorizedRequest<ICart>('/cart', {
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
