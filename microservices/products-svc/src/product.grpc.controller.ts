import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { IProductsGroupedByCategoryResponse } from '../../../packages/contracts/model/product/product.model';

@Controller()
export class ProductGrpcController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @GrpcMethod('ProductService', 'GetProducts')
  async getProducts(query: any) {
    const result =
      await this.productService.getProducts(query);

    return result;
  }

  @GrpcMethod('ProductService', 'GetProductsGroupedByCategory')
  async getProductsGroupedByCategory(filters?: {
    search?: string;
    categoryId?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ categories: IProductsGroupedByCategoryResponse[] }> {
    const result =
      await this.productService.getProductsGroupedByCategory(filters);

    return {
      categories: result.map((category: any) => ({
        ...category,
        isActive: category.isActive ?? category.is_active,
      })),
    };
  }

  @GrpcMethod('ProductService', 'GetProduct')
  async getProduct(request: { id: number }) {
    const result =
      await this.productService.getProduct(request.id);

    return result;
  }

  @GrpcMethod('ProductService', 'CreateProduct')
  async createProduct(request: any) {
    return this.productService.createProduct(request);
  }
}
