import { ProductCostMutationRequest, SupplierMutationRequest } from '../../../../packages/contracts/grpc/interface/grpc-products.service';
import { IProductCost, ISupplier } from '../../../../packages/contracts/model/product/supplier-cost.model';
import { ProductService } from '../product.service';
export declare class SupplierProductCostGrpcController {
    private readonly productService;
    constructor(productService: ProductService);
    createSupplier(request: SupplierMutationRequest): Promise<ISupplier>;
    listSuppliers(request: {
        search: string;
        status: number;
        hasStatus: boolean;
        page: number;
        limit: number;
    }): Promise<{
        items: ISupplier[];
        total: number;
        page: number;
        limit: number;
    }>;
    getSupplier(request: {
        id: number;
    }): Promise<ISupplier>;
    updateSupplier(request: SupplierMutationRequest): Promise<ISupplier>;
    updateSupplierStatus(request: {
        id: number;
        status: number;
    }): Promise<ISupplier>;
    createProductCost(request: ProductCostMutationRequest): Promise<IProductCost>;
    listProductCosts(request: {
        productId: number;
        supplierId: number;
        search: string;
        from: string;
        to: string;
        page: number;
        limit: number;
        hasProductId: boolean;
        hasSupplierId: boolean;
    }): Promise<{
        items: IProductCost[];
        total: number;
        page: number;
        limit: number;
    }>;
    getProductCost(request: {
        id: string;
    }): Promise<IProductCost>;
    updateProductCost(request: ProductCostMutationRequest): Promise<IProductCost>;
    listProductCostHistory(request: {
        productId: number;
        page: number;
        limit: number;
    }): Promise<{
        items: IProductCost[];
        total: number;
        page: number;
        limit: number;
    }>;
    getLatestProductCost(request: {
        productId: number;
    }): Promise<{
        found: boolean;
        item: IProductCost;
    }>;
    getProductCostSummary(): Promise<{
        totalImports: string;
        totalValue: string;
        productsWithCost: string;
    }>;
    private listCosts;
    private supplierInput;
    private productCostInput;
    private mapSupplier;
    private mapCost;
    private run;
    private positiveId;
    private page;
    private limit;
    private statusValue;
    private optionalSearch;
    private optionalText;
    private money;
    private date;
    private optionalDate;
    private bigId;
    private isoDate;
    private invalid;
}
