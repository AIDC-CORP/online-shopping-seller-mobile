/**
 * Service Registry - Microfrontend Orchestration
 * Central registry for all micro-services
 */

import AuthService from './auth/AuthService';
import DashboardService from './dashboard/DashboardService';
import OrdersService from './orders/OrdersService';
import ProductsService from './products/ProductsService';
import StoreService from './store/StoreService';

export const services = {
  auth: AuthService,
  dashboard: DashboardService,
  orders: OrdersService,
  products: ProductsService,
  store: StoreService,
};

export type Services = typeof services;

// Export individual services for direct import
export { AuthService, DashboardService, OrdersService, ProductsService, StoreService };

// Export types
export type { User, LoginCredentials, AuthResponse } from './auth/AuthService';
export type { DashboardStats, TopProduct } from './dashboard/DashboardService';
export type { Order, OrderStatus } from './orders/OrdersService';
export type { Product } from './products/ProductsService';
export type { StoreProfile, StoreSettings } from './store/StoreService';
