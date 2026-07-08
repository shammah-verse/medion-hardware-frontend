import { apiClient } from './client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  active: boolean;
}

export const productsApi = {
  getActiveProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products/active');
    return response.data;
  },
};
