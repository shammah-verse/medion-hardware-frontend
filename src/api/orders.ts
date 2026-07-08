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
}

export const ordersApi = {
  checkout: async (payload: CheckoutPayload): Promise<OrderResponse> => {
    const response = await apiClient.post<OrderResponse>('/orders/checkout', payload);
    return response.data;
  },
};
