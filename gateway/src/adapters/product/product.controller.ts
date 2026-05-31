import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { ProductService } from '../../application/product/product.service';
import { JwtAuthGuard } from '../../domain/identity/jwt-auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(parseInt(id, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':categoryId/products')
  findByCategory(@Param('categoryId') categoryId: number) {
    return this.productService.findByCategory(categoryId);
  }
}
