import { apiClient } from './client';
import type { Store } from './stores';
import type { Product } from './products';

export const adminApi = {
  getAllStores: async (): Promise<Store[]> => {
    try {
      // Try hitting the admin endpoint which should return ALL stores including PENDING
      const response = await apiClient.get<Store[]>('/admin/stores');
      return response.data;
    } catch (error) {
      // Fallback to customer-facing /stores endpoint
      const response = await apiClient.get<Store[]>('/stores');
      return response.data;
    }
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

  approveStore: async (storeId: string): Promise<Store> => {
    const response = await apiClient.put<Store>(`/admin/stores/${storeId}/approve`);
    return response.data;
  },

  rejectStore: async (storeId: string): Promise<Store> => {
    const response = await apiClient.put<Store>(`/admin/stores/${storeId}/reject`);
    return response.data;
  },

  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products/active');
    return response.data;
  },

  addProduct: async (data: any): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: any): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (productId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}`);
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
