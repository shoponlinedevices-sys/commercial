import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/product/product.repository';
import { Product } from '../../domain/product/product.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProductsServiceProductRepository implements ProductRepository {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<Product[]> {
    try {
      const response = await this.httpService.axiosRef.get(
        `${process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003'}/products`,
      );
      
      const productsData = response.data.products || response.data;
      return productsData.map((productData: any) =>
        new Product(
          productData.id,
          productData.name,
          Number(productData.price),
          productData.description || '',
          productData.image || '',
          productData.oldPrice !== null && productData.oldPrice !== undefined ? Number(productData.oldPrice) : undefined,
          productData.badge || undefined,
          productData.sku || undefined,
          productData.unit || undefined,
          productData.moq || undefined,
        ),
      );
    } catch (error) {
      console.error('[ProductsServiceProductRepository] Error fetching products:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Product | null> {
    try {
      const response = await this.httpService.axiosRef.get(
        `${process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003'}/products/${id}`,
      );
      
      const productData = response.data;
      if (!productData) return null;

      return new Product(
        productData.id,
        productData.name,
        Number(productData.price),
        productData.description || '',
        productData.image || '',
        productData.oldPrice !== null && productData.oldPrice !== undefined ? Number(productData.oldPrice) : undefined,
        productData.badge || undefined,
        productData.sku || undefined,
        productData.unit || undefined,
        productData.moq || undefined,
      );
    } catch (error: any) {
      console.error('[ProductsServiceProductRepository] Error fetching product:', error);
      if (error.response?.status === 404) return null;
      throw error;
    }
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    try {
      const response = await this.httpService.axiosRef.get(
        `${process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003'}/products?category=${categoryId}`,
      );
      
      const productsData = response.data.products || response.data;
      return productsData.map((productData: any) =>
        new Product(
          productData.id,
          productData.name,
          Number(productData.price),
          productData.description || '',
          productData.image || '',
          productData.oldPrice !== null && productData.oldPrice !== undefined ? Number(productData.oldPrice) : undefined,
          productData.badge || undefined,
          productData.sku || undefined,
          productData.unit || undefined,
          productData.moq || undefined,
        ),
      );
    } catch (error) {
      console.error('[ProductsServiceProductRepository] Error fetching products by category:', error);
      throw error;
    }
  }
}
