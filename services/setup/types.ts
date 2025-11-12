/**
 * Setup Service Types
 * Type definitions cho Store Setup flow
 */

// ============================================================================
// Store Profile Types
// ============================================================================

export interface StoreProfile {
  id: string;
  seller_id: string;
  store_name: string;
  description: string;
  avatar: string;
  cover?: string;
  address: string;
  phone: string;
  email?: string;
  isActive?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface BackendStoreResponse {
  id: string;
  seller_id: string;
  store_name: string;
  phone: string;
  address: string;
  avatar: string;
  cover?: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface StoreCreateRequest {
  store_name: string;
  phone: string;
  address: string;
  avatar: string;
  cover?: string;
  description: string;
}

export interface StoreUpdateRequest {
  store_name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  cover?: string;
  description?: string;
}

export interface FileUploadResponse {
  bucket: string;
  object_name: string;
  size: number;
  content_type: string;
  url: string;
}

// ============================================================================
// Setup Data Type (from UI Form)
// ============================================================================

export interface SetupFormData {
  // Step 1: Personal Info
  fullName: string;
  phone: string;
  email: string;
  avatar: string;
  
  // Step 2: Store Basic Info
  storeName: string;
  storeDescription: string;
  storeAddress: string;
  storeLogo: string;
  storeCover: string;
  
  // Step 3: Extended Info (Optional - not supported by backend yet)
  openingHours?: string;
  paymentMethods?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

// ============================================================================
// Transform Functions
// ============================================================================

/**
 * Transform backend response to app format
 */
export function transformStoreResponse(backendStore: BackendStoreResponse): StoreProfile {
  return {
    id: backendStore.id,
    seller_id: backendStore.seller_id,
    store_name: backendStore.store_name,
    description: backendStore.description,
    avatar: backendStore.avatar,
    cover: backendStore.cover,
    address: backendStore.address,
    phone: backendStore.phone,
    isActive: true,
    created_at: backendStore.created_at,
    updated_at: backendStore.updated_at,
  };
}

/**
 * Transform setup form data to store create request
 */
export function transformSetupDataToStoreRequest(data: SetupFormData): StoreCreateRequest {
  return {
    store_name: data.storeName,
    phone: data.phone,
    address: data.storeAddress,
    avatar: data.storeLogo,
    cover: data.storeCover,
    description: data.storeDescription,
  };
}
