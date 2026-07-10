import { apiClient } from './client';

export interface CheckoutPayload {
  paymentProvider: 'MPESA' | 'CARD';
  phoneNumber: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
}

export interface OrderResponse {
  id: string;
  status: string;
  totalAmount: number;
  paymentReference: string;
  createdAt?: string;
  items?: Array<{ productName: string; quantity: number; price: number }>;
}

export const ordersApi = {
  checkout: async (payload: CheckoutPayload): Promise<OrderResponse> => {
    const response = await apiClient.post<OrderResponse>('/orders/checkout', payload);
    return response.data;
  },
  
  // Mock endpoint for fetching user orders since backend may not have it yet
  getOrders: async (): Promise<OrderResponse[]> => {
    // Return some mock orders for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'ORD-7829-XJ',
            status: 'DELIVERED',
            totalAmount: 1250.00,
            paymentReference: 'PESA-12345',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
            items: [
              { productName: 'Obsidian Carbon Keyboard', quantity: 1, price: 1250.00 }
            ]
          },
          {
            id: 'ORD-1093-AB',
            status: 'PROCESSING',
            totalAmount: 85.50,
            paymentReference: 'PESA-98765',
            createdAt: new Date().toISOString(),
            items: [
              { productName: 'Precision Mouse Pad', quantity: 1, price: 85.50 }
            ]
          }
        ]);
      }, 800);
    });
  }
};
