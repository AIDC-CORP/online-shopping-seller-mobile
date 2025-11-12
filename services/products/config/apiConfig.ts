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
  CREATE_PRODUCT: `${CATALOG_BASE_URL}/api/v1/online-shopping/protected/catalog/products`, // /{store_id}
  UPDATE_PRODUCT: `${CATALOG_BASE_URL}/api/v1/online-shopping/protected/catalog/products`, // /{product_id}
  DELETE_PRODUCTS: `${CATALOG_BASE_URL}/api/v1/online-shopping/protected/catalog/products`,
};

/**
 * Product Category Enum
 * QUAN TRỌNG: Phải match CHÍNH XÁC với backend (lowercase, không dấu)
 * Backend: services/catalog_service/src/models.py -> ProductCategory
 */
export enum ProductCategory {
  VEGETABLES = 'vegetables',  // Rau củ
  MEAT = 'meat',              // Thịt
  FRUITS = 'fruits',          // Trái cây
  DAIRY = 'dairy',            // Sữa & trứng
  BEVERAGES = 'beverages',    // Đồ uống
  SNACKS = 'snacks',          // Đồ ăn vặt
  OTHER = 'other',            // Khác
}

/**
 * Product Category Display Names (cho UI)
 * Mapping từ enum value → tên hiển thị tiếng Việt
 */
export const ProductCategoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.VEGETABLES]: 'Rau củ',
  [ProductCategory.MEAT]: 'Thịt',
  [ProductCategory.FRUITS]: 'Trái cây',
  [ProductCategory.DAIRY]: 'Sữa & trứng',
  [ProductCategory.BEVERAGES]: 'Đồ uống',
  [ProductCategory.SNACKS]: 'Đồ ăn vặt',
  [ProductCategory.OTHER]: 'Khác',
};

/**
 * Product Unit Enum
 * QUAN TRỌNG: Phải match CHÍNH XÁC với backend (lowercase, có dấu tiếng Việt)
 * Backend: services/catalog_service/src/models.py -> ProductUnit
 */
export enum ProductUnit {
  KG = 'kg',          // Kilogram
  TUI = 'túi',        // Túi
  BO = 'bó',          // Bó
  HOP = 'hộp',        // Hộp
  CHAI = 'chai',      // Chai
  LON = 'lon',        // Lon
  CAI = 'cái',        // Cái
  OTHER = 'other',    // Khác
}

/**
 * Product Unit Display Names (cho UI)
 */
export const ProductUnitLabels: Record<ProductUnit, string> = {
  [ProductUnit.KG]: 'Kg (Kilogram)',
  [ProductUnit.TUI]: 'Túi',
  [ProductUnit.BO]: 'Bó',
  [ProductUnit.HOP]: 'Hộp',
  [ProductUnit.CHAI]: 'Chai',
  [ProductUnit.LON]: 'Lon',
  [ProductUnit.CAI]: 'Cái',
  [ProductUnit.OTHER]: 'Khác',
};

/**
 * Product Status Enum
 * QUAN TRỌNG: Phải match CHÍNH XÁC với backend (lowercase, có dấu tiếng Việt)
 * Backend: services/catalog_service/src/models.py -> ProductStatus
 */
export enum ProductStatus {
  IN_STOCK = 'còn hàng',      // Còn hàng
  LOW_STOCK = 'sắp hết hàng', // Sắp hết hàng
  OUT_OF_STOCK = 'hết hàng',  // Hết hàng
}

/**
 * Product Status Display Names & Colors (cho UI)
 */
export const ProductStatusConfig = {
  [ProductStatus.IN_STOCK]: {
    label: 'Còn hàng',
    color: 'green',
    icon: '✓',
  },
  [ProductStatus.LOW_STOCK]: {
    label: 'Sắp hết',
    color: 'orange',
    icon: '⚠',
  },
  [ProductStatus.OUT_OF_STOCK]: {
    label: 'Hết hàng',
    color: 'red',
    icon: '✗',
  },
};
