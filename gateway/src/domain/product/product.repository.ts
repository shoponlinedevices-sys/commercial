import { Product } from './product.entity';

export abstract class ProductRepository {
  abstract findAll(): Promise<Product[]>;
  abstract findOne(id: number): Promise<Product | null>;
  abstract findByCategory(categoryId: number): Promise<Product[]>;
  abstract create(data: Omit<Product, 'id'>): Promise<Product>;
}
