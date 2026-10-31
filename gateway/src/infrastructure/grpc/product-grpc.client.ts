import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IGrpcInventoryService } from '../../../../packages/contracts/grpc/interface/grpc-inventory.service';
import { IGetProductsRequest, IGetProductsResponse, IProductSaleStock } from '../../../../packages/contracts/model/product/product.model';
import { IGrpcProductService } from '../../../../packages/contracts/grpc/interface/grpc-products.service';
import { Product } from '../../domain/product/product.entity';

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
}
