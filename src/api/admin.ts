import { apiClient } from './client';
import type { Store } from './stores';

export const adminApi = {
  getAllStores: async (): Promise<Store[]> => {
    // In a real scenario, this might be a specific admin endpoint or a paginated stores endpoint.
    // Assuming GET /api/v1/stores returns a list of all stores for the admin.
    const response = await apiClient.get<Store[]>('/stores');
    return response.data;
  }
};
