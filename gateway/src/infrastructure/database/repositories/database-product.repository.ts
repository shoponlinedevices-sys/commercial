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

    async create(data: Omit<Product, 'id'>): Promise<Product> {
      const row = this.productRepo.create({
        name: data.name,
        price: data.price,
        description: data.description,
        image: data.image,
        oldPrice: data.oldPrice,
        badge: data.badge,
        sku: data.sku,
        unit: data.unit,
        moq: data.moq,
        category: data.category,
        status: 1,
      });
      const saved = await this.productRepo.save(row);
      return new Product(
        saved.id!,
        saved.name!,
        Number(saved.price),
        saved.description ?? '',
        saved.image ?? '',
        saved.oldPrice !== null && saved.oldPrice !== undefined ? Number(saved.oldPrice) : undefined,
        saved.badge ?? undefined,
        saved.sku ?? undefined,
        saved.unit ?? undefined,
        saved.moq ?? undefined,
        saved.category,
      );
    }
}
