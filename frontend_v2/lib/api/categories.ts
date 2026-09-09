import { apiClient } from './client';
import { Category, CategoryRequest } from '@/types/product';

export const categoriesApi = {
  getOwnerCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/api/owner/categories');
  },

  createCategory: async (request: CategoryRequest): Promise<Category> => {
    return apiClient.post<Category>('/api/owner/categories', request);
  },

  updateCategory: async (id: number, request: CategoryRequest): Promise<Category> => {
    return apiClient.put<Category>(`/api/owner/categories/${id}`, request);
  },

  deleteCategory: async (id: number, reassignToCategoryId?: number | null): Promise<{ message?: string }> => {
    const params = reassignToCategoryId ? { reassignToCategoryId } : undefined;
    return apiClient.delete<{ message?: string }>(`/api/owner/categories/${id}`, { params });
  },
};
