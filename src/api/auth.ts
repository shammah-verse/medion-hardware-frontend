import { apiClient } from './client';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "CUSTOMER" | "STORE_VENDOR" | "ADMIN";
  username?: string; // Optional since backend auto-generates it
}

export interface AuthResponse {
  accessToken: string;
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email?: string;
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
