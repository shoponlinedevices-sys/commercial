import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/product/product.entity';
import { ProductRepository } from '../../domain/product/product.repository';
import { IProductsGroupedByCategoryResponse } from '../../../../packages/contracts/model/product/product.model';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  findOne(id: number): Promise<Product | null> {
    return this.productRepository.findOne(id);
  }

  findByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository.findByCategory(categoryId);
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
    return this.productRepository.create(data);
  }
}
