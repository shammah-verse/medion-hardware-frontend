import { apiClient } from './client';

export interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number; // distance from user in kilometers or miles
  openingHours: string;
}

export const storesApi = {
  getNearest: async (lat: number, lon: number): Promise<Store> => {
    const response = await apiClient.get<Store>('/stores/nearest', {
      params: { lat, lon }
    });
    return response.data;
  }
};
