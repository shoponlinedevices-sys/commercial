import { apiClient } from '../lib/api-client';
import { GATEWAY_URL, PRODUCTS_BASE_URL } from '../lib/api-config';
import { Product, ProductCategory, AdBanner } from '../types';

export const productService = {
  async getProducts(category?: string): Promise<Product[]> {
    const endpoint = category ? `/products?category=${encodeURIComponent(category)}` : '/products';
    const response = await apiClient.get<{ products: Product[]; total: number }>(endpoint, PRODUCTS_BASE_URL);
    return response.products || [];
  },

  async getProductsGroupedByCategory(): Promise<ProductCategory[]> {
    return await apiClient.get<ProductCategory[]>('/products/grouped-by-category', GATEWAY_URL);
  },

  async getProduct(id: number): Promise<Product> {
    return await apiClient.get<Product>(`/products/${id}`, PRODUCTS_BASE_URL);
  },

  async getAds(): Promise<AdBanner[]> {
    return await apiClient.get<AdBanner[]>('/ads', PRODUCTS_BASE_URL);
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await apiClient.get<{ products: Product[]; total: number }>(`/products?search=${encodeURIComponent(query)}`, PRODUCTS_BASE_URL);
    return response.products || [];
  },
};
