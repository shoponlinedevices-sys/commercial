import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IGrpcInventoryService } from '../../../../packages/contracts/grpc/interface/grpc-inventory.service';
import { IFindProducts, IGetProductsGroupedByCategoryRequest, IGetProductsGroupedByCategoryResponse, IGetProductsRequest, IGetProductsResponse, IProductSaleStock, IProductsGroupedByCategoryResponse } from '../../../../packages/contracts/model/product/product.model';
import { IGrpcProductService } from '../../../../packages/contracts/grpc/interface/grpc-products.service';
import { Product } from '../../domain/product/product.entity';
import { ICreateProductRequest } from '../../../../packages/contracts/model/product/product.model';

@Injectable()
export class ProductGrpcClient implements OnModuleInit {
  private productService!: IGrpcProductService;

  constructor(@Inject('GRPC_PRODUCTS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.productService = this.client.getService<IGrpcProductService>('ProductService');
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
      undefined,
      productData.quantityAvailable !== null && productData.quantityAvailable !== undefined
        ? Number(productData.quantityAvailable)
        : undefined,
    );
  }

  findByCategory(categoryId: number): Promise<IGetProductsResponse> {
    const request: IGetProductsRequest = { category: String(categoryId) };
    return firstValueFrom(
          this.productService.getProducts(request),
        );
  };

  async create(data: Omit<Product, 'id'> & { createdBy?: string | number }): Promise<Product> {
    const request: ICreateProductRequest = {
      name: data.name,
      price: data.price,
      description: data.description,
      image: data.image,
      oldPrice: data.oldPrice,
      badge: data.badge,
      sku: data.sku,
      unit: data.unit,
      moq: data.moq,
      category: data.category === undefined ? undefined : String(data.category),
      createdBy: data.createdBy === undefined ? undefined : String(data.createdBy),
    };
    const response = await firstValueFrom(this.productService.createProduct(request));
    return this.toProduct(response.product);
  }

  async findOne(id: number): Promise<Product> {
    const response = await firstValueFrom(this.productService.findOne({ id }));
    if (!response) {
      throw new Error('Product not found');
    }
    return this.toProduct(response);
  }

  async findAll(input?: IFindProducts): Promise<IGetProductsResponse> {
    const response = await firstValueFrom(this.productService.findAll(input));
    return response;
  }

  async groupedByCategory(input?: IGetProductsGroupedByCategoryRequest): Promise<IGetProductsGroupedByCategoryResponse> {
    const response = await firstValueFrom(this.productService.getProductsGroupedByCategory(input));
    return response;
  }
}
