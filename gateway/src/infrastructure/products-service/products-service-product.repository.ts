import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ProductRepository } from '../../domain/product/product.repository';
import { Product } from '../../domain/product/product.entity';
import { ClientGrpc } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';
import { IGrpcProductService } from '../../../../packages/contracts/grpc/interface/grpc-products.service';
import { IGetProductsRequest } from '../../../../packages/contracts/model/product/product.model';

@Injectable()
export class ProductsServiceProductRepository implements ProductRepository {
  private grpcProductService!: IGrpcProductService;

  constructor(
    @Inject('GRPC_PRODUCTS_SERVICE')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.grpcProductService = this.client.getService<IGrpcProductService>('ProductService');
  }

  private toProduct(productData: any): Product {
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
  }

  async findAll(): Promise<Product[]> {
    const response = await firstValueFrom(
      this.grpcProductService.getProducts({}),
    );
    return (response.products || []).map((product) => this.toProduct(product));
  }

  async findOne(id: number): Promise<Product | null> {
    try {
      const response = await firstValueFrom(
        this.grpcProductService.getProduct({ id }),
      );
      return response.product ? this.toProduct(response.product) : null;
    } catch (error: any) {
      if (error.code === status.NOT_FOUND) return null;
      throw error;
    }
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    const request: IGetProductsRequest = { category: String(categoryId) };
    const response = await firstValueFrom(
      this.grpcProductService.getProducts(request),
    );
    return (response.products || []).map((product) => this.toProduct(product));
  }
}
