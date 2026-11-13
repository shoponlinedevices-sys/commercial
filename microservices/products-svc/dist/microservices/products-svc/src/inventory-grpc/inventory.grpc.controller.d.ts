import { OriginProductService } from 'src/services/product.service';
import { IProductSaleStock, ISaleInventory } from '../../../../packages/contracts/model/product/product.model';
import { IInventorySummary } from '../../../../packages/contracts/model/inventory/inventory.model';
export declare class InventoryGrpcController {
    private readonly productService;
    private readonly logger;
    constructor(productService: OriginProductService);
    private normalizeCreatedBy;
    saleStock(body: {
        input: IProductSaleStock;
    }): Promise<ISaleInventory>;
    returnInventory(body: {
        input: IProductSaleStock;
    }): Promise<ISaleInventory>;
    summary(): Promise<IInventorySummary>;
}
