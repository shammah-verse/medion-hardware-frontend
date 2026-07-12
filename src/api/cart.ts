import { apiClient } from './client';
import type { Product } from './products';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/cart');
    return response.data;
  },
  
  addItem: async (payload: AddToCartPayload): Promise<Cart> => {
    const response = await apiClient.post<Cart>('/cart/items', payload);
    return response.data;
  },
  
  // Note: The Postman spec didn't explicitly detail remove/update endpoints, 
  // but a standard REST setup uses these. If they don't exist, we might just use POST /cart/items.
  // We'll stub them out for completeness and UI functionality.
  removeItem: async (productId: string): Promise<Cart> => {
    const response = await apiClient.delete<Cart>(`/cart/items/${productId}`);
    return response.data;
  },
  
  updateQuantity: async (productId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.put<Cart>(`/cart/items/${productId}`, { quantity });
    return response.data;
  }
};
