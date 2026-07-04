import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CartRepository } from '../../../domain/cart/cart.repository';
import { Cart } from '../../../domain/cart/cart.entity';
import { CartEntity, CartLineEntity, ProductEntity } from '../entities';

@Injectable()
export class DatabaseCartRepository implements CartRepository {
  private cartRepo: Repository<CartEntity>;
  private productRepo: Repository<ProductEntity>;

  constructor(@Inject('DATABASE_CONNECTION') private dataSource: DataSource) {
    this.cartRepo = this.dataSource.getRepository(CartEntity);
    this.productRepo = this.dataSource.getRepository(ProductEntity);
  }

  async findAll(): Promise<Cart[]> {
    const rows = await this.cartRepo.find();
    return rows.map(
      row =>
        new Cart(
          row.id!,
          row.userId!,
          row.totalPrice!,
          row.status!,
          row.createdAt!,
          row.updatedAt!
        )
    );
  }

  async findOne(id: number): Promise<Cart | null> {
    const row = await this.cartRepo.findOne({ where: { id } });
    if (!row) return null;

    return new Cart(
          row.id!,
          row.userId!,
          row.totalPrice!,
          row.status!,
          row.createdAt!,
          row.updatedAt!
    );
  }

  async findOneByUserId(userId: number): Promise<Cart | null> {
    try {
      console.log('Repository: Finding cart for userId:', userId);
      const cart = await this.cartRepo.findOne({ where: { userId: +userId } });
      if (!cart) {
        console.log('Repository: No cart found for userId:', userId);
        return null;
      }

      console.log('Repository: Cart found, fetching lines for cartId:', cart.id);
      const lines = await this.dataSource.getRepository(CartLineEntity).find({ where: { cartId: cart.id } });
      console.log('Repository: Found lines:', lines.length);

      for (const line of lines) {
        const product = await this.productRepo.findOne({ where: { id: line.productId } });
        if (product) {
          line.product = product;
        }
      }

      const cartLines = lines.map(line => ({
        id: line.id!,
        cartId: line.cartId!,
        productId: line.productId!,
        quantity: line.quantity!,
        unitPrice: line.unitPrice!,
        totalPrice: line.totalPrice!,
        status: line.status!,
        createdAt: line.createdAt!,
        updatedAt: line.updatedAt!,
        name: line.name,
        image: line.product?.image
      }));

      console.log('Repository: Mapped cartLines:', cartLines);
      
      return new Cart(
            cart.id!,
            cart.userId!,
            cart.totalPrice!,
            cart.status!,
            cart.createdAt!,
            cart.updatedAt!,
            cartLines
      );
    } catch (error) {
      console.error('Repository: Error in findOneByUserId:', error);
      throw error;
    }
  } 

  getCartByUserId(userId: number): Promise<Cart | null> {
    return this.findOneByUserId(userId);
  } 

  async create(item: Cart): Promise<Cart> {
    console.log('Repository: Creating cart for userId:', item.userId, 'with cartLines:', item.cartLines);
    const result = await this.dataSource.transaction(async (entityManager: any) => {
      const findExistingCart = await this.cartRepo.findOne({ where: { userId: item.userId, status: 1 } });
      console.log('Repository: Existing cart found:', !!findExistingCart);
      if (findExistingCart) {
        for (const line of item.cartLines!) {
          // Validate product exists before creating cart line
          const product = await entityManager.findOne(ProductEntity, { where: { id: line.productId } });
          if (!product) {
            throw new Error(`Product with id ${line.productId} does not exist`);
          }

          const findExistingProductCartLine = 
          await entityManager.find(CartLineEntity, { where: { cartId: findExistingCart.id, productId: line.productId } });
          if (findExistingProductCartLine.length) {
            const existingLine = findExistingProductCartLine[0];
            existingLine.quantity! += line.quantity;
            const unitPriceNum = parseFloat(existingLine.unitPrice!);
            existingLine.totalPrice = (unitPriceNum * existingLine.quantity!).toString();
            await entityManager.save(CartLineEntity, existingLine);
          } else {
          const lineEntity = entityManager.create(CartLineEntity, {
            cartId: findExistingCart.id,
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice.toString(),
            totalPrice: (Number(line.unitPrice) * line.quantity).toString(),
            name: line.name || product.name || 'Unknown Product',
            image: line.image || product.image,
          });

          const savedLine = await entityManager.save(CartLineEntity, lineEntity);
          console.log('Repository: Saved cart line with id:', savedLine.id);
        }
      }
        return findExistingCart;
      }else{
      // 1. Tạo cart
      console.log('Repository: Creating new cart');
      const cartEntity = entityManager.create(CartEntity, item);

      const savedCart = await entityManager.save(
        CartEntity,
        cartEntity,
      );

      console.log('Repository: Saved cart with id:', savedCart.id);

      if (!savedCart.id) {
        throw new Error('Failed to create cart');
      }

      // 2. Validate products and create cart lines
      const lineEntities = [];
      for (const line of item.cartLines!) {
        // Validate product exists before creating cart line
        const product = await entityManager.findOne(ProductEntity, { where: { id: line.productId } });
        if (!product) {
          throw new Error(`Product with id ${line.productId} does not exist`);
        }

        const lineEntity = entityManager.create(CartLineEntity, {
          cartId: savedCart.id,
          productId: line.productId,
          quantity: line.quantity,
          unitPrice: line.unitPrice.toString(),
          totalPrice: (Number(line.unitPrice) * line.quantity).toString(),
          name: line.name || product.name || 'Unknown Product',
          image: line.image || product.image,
        });
        lineEntities.push(lineEntity);
      }

      if (lineEntities.length) {
        const savedLines = await entityManager.save(
          CartLineEntity,
          lineEntities,
        );
        console.log('Repository: Saved', savedLines.length, 'cart lines');
      }

      // 3. Return cart
      return savedCart;
    }
    });
    
    // Fetch cart lines to return complete cart
    const lines = await this.dataSource.getRepository(CartLineEntity).find({ where: { cartId: result.id } });
    
    for (const line of lines) {
      const product = await this.productRepo.findOne({ where: { id: line.productId } });
      if (product) {
        line.product = product;
      }
    }
    
    return new Cart(
      result.id!,
      result.userId!,
      result.totalPrice!,
      result.status!,
      result.createdAt!,
      result.updatedAt!,
      lines.map(line => ({
        id: line.id!,
        cartId: line.cartId!,
        productId: line.productId!,
        quantity: line.quantity!,
        unitPrice: line.unitPrice!,
        totalPrice: line.totalPrice!,
        status: line.status!,
        createdAt: line.createdAt!,
        updatedAt: line.updatedAt!,
        name: line.name,
        image: line.product?.image
      }))
    );
  }

  deleteCartLineById(lineId: number): Promise<void> {
    return this.dataSource.transaction(async (entityManager: any) => {
      const line = await entityManager.findOne(CartLineEntity, { where: { id: lineId } });
      if (!line) {
        throw new Error('Cart line not found');
      }
      await entityManager.delete(CartLineEntity, { id: lineId });
    });
  }

  getCartLinesByUserId(userId: number): Promise<CartLineEntity[]> {
    return this.dataSource.transaction(async (entityManager: any) => {
      const cart = await entityManager.findOne(CartEntity, { where: { userId: userId } });
      if (!cart) {
        return [];
      }
      const lines = await entityManager.find(CartLineEntity, { where: { cartId: cart.id } });
      return lines;
    });
  }

  async clearCartByUserId(userId: number): Promise<void> {
    return this.dataSource.transaction(async (entityManager: any) => {
      const cart = await entityManager.findOne(CartEntity, { where: { userId: userId } });
      if (!cart) {
        return;
      }
      await entityManager.delete(CartLineEntity, { cartId: cart.id });
    });
  }

  async addToCart(userId: number, productId: number, quantity: number, image?: string): Promise<Cart> {
    // This should be implemented via microservice call to sales-svc
    // For now, delegate to create method as a temporary fix
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      throw new Error(`Product with id ${productId} does not exist`);
    }

    const price = product.price ?? 0;

    return this.create({
      id: 0,
      userId,
      totalPrice: '0',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      cartLines: [{
        id: 0,
        cartId: 0,
        productId,
        quantity,
        unitPrice: price.toString(),
        totalPrice: (price * quantity).toString(),
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: product.name,
        image: image || product.image
      }]
    });
  }
}

