import { Body, Controller, Get, UseGuards, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from '../../application/product/product.service';
import { JwtAuthGuard } from '../../domain/identity/jwt-auth.guard';
import { Public } from '../../domain/identity/public.decorator';
import { Product } from '../../domain/product/product.entity';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query('category') category?: string) {
    if (category) {
      const categoryId = parseInt(category, 10);
      const products = await this.productService.findByCategory(categoryId);
      return { products, total: products.length };
    }
    const products = await this.productService.findAll();
    return { products, total: products.length };
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(parseInt(id, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a product' })
  create(@Body() body: Omit<Product, 'id'>, @Req() request: any) {
    if (!body.name?.trim() || Number(body.price) < 0) {
      throw new Error('Tên sản phẩm và giá hợp lệ là bắt buộc');
    }
    return this.productService.create({ ...body, name: body.name.trim(), price: Number(body.price), createdBy: request.user?.username || request.user?.id || 'gateway' });
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Get(':categoryId/products')
  @ApiOperation({ summary: 'Get products by category ID' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByCategory(@Param('categoryId') categoryId: number) {
    return this.productService.findByCategory(categoryId);
  }
}
