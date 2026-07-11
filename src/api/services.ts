import { apiClient } from './client';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  categoryId: string;
  imageUrls: string[];
  active: boolean;
  storeName?: string;
  storeId?: string;
  rating?: number;
}

export const servicesApi = {
  getActiveServices: async (): Promise<Service[]> => {
    const response = await apiClient.get<Service[]>('/services/active');
    return response.data;
  },
  
  getService: async (id: string): Promise<Service> => {
    const response = await apiClient.get<Service>(`/services/${id}`);
    return response.data;
  },

  getServicesByCategory: async (categoryId: string): Promise<Service[]> => {
    const response = await apiClient.get<Service[]>(`/categories/${categoryId}/services`);
    return response.data;
  }
};
