import { Injectable } from '@nestjs/common';
import { IProductSaleStock } from '../../../../packages/contracts/model/product/product.model';
import { InventoryGrpcClient } from '../../infrastructure/grpc/inventory-grpc.client';

@Injectable()
export class InventoryService {
   constructor(
        private readonly inventoryService: InventoryGrpcClient,
    ) {}
  async getSummary() {
    return await this.inventoryService.summary();
  }

  async getItems(page = 1, limit = 10, search = '', category = '', status = '') {
    return this.inventoryService.getItems({ page, limit, search, category, status });
  }

  async getItem(productId: number) {
    const response = await this.inventoryService.getItem(productId);
    return response.item ? { item: response.item } : { item: null };
  }

  async getTransactions(page = 1, limit = 20, productId?: number, type?: string) {
    return this.inventoryService.getTransactions({ page, limit, productId: productId ?? 0, type: type ?? '' });
  }

  async importStock(data: { productId: number; quantity: number; unitCost?: number; reference?: string; note?: string; createdBy?: number }) {
    return this.inventoryService.importStock(data);
  }

  async reserveStock(data: { productId: number; quantity: number; referenceType?: string; referenceId?: string; note?: string; createdBy?: number }) {
    return this.inventoryService.reserveStock(data);
  }

  async releaseStock(data: { productId: number; quantity: number; referenceType?: string; referenceId?: string; note?: string; createdBy?: number }) {
    return this.inventoryService.releaseStock(data);
  }

  // async saleStock(data: { productId: number; quantity: number; referenceType?: string; referenceId?: string; note?: string; createdBy?: number }) {
  //   return callProductsService<any>('/inventory/sale', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //   });
  // }

  async saleStock(data: IProductSaleStock) {
    return await this.inventoryService.saleStock(data)
  }

  async returnStock(data: { productId: number; quantity: number; referenceType?: string; referenceId?: string; note?: string; createdBy?: number }) {
    return await this.inventoryService.returnInventory(data);
  }

  async adjustStock(data: { productId: number; quantityAfter: number; reason: string; note?: string; createdBy?: number }) {
    return this.inventoryService.adjustStock(data);
  }

  async summary() {
    return await this.inventoryService.summary();
  }
}
