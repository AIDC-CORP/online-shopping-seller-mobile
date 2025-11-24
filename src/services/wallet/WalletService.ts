import httpClient from '../auth/config/httpClient';

const PAYMENT_BASE_URL = process.env.EXPO_PUBLIC_PAYMENT_URL || 'http://192.168.1.4:8205';

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
        `${PAYMENT_BASE_URL}/api/v1/online-shopping/public/payments/seller/wallet/balance`
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
        `${PAYMENT_BASE_URL}/api/v1/online-shopping/public/payments/seller/wallet/transactions`,
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

  /**
   * Thêm tiền vào ví khi hoàn thành đơn hàng
   */
  async creditOrderAmount(orderId: string, amount: number): Promise<WalletTransaction> {
    try {
      console.log(`[WalletService] Crediting ${amount} for order ${orderId}...`);
      const response = await httpClient.post<WalletTransaction>(
        `${PAYMENT_BASE_URL}/api/v1/online-shopping/public/payments/seller/wallet/credit`,
        {
          order_id: orderId,
          amount: amount,
          description: `Thanh toán đơn hàng ${orderId}`
        }
      );
      console.log('[WalletService] Credit successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[WalletService] Failed to credit wallet:', error);
      if (error.response?.status === 404) {
        throw new Error('Endpoint chưa được triển khai trên server');
      }
      throw new Error(
        error.response?.data?.detail || 'Không thể cộng tiền vào ví'
      );
    }
  }
}

export default WalletService.getInstance();
