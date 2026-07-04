import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../domain/cart/cart.repository';
import { Cart } from '../../domain/cart/cart.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SalesServiceCartRepository implements CartRepository {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<Cart[]> {
    try {
      const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
      const response = await this.httpService.axiosRef.get(`${salesServiceUrl}/cart`);
      
      const cartsData = response.data;
      return cartsData.map((cartData: any) => 
        new Cart(
          cartData.id,
          cartData.userId,
          cartData.totalPrice,
          cartData.status,
          new Date(cartData.createdAt),
          new Date(cartData.updatedAt),
          cartData.cartLines,
        )
      );
    } catch (error) {
      console.error('[SalesServiceCartRepository] Error fetching carts:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Cart | null> {
    try {
      const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
      const response = await this.httpService.axiosRef.get(`${salesServiceUrl}/cart/${id}`);
      
      const cartData = response.data;
      if (!cartData) return null;

      return new Cart(
        cartData.id,
        cartData.userId,
        cartData.totalPrice,
        cartData.status,
        new Date(cartData.createdAt),
        new Date(cartData.updatedAt),
        cartData.cartLines,
      );
    } catch (error) {
      console.error('[SalesServiceCartRepository] Error fetching cart:', error);
      throw error;
    }
  }

  async getCartByUserId(userId: number): Promise<Cart | null> {
    try {
      console.log(`[SalesServiceCartRepository] Fetching cart for userId: ${userId}`);
      const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
      const url = `${salesServiceUrl}/cart/by-user-id/${userId}`;
      console.log(`[SalesServiceCartRepository] Calling URL: ${url}`);
      
      const response = await this.httpService.axiosRef.get(url);
      
      const cartData = response.data.cart;
      console.log(`[SalesServiceCartRepository] Cart data:`, JSON.stringify(cartData, null, 2));
      
      if (!cartData) {
        console.log(`[SalesServiceCartRepository] No cart found for userId: ${userId}`);
        return null;
      }

      return new Cart(
        cartData.id,
        cartData.userId,
        cartData.totalPrice,
        cartData.status,
        new Date(cartData.createdAt),
        new Date(cartData.updatedAt),
        cartData.cartLines,
      );
    } catch (error) {
      console.error('[SalesServiceCartRepository] Error fetching cart by userId:', error);
      throw error;
    }
  }

  async create(item: Cart): Promise<Cart> {
    try {
      console.log('[SalesServiceCartRepository] Creating cart for userId:', item.userId);
      const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
      
      const response = await this.httpService.axiosRef.post(`${salesServiceUrl}/cart`, {
        userId: item.userId,
        cartLines: item.cartLines,
      });
      
      const cartData = response.data;
      console.log('[SalesServiceCartRepository] Cart created successfully:', JSON.stringify(cartData, null, 2));
      
      return new Cart(
        cartData.id,
        cartData.userId,
        cartData.totalPrice,
        cartData.status,
        new Date(cartData.createdAt),
        new Date(cartData.updatedAt),
        cartData.cartLines,
      );
    } catch (error) {
      console.error('[SalesServiceCartRepository] Error creating cart:', error);
      throw error;
    }
  }

  async deleteCartLineById(id: number): Promise<void> {
    try {
      console.log(`[SalesServiceCartRepository] Deleting cart line with id: ${id}`);
      const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
      
      await this.httpService.axiosRef.delete(`${salesServiceUrl}/cart/lines/${id}`);
      
      console.log(`[SalesServiceCartRepository] Cart line deleted successfully`);
    } catch (error) {
      console.error('[SalesServiceCartRepository] Error deleting cart line:', error);
      throw error;
    }
  }

  async getCartLinesByUserId(userId: number): Promise<any[]> {
    try {
      console.log(`[SalesServiceCartRepository] Fetching cart lines for userId: ${userId}`);
      const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
      const url = `${salesServiceUrl}/cart/lines/user/${userId}`;
      console.log(`[SalesServiceCartRepository] Calling URL: ${url}`);
      
      const response = await this.httpService.axiosRef.get(url);
      
      const cartLinesData = response.data.cartLines || [];
      console.log(`[SalesServiceCartRepository] Found ${cartLinesData.length} cart lines`);
      
      return cartLinesData;
    } catch (error) {
      console.error('[SalesServiceCartRepository] Error fetching cart lines by userId:', error);
      throw error;
    }
  }

  async clearCartByUserId(userId: number): Promise<void> {
    try {
      console.log(`[SalesServiceCartRepository] Clearing cart for userId: ${userId}`);
      const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';

      await this.httpService.axiosRef.delete(`${salesServiceUrl}/cart/user/${userId}`);

      console.log(`[SalesServiceCartRepository] Cart cleared successfully`);
    } catch (error) {
      console.error('[SalesServiceCartRepository] Error clearing cart:', error);
      throw error;
    }
  }

  async addToCart(userId: number, productId: number, quantity: number, image?: string): Promise<Cart> {
    try {
      console.log(`[SalesServiceCartRepository] Adding to cart - userId: ${userId}, productId: ${productId}, quantity: ${quantity}, image: ${image}`);
      const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';

      const response = await this.httpService.axiosRef.post(`${salesServiceUrl}/cart`, {
        userId,
        productId,
        quantity,
        image,
      });

      const cartData = response.data;
      console.log('[SalesServiceCartRepository] Item added to cart successfully:', JSON.stringify(cartData, null, 2));

      return new Cart(
        cartData.id,
        cartData.userId,
        cartData.totalPrice,
        cartData.status,
        new Date(cartData.createdAt),
        new Date(cartData.updatedAt),
        cartData.cartLines,
      );
    } catch (error) {
      console.error('[SalesServiceCartRepository] Error adding to cart:', error);
      throw error;
    }
  }
}
