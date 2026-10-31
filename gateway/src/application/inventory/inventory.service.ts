import { Injectable } from '@nestjs/common';
import { IProductSaleStock } from '../../../../packages/contracts/model/product/product.model';
import { ProductsGrpcClient } from '../../infrastructure/grpc/products-grpc.client';

const PRODUCTS_SERVICE_URL = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003';

async function callProductsService<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${PRODUCTS_SERVICE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Products service request failed');
  }

  return payload as T;
}

@Injectable()
export class InventoryService {
   constructor(
        private readonly productService: ProductsGrpcClient,
    ) {}
  async getSummary() {
    return callProductsService<any>('/inventory/summary');
  }

  async getItems(page = 1, limit = 10, search = '', category = '', status = '') {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (status) params.set('status', status);

    return callProductsService<any>(`/inventory?${params.toString()}`);
  }

  async getItem(productId: number) {
    return callProductsService<any>(`/inventory/${productId}`);
  }

  async getTransactions(page = 1, limit = 20, productId?: number, type?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (productId !== undefined) params.set('productId', String(productId));
    if (type) params.set('type', type);
    return callProductsService<any>(`/inventory/transactions?${params.toString()}`);
  }

  async importStock(data: { productId: number; quantity: number; unitCost?: number; reference?: string; note?: string; createdBy?: number }) {
    return callProductsService<any>('/inventory/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async reserveStock(data: { productId: number; quantity: number; referenceType?: string; referenceId?: string; note?: string; createdBy?: number }) {
    return callProductsService<any>('/inventory/reserve', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async releaseStock(data: { productId: number; quantity: number; referenceType?: string; referenceId?: string; note?: string; createdBy?: number }) {
    return callProductsService<any>('/inventory/release', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // async saleStock(data: { productId: number; quantity: number; referenceType?: string; referenceId?: string; note?: string; createdBy?: number }) {
  //   return callProductsService<any>('/inventory/sale', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //   });
  // }

  async saleStock(data: IProductSaleStock) {
    return await this.productService.saleStock(data)
  }


  async returnStock(data: { productId: number; quantity: number; referenceType?: string; referenceId?: string; note?: string; createdBy?: number }) {
    return callProductsService<any>('/inventory/return', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async adjustStock(data: { productId: number; quantityAfter: number; reason: string; note?: string; createdBy?: number }) {
    return callProductsService<any>('/inventory/adjustments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
