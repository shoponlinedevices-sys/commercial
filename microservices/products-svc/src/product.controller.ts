import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Query() query: any) {
    return this.productService.getProducts({
      category: query.category,
      search: query.search,
      limit: query.limit ? parseInt(query.limit) : undefined,
      offset: query.offset ? parseInt(query.offset) : undefined,
    });
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productService.getProduct(parseInt(id));
  }
}
