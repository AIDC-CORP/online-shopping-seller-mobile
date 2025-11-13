/**
 * Catalog/Products API Configuration
 * Endpoints cho Catalog Service
 */

// Base URL cho Catalog Service
const CATALOG_BASE_URL = process.env.EXPO_PUBLIC_CATALOG_URL || 'http://192.168.1.13:8115';

// Endpoints cho Catalog Service
export const CATALOG_ENDPOINTS = {
  // Public endpoints
  GET_ALL_PRODUCTS: `${CATALOG_BASE_URL}/api/v1/online-shopping/public/catalog/products`,
  GET_PRODUCTS_BY_STORE: `${CATALOG_BASE_URL}/api/v1/online-shopping/public/catalog/products`, // /{store_id}
  
  // Protected endpoints (require SELLER role)
  // NOTE: Backend router có dependencies=[Depends(require_seller)] nhưng vẫn dùng /public path
  CREATE_PRODUCT: `${CATALOG_BASE_URL}/api/v1/online-shopping/public/catalog/products`, // /{store_id}
  UPDATE_PRODUCT: `${CATALOG_BASE_URL}/api/v1/online-shopping/public/catalog/products`, // /{product_id}
  DELETE_PRODUCTS: `${CATALOG_BASE_URL}/api/v1/online-shopping/public/catalog/products`,
};

/**
 * Product Category Enum
 * QUAN TRỌNG: Phải match CHÍNH XÁC với backend (lowercase tiếng Việt có dấu)
 * Backend: services/catalog_service/src/models.py -> ProductCategory
 */
export type ProductCategory = 
  | 'rau củ'
  | 'thịt'
  | 'trái cây'
  | 'sữa'
  | 'đồ uống'
  | 'đồ ăn vặt'
  | 'hải sản'
  | 'gạo & ngũ cốc'
  | 'gia vị'
  | 'đồ đông lạnh'
  | 'khác';

/**
 * Product Unit Enum
 * QUAN TRỌNG: Phải match CHÍNH XÁC với backend (lowercase tiếng Việt có dấu)
 * Backend: services/catalog_service/src/models.py -> ProductUnit
 */
export type ProductUnit = 
  | 'kg'
  | 'gram'
  | 'túi'
  | 'bó'
  | 'hộp'
  | 'chai'
  | 'lon'
  | 'cái'
  | 'gói'
  | 'thùng'
  | 'khác';

/**
 * Product Status Enum
 * QUAN TRỌNG: Phải match CHÍNH XÁC với backend (tiếng Việt có dấu, chữ hoa đầu câu)
 * Backend: services/catalog_service/src/models.py -> ProductStatus
 * IN_STOCK = "Còn hàng"
 * LOW_STOCK = "Sắp hết hàng" 
 * OUT_OF_STOCK = "Hết hàng"
 */
export type ProductStatus = 
  | 'Còn hàng'
  | 'Sắp hết hàng'
  | 'Hết hàng';
