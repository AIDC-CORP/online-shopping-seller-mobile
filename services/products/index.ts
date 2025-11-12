/**
 * Products Module Exports
 * Export ProductsService, types, config, và operations
 */

// Main service
export { default as ProductsService } from './ProductsService';

// Types
export * from './types';

// Config & Enums
export * from './config';

// Operations (có thể import trực tiếp nếu cần)
export * as ProductOperations from './operations';
