import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { Public } from '../../domain/identity/public.decorator';
import { AddToCartDto } from './dto/cart.dto';
import { CartService } from '../../application/cart/cart.service';
import { Cart } from '../../domain/cart/cart.entity';
import { ProductService } from '../../application/product/product.service';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(parseInt(id, 10));
  }

  @Public()
  @Get('/by-user-id/:userId')
  async getCartByUserId(@Param('userId') userId: number) {
    try {
      console.log('Fetching cart for userId:', userId);
      const result = await this.cartService.getCartByUserId(userId);
      console.log('getCartByUserId result:', result);
      return { cart: result };
    } catch (error) {
      console.error('Error in getCartByUserId controller:', error);
      throw error;
    }
  }

  @Public()
  @Post()
  async addToCart(
    @Body() body: AddToCartDto
  ) {
    try {
      console.log('Controller: addToCart called with body:', JSON.stringify(body));
      const product = await this.productService.findOne(body.productId);
      console.log('Controller: Product found:', product ? product.name : 'null');
      if (!product) {
        throw new Error(`Product with id ${body.productId} not found`);
      }

      const cartLines = body.cartLines || [{
        productId: body.productId,
        quantity: body.quantity,
        unitPrice: product.price || 0
      }];

      console.log('Controller: cartLines before mapping:', JSON.stringify(cartLines));

      // Ensure each cart line has the product name
      const cartLinesWithName = cartLines.map(line => ({
        ...line,
        name: product.name,
        totalPrice: (line.unitPrice * line.quantity).toString()
      }));

      console.log('Controller: cartLines after mapping:', JSON.stringify(cartLinesWithName));

      const item = {
        id: 0,
        userId: body.userId!,
        totalPrice: '0',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        cartLines: cartLinesWithName as any
      } as Cart;

      console.log('Controller: Cart item to create:', JSON.stringify(item));
      const result = await this.cartService.create(item);
      console.log('Controller: Cart created successfully:', JSON.stringify(result));
      return result;
    } catch (error) {
      console.error('Controller: Error in addToCart:', error);
      throw error;
    }
  }

  @Public()
  @Delete('/lines/:id')
  removeFromCart(@Param('id') id: string) {
    console.log(`Attempting to delete cart line with id: ${id}`);
    // Implement logic to remove item from cart
    return this.cartService.deleteCartLineById(parseInt(id, 10));
  }

  @Public()
  @Get('/lines/user/:userId')
  getCartLinesByUserId(@Param('userId') userId: number) {
    return this.cartService.getCartLinesByUserId(userId);
  }

  @Public()
  @Delete('/user/:userId')
  clearCartByUserId(@Param('userId') userId: number) {
    return this.cartService.clearCartByUserId(userId);
  }
}
