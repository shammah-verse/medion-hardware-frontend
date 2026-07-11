import { apiClient } from './client';
import type { Product } from './products';

export interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number; // distance from user in kilometers or miles
  openingHours: string;
  status?: 'PENDING' | 'PENDING_PAYMENT' | 'ACTIVE' | 'REJECTED' | 'APPROVED';
  ownerName?: string;
  logoUrl?: string;
  bannerUrl?: string;
  bio?: string;
  adsUrls?: string[];
  isFollowing?: boolean;
}

export interface StoreAnalytics {
  totalFollowers: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
}

export const storesApi = {
  getNearest: async (lat: number, lon: number): Promise<Store> => {
    const response = await apiClient.get<Store>('/stores/nearest', {
      params: { lat, lon }
    });
    return response.data;
  },

  getAll: async (): Promise<Store[]> => {
    const response = await apiClient.get<Store[]>('/stores');
    return response.data;
  },

  getStore: async (id: string): Promise<Store> => {
    const response = await apiClient.get<Store>(`/stores/${id}`);
    return response.data;
  },

  followStore: async (id: string): Promise<void> => {
    await apiClient.post(`/stores/${id}/follow`);
  },

  unfollowStore: async (id: string): Promise<void> => {
    await apiClient.delete(`/stores/${id}/unfollow`);
  },

  getStoreAnalytics: async (id: string): Promise<StoreAnalytics> => {
    const response = await apiClient.get<StoreAnalytics>(`/stores/${id}/analytics`);
    return response.data;
  },

  getStoreProducts: async (id: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/stores/${id}/products`);
    return response.data;
  }
};
