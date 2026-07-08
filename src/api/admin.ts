import { apiClient } from './client';
import type { Store } from './stores';
import type { Product } from './products';

export const adminApi = {
  getAllStores: async (): Promise<Store[]> => {
    const response = await apiClient.get<Store[]>('/stores');
    return response.data;
  },
  
  deleteStore: async (storeId: string): Promise<void> => {
    await apiClient.delete(`/stores/${storeId}`);
  },

  getStoreProducts: async (storeId: string): Promise<Product[]> => {
    // If backend doesn't have a specific endpoint, we'll try `/products?storeId=` or similar.
    // Assuming backend added GET /stores/{storeId}/products
    const response = await apiClient.get<Product[]>(`/stores/${storeId}/products`);
    return response.data;
  },

  deleteProduct: async (productId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}`);
  }
};
