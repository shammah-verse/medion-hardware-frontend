import { apiClient } from './client';
import type { Product } from './products';
import type { Store } from './stores';

export interface CreateStorePayload {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
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
  }
};
