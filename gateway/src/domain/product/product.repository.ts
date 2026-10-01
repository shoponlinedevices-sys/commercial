import { IProductsGroupedByCategoryResponse } from '../../../../packages/contracts/model/product/product.model';
import { Product } from './product.entity';

export abstract class ProductRepository {
  abstract findAll(): Promise<Product[]>;
  abstract findOne(id: number): Promise<Product | null>;
  abstract findByCategory(categoryId: number): Promise<Product[]>;
  abstract create(data: Omit<Product, 'id'> & { createdBy?: string | number }): Promise<Product>;
  abstract groupedByCategory(filters?: {
    search?: string;
    categoryId?: number;
    limit?: number;
    offset?: number;
  }): Promise<IProductsGroupedByCategoryResponse[]>;
}
