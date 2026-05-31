import { ClientGrpc } from '@nestjs/microservices';
import { IGetProductsRequest, IGetProductsResponse, IGetProductRequest, IGetProductResponse } from '../../../packages/contracts/model/product/product.model';
export declare class ProductService {
    private client;
    private grpcProductService;
    constructor(client: ClientGrpc);
    onModuleInit(): void;
    getProducts(filters?: IGetProductsRequest): Promise<IGetProductsResponse>;
    getProduct(request: IGetProductRequest): Promise<IGetProductResponse>;
}
