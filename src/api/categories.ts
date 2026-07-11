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
    try {
      const response = await apiClient.get<Category[]>('/categories/featured');
      return response.data;
    } catch (error) {
      // Fallback if backend hasn't implemented featured categories yet
      const response = await apiClient.get<Category[]>('/categories');
      const categories = response.data;
      const sorted = [...categories].sort((a, b) => {
        if (a.type === 'SERVICE' && b.type !== 'SERVICE') return -1;
        if (a.type !== 'SERVICE' && b.type === 'SERVICE') return 1;
        return 0;
      });
      return sorted.slice(0, 8); // Return top 8 categories
    }
  }
};
