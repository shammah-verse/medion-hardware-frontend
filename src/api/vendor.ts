import { apiClient } from './client';
import type { Product } from './products';
import type { Store } from './stores';

export interface CreateStorePayload {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  subscriptionType: 'COMMISSION' | 'PREMIUM';
  phoneNumber?: string;
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

  getMyStores: async (): Promise<Store[]> => {
    // Currently backend only supports 1 store, but this is future-proof
    // For now we'll call /stores/my-store and wrap in array if we have to, 
    // or just call /stores/my-stores assuming backend adds it.
    try {
      const response = await apiClient.get<Store[]>('/stores/my-stores');
      return response.data;
    } catch (e: any) {
      // Fallback if the endpoint doesn't exist yet, we try the old one and wrap it
      if (e.response?.status === 404) {
        const response = await apiClient.get<Store>('/stores/my-store');
        return [response.data];
      }
      throw e;
    }
  },

  createStore: async (data: CreateStorePayload): Promise<{ store: Store; paymentUrl?: string; mpesaStatus?: string }> => {
    const response = await apiClient.post<{ store: Store; paymentUrl?: string; mpesaStatus?: string }>('/stores', data);
    return response.data;
  },

  getStoreSubscriptionStatus: async (storeId: string): Promise<string> => {
    const response = await apiClient.get<string>(`/payments/store-subscription/${storeId}/status`);
    return response.data;
  },

  getStoreProducts: async (storeId: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/stores/${storeId}/products`);
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
