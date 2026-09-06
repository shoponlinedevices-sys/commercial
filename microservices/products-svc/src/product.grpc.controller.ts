import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';

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
