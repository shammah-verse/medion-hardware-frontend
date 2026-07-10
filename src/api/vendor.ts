import { apiClient } from './client';
import type { Product } from './products';
import type { Store } from './stores';

export interface CreateStorePayload {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  subscriptionType: 'COMMISSION' | 'PREMIUM';
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  active: boolean;
}

export const vendorApi = {
  getMyStore: async (): Promise<Store> => {
    const response = await apiClient.get<Store>('/stores/my-store');
    return response.data;
  },

  createStore: async (data: CreateStorePayload): Promise<Store> => {
    const response = await apiClient.post<Store>('/stores', data);
    return response.data;
  },

  getStoreProducts: async (): Promise<Product[]> => {
    // Assuming backend filters by store id based on JWT or we hit a specific endpoint
    // Fallback to active products if backend doesn't have a specific vendor products endpoint yet
    const response = await apiClient.get<Product[]>('/products/active'); 
    return response.data;
  },

  addProduct: async (data: CreateProductPayload): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<CreateProductPayload>): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  uploadProductImage: async (productId: string, file: File): Promise<Product> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<Product>(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProductImage: async (productId: string, imageUrl: string): Promise<Product> => {
    const encodedUrl = encodeURIComponent(imageUrl);
    const response = await apiClient.delete<Product>(`/products/${productId}/images?imageUrl=${encodedUrl}`);
    return response.data;
  }
};
