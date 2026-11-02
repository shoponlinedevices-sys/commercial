import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from 'src/product.service';
import { IProduct, IProductsGroupedByCategoryResponse, IGetProductsResponse, IFindProducts } from '../../../../packages/contracts/model/product/product.model';
import { Id } from '../../../../packages/contracts/model/common/common.model';

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

  @GrpcMethod('ProductService', 'FindOne')
  async findOne(id: Id): Promise<IProduct> {
    return this.productService.findOne(id);
  }

  @GrpcMethod('ProductService', 'FindAll')
  async findAll(input: IFindProducts): Promise<IGetProductsResponse> {
    return await this.productService.findAll(input);
  }
}
