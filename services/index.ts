/**
 * Service Registry - Microfrontend Orchestration
 * Central registry for all micro-services
 */

import AuthService from './auth/AuthService';
import DashboardService from './dashboard/DashboardService';
import OrdersService from './orders/OrdersService';
import ProductsService from './products/ProductsService';
import StoreService from './store/StoreService';
import SetupService from './setup/SetupService';

export const services = {
  auth: AuthService,
  dashboard: DashboardService,
  orders: OrdersService,
  products: ProductsService,
  store: StoreService,
  setup: SetupService,
};

export type Services = typeof services;

// Export individual services for direct import
export { AuthService, DashboardService, OrdersService, ProductsService, StoreService, SetupService };

// Export types
export type { 
  User, 
  LoginCredentials, 
  AuthResponse,
  RegisterCustomerRequest,
  RegisterAdminSellerRequest
} from './auth';
export type { DashboardStats, TopProduct } from './dashboard/DashboardService';
export type { Order, OrderStatus } from './orders/OrdersService';
export type { 
  Product,
  ProductCreateRequest,
  ProductUpdateRequest
} from './products';
export type { StoreProfile, StoreSettings } from './store';
export type {
  StoreProfile as SetupStoreProfile,
  SetupFormData,
  FileUploadResponse
} from './setup';

// Export auth config (từ auth module)
export { API_CONFIG, AUTH_ENDPOINTS, buildApiUrl, httpClient } from './auth';

// Export store config
export { PROFILE_ENDPOINTS } from './store';

// Export setup config
export { SETUP_ENDPOINTS } from './setup';

// Export catalog config
export { 
  CATALOG_ENDPOINTS,
  ProductCategory,
  ProductUnit,
  ProductStatus
} from './products';
