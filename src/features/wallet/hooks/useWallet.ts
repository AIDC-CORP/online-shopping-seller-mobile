import { useState, useEffect, useCallback } from 'react';
import WalletService, {
  SellerWallet,
  WalletTransaction,
} from '../../../services/wallet/WalletService';

export const useWallet = () => {
  const [wallet, setWallet] = useState<SellerWallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 20,
  });

  /**
   * Lấy thông tin ví (số dư)
   */
  const fetchWalletBalance = useCallback(async () => {
    try {
      setError(null);
      const walletData = await WalletService.getWalletBalance();
      setWallet(walletData);
    } catch (err: any) {
      console.error('[useWallet] Error fetching wallet balance:', err);
      setError(err.message || 'Không thể tải thông tin ví');
    }
  }, []);

  /**
   * Lấy lịch sử giao dịch
   */
  const fetchTransactions = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await WalletService.getTransactions(page, 20);
      setTransactions(response.data);
      setPagination({
        currentPage: response.pagination.current_page,
        totalPages: response.pagination.total_pages,
        totalItems: response.pagination.total_items,
        limit: response.pagination.limit,
      });
    } catch (err: any) {
      console.error('[useWallet] Error fetching transactions:', err);
      setError(err.message || 'Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh toàn bộ dữ liệu
   */
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchWalletBalance(), fetchTransactions(1)]);
    setRefreshing(false);
  }, [fetchWalletBalance, fetchTransactions]);

  /**
   * Load more transactions (pagination)
   */
  const loadMore = useCallback(async () => {
    if (loading || pagination.currentPage >= pagination.totalPages) {
      return;
    }
    await fetchTransactions(pagination.currentPage + 1);
  }, [loading, pagination, fetchTransactions]);

  /**
   * Initial load
   */
  useEffect(() => {
    refresh();
  }, []);

  return {
    wallet,
    transactions,
    loading,
    refreshing,
    error,
    pagination,
    refresh,
    loadMore,
    fetchWalletBalance,
  };
};
