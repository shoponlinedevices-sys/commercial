import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../domain/cart/cart.repository';
import { Cart } from '../../domain/cart/cart.entity';
import { AddToCartDto } from '../../adapters/cart/dto/cart.dto';
import { CartLineEntity } from '../../infrastructure/database/entities';


@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  findAll(): Promise<Cart[]> {
    return this.cartRepository.findAll();
  }

  findOne(id: number): Promise<Cart | null> {
    return this.cartRepository.findOne(id);
  }

  async getCartByUserId(userId: number): Promise<Cart | null> {
    try {
      console.log('Service: Fetching cart for userId:', userId);
      const result = await this.cartRepository.getCartByUserId(userId);
      console.log('Service: Cart result:', result);
      return result;
    } catch (error) {
      console.error('Service: Error fetching cart by userId:', error);
      throw error;
    }
  }

  async create(item: Cart): Promise<Cart> {
    console.log('Service: Creating cart with item:', JSON.stringify(item));
    try {
      const result = await this.cartRepository.create(item);
      console.log('Service: Cart created successfully:', JSON.stringify(result));
      return result;
    } catch (error) {
      console.error('Service: Error creating cart:', error);
      throw error;
    }
  }

  async addToCart(userId: number, productId: number, quantity: number, image?: string): Promise<Cart> {
    console.log('Service: Adding to cart - userId:', userId, 'productId:', productId, 'quantity:', quantity, 'image:', image);
    try {
      const result = await this.cartRepository.addToCart(userId, productId, quantity, image);
      console.log('Service: Item added to cart successfully:', JSON.stringify(result));
      return result;
    } catch (error) {
      console.error('Service: Error adding to cart:', error);
      throw error;
    }
  }

  deleteCartLineById(id: number): Promise<void> {
   try{
      return (this.cartRepository as any).deleteCartLineById(id);
    }
    catch (error) {
      console.error('Error deleting cart line:', error);
      throw error;
    }
  }

  async getCartLinesByUserId(userId: number): Promise<CartLineEntity[]> {
    try {
      return (this.cartRepository as any).getCartLinesByUserId(userId);
    } catch (error) {
      console.error('Error fetching cart lines:', error);
      throw error;
    }
  }

  async clearCartByUserId(userId: number): Promise<void> {
    try {
      await this.cartRepository.clearCartByUserId(userId);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
}
