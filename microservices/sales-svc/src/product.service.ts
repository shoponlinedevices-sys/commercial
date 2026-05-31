import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IGrpcProductService } from '../../../packages/contracts/grpc/interface/grpc-products.service';
import { IGetProductsRequest, IGetProductsResponse, IGetProductRequest, IGetProductResponse } from '../../../packages/contracts/model/product/product.model';

@Injectable()
export class ProductService {
  private grpcProductService: IGrpcProductService;

  constructor(@Inject('PRODUCT_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.grpcProductService = this.client.getService<IGrpcProductService>('ProductService');
  }

  async getProducts(filters?: IGetProductsRequest): Promise<IGetProductsResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcProductService.getProducts(filters)
      );
      return response;
    } catch (error) {
      console.error('Error calling products-svc:', error);
      throw new Error('Failed to fetch products from products-svc');
    }
  }

  async getProduct(request: IGetProductRequest): Promise<IGetProductResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcProductService.getProduct(request)
      );
      return response;
    } catch (error) {
      console.error('Error calling products-svc:', error);
      throw new Error('Failed to fetch product from products-svc');
    }
  }
}
