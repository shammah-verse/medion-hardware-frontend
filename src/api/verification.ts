import { apiClient } from './client';

export interface VerificationStatus {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_STARTED';
  remarks?: string;
  submittedAt?: string;
}

export interface VerificationPayload {
  businessName: string;
  registrationNumber: string;
  taxId: string;
  documentUrls: string[];
}

export const verificationApi = {
  getStatus: async (): Promise<VerificationStatus> => {
    try {
      const response = await apiClient.get<VerificationStatus>('/vendor/verification/status');
      return response.data;
    } catch (error) {
      return { status: 'NOT_STARTED' };
    }
  },

  submitVerification: async (payload: VerificationPayload): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/vendor/verification/submit', payload);
    return response.data;
  },
  
  verifyOtp: async (otp: string): Promise<{ success: boolean }> => {
    const response = await apiClient.post('/vendor/verification/verify-otp', { otp });
    return response.data;
  }
};
