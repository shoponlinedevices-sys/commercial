import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('history-logs')
  async getHistoryLogs(@Query('limit') limit?: string) {
    return this.productService.getHistoryLogs(Number(limit) || 200);
  }

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

  @Post()
  createProduct(@Body() body: {
    name: string;
    price: number;
    description?: string;
    image?: string;
    oldPrice?: number;
    badge?: string;
    sku?: string;
    unit?: string;
    moq?: string;
    category?: string;
  }) {
    return this.productService.createProduct(body);
  }
}
