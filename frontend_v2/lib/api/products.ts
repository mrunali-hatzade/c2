import { apiClient } from './client';
import { Product, CreateProductRequest } from '@/types/product';

export const productsApi = {
  getOwnerProducts: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/api/owner/products');
  },

  createProduct: async (product: CreateProductRequest): Promise<Product> => {
    return apiClient.post<Product>('/api/owner/products', product);
  },

  updateProduct: async (id: number, product: CreateProductRequest): Promise<Product> => {
    return apiClient.put<Product>(`/api/owner/products/${id}`, product);
  },

  deleteProduct: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/api/owner/products/${id}`);
  },
};
