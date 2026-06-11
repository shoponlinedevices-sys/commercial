import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import { CartEntity, CartLineEntity } from '../entities';
import { CartRepository as DomainCartRepository } from '../../../domain/cart/cart.repository';
import { Cart } from '../../../domain/cart/cart.entity';
import { CartLine } from '../../../domain/cart/cart-line.entity';

@Injectable()
export class CartRepository extends DomainCartRepository {
  private cartRepo: Repository<CartEntity>;
  private cartLineRepo: Repository<CartLineEntity>;

  constructor(@Inject('DATABASE_CONNECTION') private dataSource: DataSource) {
    super();
    this.cartRepo = this.dataSource.getRepository(CartEntity);
    this.cartLineRepo = this.dataSource.getRepository(CartLineEntity);
  }

  async findAll(): Promise<Cart[]> {
    const carts = await this.cartRepo.find({ relations: { cartLines: true } });
    return carts.map(cart => this.entityToDomain(cart));
  }

  async findOne(id: number): Promise<Cart | null> {
    const cart = await this.cartRepo.findOne({ where: { id }, relations: { cartLines: true } });
    return cart ? this.entityToDomain(cart) : null;
  }

  async getCartByUserId(userId: number): Promise<Cart | null> {
    const cart = await this.cartRepo.findOne({ 
      where: { userId, status: 1 }, 
      relations: { cartLines: true } 
    });
    return cart ? this.entityToDomain(cart) : null;
  }

  async create(item: Cart): Promise<Cart> {
    console.log('Repository: Creating cart with item:', JSON.stringify(item));
    try {
      const cart = this.cartRepo.create({
        userId: item.userId,
        status: item.status || 1,
      });
      const savedCart = await this.cartRepo.save(cart);

      if (item.cartLines && item.cartLines.length > 0) {
        const cartLines = item.cartLines.map(line =>
          this.cartLineRepo.create({
            cartId: savedCart.id,
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            name: line.name,
            status: line.status || 1,
          })
        );
        await this.cartLineRepo.save(cartLines);
      }

      return this.entityToDomain(savedCart);
    } catch (error) {
      console.error('Repository: Error creating cart:', error);
      throw error;
    }
  }

  async addToCart(userId: number, productId: number, quantity: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { userId, status: 1 },
      relations: { cartLines: true },
    });

    if (!cart) {
      cart = this.cartRepo.create({
        userId,
        status: 1,
      });
      cart = await this.cartRepo.save(cart);
    }

    const existingCartLine = cart.cartLines?.find(line => line.productId === productId);

    if (existingCartLine) {
      existingCartLine.quantity = (existingCartLine.quantity || 0) + quantity;
      await this.cartLineRepo.save(existingCartLine);
    } else {
      const newCartLine = this.cartLineRepo.create({
        cartId: cart.id,
        productId,
        quantity,
      });
      await this.cartLineRepo.save(newCartLine);
    }

    // Reload cart with relations
    const updatedCart = await this.cartRepo.findOne({
      where: { id: cart.id },
      relations: { cartLines: true },
    });

    return updatedCart ? this.entityToDomain(updatedCart) : this.entityToDomain(cart);
  }

  async clearCartByUserId(userId: number): Promise<void> {
    await this.cartLineRepo.delete({ cart: { userId } });
    await this.cartRepo.delete({ userId });
  }

  private entityToDomain(entity: CartEntity): Cart {
    const id = entity.id !== undefined ? entity.id : 0;
    const userId = entity.userId !== undefined ? entity.userId : 0;
    return new Cart(
      id,
      userId,
      entity.totalPrice ?? '0',
      entity.status ?? 1,
      entity.createdAt ?? new Date(),
      entity.updatedAt ?? new Date(),
      entity.cartLines?.map(line => new CartLine(
        line.id !== undefined ? line.id : 0,
        line.cartId ?? 0,
        line.productId ?? 0,
        line.quantity ?? 1,
        line.unitPrice ?? '0',
        line.totalPrice ?? '0',
        line.status ?? 1,
        line.createdAt ?? new Date(),
        line.updatedAt ?? new Date(),
        line.name
      )) ?? []
    );
  }
}
