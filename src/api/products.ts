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

export interface Review {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewPayload {
  rating: number;
  comment: string;
}

export const productsApi = {
  getActiveProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products/active');
    return response.data;
  },
  
  getProduct: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      const all = await productsApi.getActiveProducts();
      const found = all.find(p => p.id === id);
      if (!found) throw new Error('Product not found');
      return found;
    }
  },

  getReviews: async (productId: string): Promise<Review[]> => {
    try {
      const response = await apiClient.get<Review[]>(`/products/${productId}/reviews`);
      return response.data;
    } catch (error) {
      return [];
    }
  },
  
  addReview: async (productId: string, payload: ReviewPayload): Promise<Review> => {
    const response = await apiClient.post<Review>(`/products/${productId}/reviews`, payload);
    return response.data;
  },
};
