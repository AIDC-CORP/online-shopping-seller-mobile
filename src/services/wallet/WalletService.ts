import httpClient from '../auth/config/httpClient';

export interface SellerWallet {
  id: string;
  store_id: string;
  seller_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at?: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  store_id: string;
  order_id?: string;
  type: 'CREDIT' | 'DEBIT' | 'REFUND';
  amount: number;
  balance_before: number;
  balance_after: number;
  description?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  created_at: string;
}

export interface WalletTransactionListResponse {
  data: WalletTransaction[];
  pagination: {
    current_page: number;
    limit: number;
    total_pages: number;
    total_items: number;
  };
}

class WalletService {
  private static instance: WalletService;

  private constructor() {}

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  /**
   * Lấy thông tin số dư ví seller
   */
  async getWalletBalance(): Promise<SellerWallet> {
    try {
      console.log('[WalletService] Fetching wallet balance...');
      const response = await httpClient.get<SellerWallet>(
        '/payments/seller/wallet/balance'
      );
      console.log('[WalletService] Wallet balance:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[WalletService] Failed to get wallet balance:', error);
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy ví của bạn');
      }
      throw new Error(
        error.response?.data?.detail || 'Không thể lấy thông tin ví'
      );
    }
  }

  /**
   * Lấy lịch sử giao dịch ví
   */
  async getTransactions(
    page: number = 1,
    limit: number = 20
  ): Promise<WalletTransactionListResponse> {
    try {
      console.log(
        `[WalletService] Fetching transactions (page: ${page}, limit: ${limit})...`
      );
      const response = await httpClient.get<WalletTransactionListResponse>(
        '/payments/seller/wallet/transactions',
        {
          params: { page, limit },
        }
      );
      console.log(
        `[WalletService] Transactions fetched: ${response.data.data.length} items`
      );
      return response.data;
    } catch (error: any) {
      console.error('[WalletService] Failed to get transactions:', error);
      throw new Error(
        error.response?.data?.detail || 'Không thể lấy lịch sử giao dịch'
      );
    }
  }
}

export default WalletService.getInstance();
