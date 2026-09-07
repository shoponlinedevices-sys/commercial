import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/product/product.entity';
import { ProductRepository } from '../../domain/product/product.repository';

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

  create(data: Omit<Product, 'id'> & { createdBy?: string | number }): Promise<Product> {
    return this.productRepository.create(data);
  }
}
