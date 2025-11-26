/**
 * Excel Operations
 * Import/Export products via Excel files
 */

import { httpClient } from '../../auth/config';
import Constants from 'expo-constants';

// Get API URLs from environment
const CATALOG_SERVICE_URL = 
  process.env.EXPO_PUBLIC_CATALOG_URL || 
  Constants.expoConfig?.extra?.CATALOG_SERVICE_URL ||
  'http://192.168.1.4:8115';

/**
 * Import products from Excel file
 */
export async function importProductsFromExcel(
  storeId: string,
  formData: FormData
): Promise<{
  success_count: number;
  error_count: number;
  errors: { row: number | string; error: string }[];
  message: string;
}> {
  try {
    console.log('[ExcelOperations] Importing products from Excel for store:', storeId);

    const response = await httpClient.post(
      `${CATALOG_SERVICE_URL}/catalog/products/${storeId}/import-excel`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes timeout for file upload
      }
    );

    console.log('[ExcelOperations] Import result:', response.data);

    return {
      success_count: response.data.success_count,
      error_count: response.data.error_count,
      errors: response.data.errors || [],
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('[ExcelOperations] Import failed:', error);
    throw new Error(
      error.response?.data?.detail || error.message || 'Failed to import products from Excel'
    );
  }
}

/**
 * Get Excel template download URL
 */
export function getExcelTemplateUrl(): string {
  return `${CATALOG_SERVICE_URL}/catalog/products/template/download`;
}
