import { apiClient } from './client';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isStoreOwner?: boolean;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    role: string;
  };
}

export const authApi = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    // We simulate the response structure since Postman didn't define the exact output schema,
    // but typically it returns a token and user metadata.
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};
