import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/product/product.entity';
import { ProductRepository } from '../../domain/product/product.repository';
import { IFindProducts, IGetProductsResponse, IProductsGroupedByCategoryResponse } from '../../../../packages/contracts/model/product/product.model';
import { ProductGrpcClient } from '../../infrastructure/grpc/product-grpc.client';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productService: ProductGrpcClient,
  ) {}

  async findAll(input?: IFindProducts): Promise<IGetProductsResponse> {
    return this.productService.findAll(input);
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productService.findOne(id);
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    const result = await this.productService.findByCategory(categoryId);
    if(result && result.products){
      return result.products as Product[];
    }
    return [];
  }

  groupedByCategory(filters?: {
    search?: string;
    categoryId?: number;
    limit?: number;
    offset?: number;
  }): Promise<IProductsGroupedByCategoryResponse[]> {
    return this.productRepository.groupedByCategory(filters);
  }

  create(data: Omit<Product, 'id'> & { createdBy?: string | number }): Promise<Product> {
    return this.productService.create(data);
  }
}
