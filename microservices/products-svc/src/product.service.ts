import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from './category.entity';
import { HistoryLogEntity } from './history-log.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  private get productRepository() {
    return this.dataSource.getRepository(ProductEntity);
  }

  async getHistoryLogs(limit = 200) {
    return this.dataSource.getRepository(HistoryLogEntity).find({
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 500),
    });
  }

  async getProducts(filters?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (filters?.search) {
      queryBuilder.andWhere('product.name LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    if (filters?.category) {
      // Query category table to get ID from name
      const categoryRepo = this.dataSource.getRepository(CategoryEntity);
      const category = await categoryRepo.findOne({
        where: { name: filters.category, is_active: 1 },
      });

      if (category) {
        queryBuilder.andWhere('product.category = :category', {
          category: category.id.toString(),
        });
      } else {
        // If category name not found, try direct match (for backward compatibility)
        queryBuilder.andWhere('product.category = :category', {
          category: filters.category,
        });
      }
    }

    if (filters?.limit) {
      queryBuilder.limit(filters.limit);
    }

    if (filters?.offset) {
      queryBuilder.offset(filters.offset);
    }

    const products = await queryBuilder.getMany();
    const total = await queryBuilder.getCount();

    return {
      products,
      total,
    };
  }

  async getProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return { product };
  }

  async createProduct(input: {
    name: string;
    price: number;
    description?: string;
    image?: string;
    oldPrice?: number;
    badge?: string;
    sku?: string;
    unit?: string;
    moq?: string;
    category?: string;
    createdBy?: string;
  }) {
    const product = this.productRepository.create({
      name: input.name,
      price: input.price,
      description: input.description || '',
      image: input.image || '',
      oldPrice: input.oldPrice,
      badge: input.badge,
      sku: input.sku,
      unit: input.unit,
      moq: input.moq,
      category: input.category,
    });
    const savedProduct = await this.productRepository.save(product);
    await this.dataSource.getRepository(HistoryLogEntity).save({
      action: 'CREATE',
      entityType: 'PRODUCT',
      entityId: String(savedProduct.id),
      source: 'products-svc',
      createdBy: input.createdBy || 'system',
      metadata: { name: savedProduct.name, price: savedProduct.price, sku: savedProduct.sku },
    });
    return { product: savedProduct };
  }
}
