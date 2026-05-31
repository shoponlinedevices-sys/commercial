import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import { CartEntity, CartLineEntity } from '../entities';

@Injectable()
export class CartRepository {
  private cartRepo: Repository<CartEntity>;
  private cartLineRepo: Repository<CartLineEntity>;

  constructor(@Inject('DATABASE_CONNECTION') private dataSource: DataSource) {
    this.cartRepo = this.dataSource.getRepository(CartEntity);
    this.cartLineRepo = this.dataSource.getRepository(CartLineEntity);
  }

  async addToCart(accountId: number, productId: number, quantity: number): Promise<CartEntity> {
    let cart = await this.cartRepo.findOne({
      where: { userId: accountId, status: 1 },
      relations: { cartLines: true },
    });

    if (!cart) {
      cart = this.cartRepo.create({
        userId: accountId,
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

    return cart;
  }
}
