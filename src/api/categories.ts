import { apiClient } from './client';

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  icon: string;
  itemCount: number;
  featured: boolean;
  type: 'PRODUCT' | 'SERVICE';
}

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  getFeaturedCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories/featured');
    return response.data;
  }
};
