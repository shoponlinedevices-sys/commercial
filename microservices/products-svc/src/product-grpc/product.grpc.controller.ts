import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from 'src/product.service';
import { IProduct, IProductsGroupedByCategoryResponse, IGetProductsResponse, IFindProducts, IGetProductsGroupedByCategoryRequest, IGetProductsGroupedByCategoryResponse } from '../../../../packages/contracts/model/product/product.model';
import { Id } from '../../../../packages/contracts/model/common/common.model';

@Controller()
export class ProductGrpcController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @GrpcMethod('ProductService', 'GetHistoryLogs')
  async getHistoryLogsGrpc(data: { limit?: number }) {
    const logs = await this.productService.getHistoryLogs(Number(data.limit) || 200);
    return { logs: logs.map((log: any) => ({
      id: String(log.id),
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      source: log.source,
      createdBy: log.createdBy,
      metadata: typeof log.metadata === 'string' ? log.metadata : JSON.stringify(log.metadata || {}),
      createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : String(log.createdAt || ''),
    })) };
  }

  @GrpcMethod('ProductService', 'GetProducts')
  async getProducts(query: any) {
    const result =
      await this.productService.getProducts(query);

    return result;
  }

  @GrpcMethod('ProductService', 'GetProductsGroupedByCategory')
  async getProductsGroupedByCategory(filters?: IGetProductsGroupedByCategoryRequest): Promise<IGetProductsGroupedByCategoryResponse> {
    const result =
      await this.productService.getProductsGroupedByCategory(filters);

    return result;
  }

  @GrpcMethod('ProductService', 'GetProduct')
  async getProduct(request: { id: number }) {
    const result =
      await this.productService.getProduct(request.id);

    return result;
  }

  @GrpcMethod('ProductService', 'CreateProduct')
  async createProduct(request: any) {
    return this.productService.createProduct(request);
  }

  @GrpcMethod('ProductService', 'FindOne')
  async findOne(id: Id): Promise<IProduct> {
    return this.productService.findOne(id);
  }

  @GrpcMethod('ProductService', 'FindAll')
  async findAll(input: IFindProducts): Promise<IGetProductsResponse> {
    return await this.productService.findAll(input);
  }
}
