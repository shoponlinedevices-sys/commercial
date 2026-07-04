import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Public } from '../../domain/identity/public.decorator';
import { AddToCartDto } from './dto/cart.dto';
import { CartService } from '../../application/cart/cart.service';
import { Cart } from '../../domain/cart/cart.entity';
import { ProductService } from '../../application/product/product.service';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all carts' })
  @ApiResponse({ status: 200, description: 'List of carts retrieved successfully' })
  findAll() {
    return this.cartService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get cart by ID' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(parseInt(id, 10));
  }

  @Public()
  @Get('/by-user-id/:userId')
  @ApiOperation({ summary: 'Get cart by user ID' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
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
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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

      console.log('Controller: Calling cartService.addToCart');
      const result = await this.cartService.addToCart(body.userId, body.productId, body.quantity, body.image);
      console.log('Controller: Cart created successfully:', JSON.stringify(result));
      return result;
    } catch (error) {
      console.error('Controller: Error in addToCart:', error);
      throw error;
    }
  }

  @Public()
  @Delete('/lines/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  removeFromCart(@Param('id') id: string) {
    console.log(`Attempting to delete cart line with id: ${id}`);
    // Implement logic to remove item from cart
    return this.cartService.deleteCartLineById(parseInt(id, 10));
  }

  @Public()
  @Get('/lines/user/:userId')
  @ApiOperation({ summary: 'Get cart lines by user ID' })
  @ApiResponse({ status: 200, description: 'Cart lines retrieved successfully' })
  getCartLinesByUserId(@Param('userId') userId: number) {
    return this.cartService.getCartLinesByUserId(userId);
  }

  @Public()
  @Delete('/user/:userId')
  @ApiOperation({ summary: 'Clear cart by user ID' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  clearCartByUserId(@Param('userId') userId: number) {
    return this.cartService.clearCartByUserId(userId);
  }
}
