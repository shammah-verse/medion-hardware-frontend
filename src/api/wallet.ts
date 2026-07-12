import { apiClient } from './client';

export interface WalletBalance {
  currentBalance: number;
  pendingBalance: number;
  withdrawableBalance: number;
  totalEarnings: number;
}

export interface Transaction {
  id: string;
  type: 'EARNING' | 'WITHDRAWAL' | 'REFUND';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  date: string;
  reference: string;
  description: string;
}

export interface WithdrawalRequest {
  amount: number;
  method: 'MPESA' | 'BANK' | 'STRIPE';
  accountDetails: string;
}

export const walletApi = {
  getBalance: async (): Promise<WalletBalance> => {
    const response = await apiClient.get<WalletBalance>('/wallets/my-wallet');
    return response.data;
  },

  getTransactions: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<Transaction[]>('/vendor/wallet/transactions');
    return response.data;
  },

  requestWithdrawal: async (payload: WithdrawalRequest): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/vendor/wallet/withdraw', payload);
    return response.data;
  }
};
