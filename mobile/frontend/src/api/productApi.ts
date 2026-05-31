import { authorizedRequest } from './apiClient';
import { rawApiRequest } from './httpClient';
import { AdBanner, IProduct } from './interface/product';
import { PRODUCTS_SERVICE_BASE_URL } from './config';

export async function fetchProducts(category?: string): Promise<IProduct[]> {
  const url = category ? `/products?category=${encodeURIComponent(category)}` : '/products';
  const response = await authorizedRequest<{ products: IProduct[]; total: number }>(url, {}, PRODUCTS_SERVICE_BASE_URL);
  return response.products || [];
}

export async function fetchProductsByCategoryId(categoryId?: number): Promise<IProduct[]> {
  const url = categoryId ? `/products?category=${encodeURIComponent(categoryId)}` : '/products';
  const response = await authorizedRequest<{ products: IProduct[]; total: number }>(url, {}, PRODUCTS_SERVICE_BASE_URL);
  return response.products || [];
}

export async function fetchProduct(id: number): Promise<IProduct> {
  return await authorizedRequest<IProduct>(`/products/${id}`, {}, PRODUCTS_SERVICE_BASE_URL);
}

export async function fetchAds(): Promise<AdBanner[]> {
  return await rawApiRequest<AdBanner[]>('/ads', {}, 0, PRODUCTS_SERVICE_BASE_URL);
}
