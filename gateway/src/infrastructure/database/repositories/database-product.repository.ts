import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Product } from '../../../domain/product/product.entity';
import { ProductRepository } from '../../../domain/product/product.repository';

@Injectable()
export class DatabaseProductRepository implements ProductRepository {
  private productRepo: Repository<ProductEntity>;

  constructor(@Inject('DATABASE_CONNECTION') private dataSource: DataSource) {
    this.productRepo = this.dataSource.getRepository(ProductEntity);
  }

  async findAll(): Promise<Product[]> {
    const rows = await this.productRepo.find({ where: { status: 1 } });
    return rows.map(
      row =>
        new Product(
          row.id!,
          row.name!,
          Number(row.price),
          row.description ?? '',
          row.image ?? '',
          row.oldPrice !== null && row.oldPrice !== undefined ? Number(row.oldPrice) : undefined,
          row.badge ?? undefined,
          row.sku ?? undefined,
          row.unit ?? undefined,
          row.moq ?? undefined,
        ),
    );
  }

  async findOne(id: number): Promise<Product | null> {
    const row = await this.productRepo.findOne({ where: { id, status: 1 } });
    if (!row) return null;

    return new Product(
      row.id!,
      row.name!,
      Number(row.price),
      row.description ?? '',
      row.image ?? '',
      row.oldPrice !== null && row.oldPrice !== undefined ? Number(row.oldPrice) : undefined,
      row.badge ?? undefined,
      row.sku ?? undefined,
      row.unit ?? undefined,
      row.moq ?? undefined,
    );
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    const rows = await this.productRepo.find({ where: { category: categoryId, status: 1 } });
    return rows.map(
      row =>
        new Product(
          row.id!,
          row.name!,
          Number(row.price),
          row.description ?? '',
          row.image ?? '',
          row.oldPrice !== null && row.oldPrice !== undefined ? Number(row.oldPrice) : undefined,
          row.badge ?? undefined,
          row.sku ?? undefined,
          row.unit ?? undefined,
          row.moq ?? undefined,
        ),
    );
  }
}
