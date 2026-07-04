
import { AddToCartDto } from '../../adapters/cart/dto/cart.dto';
import { Cart } from './cart.entity';

export abstract class CartRepository {
  abstract findAll(): Promise<Cart[]>;
  abstract findOne(id: number): Promise<Cart | null>;
  abstract getCartByUserId(userId: number): Promise<Cart | null>;
  abstract create(item: Cart): Promise<Cart>;
  abstract addToCart(userId: number, productId: number, quantity: number, image?: string): Promise<Cart>;
  abstract clearCartByUserId(userId: number): Promise<void>;
}
