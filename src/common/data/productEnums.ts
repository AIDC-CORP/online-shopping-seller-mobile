// Product Categories - Match với backend ProductCategory enum
// Backend values: "rau củ", "thịt", "trái cây", "sữa", "đồ uống", "đồ ăn vặt", "hải sản", "gạo & ngũ cốc", "gia vị", "đồ đông lạnh", "khác"
export const PRODUCT_CATEGORIES = [
  { value: 'rau củ', label: 'Rau củ', icon: '🥬' },
  { value: 'thịt', label: 'Thịt', icon: '🥩' },
  { value: 'trái cây', label: 'Trái cây', icon: '🍎' },
  { value: 'sữa', label: 'Sữa', icon: '🥛' },
  { value: 'đồ uống', label: 'Đồ uống', icon: '🥤' },
  { value: 'đồ ăn vặt', label: 'Đồ ăn vặt', icon: '🍿' },
  { value: 'hải sản', label: 'Hải sản', icon: '🦐' },
  { value: 'gạo & ngũ cốc', label: 'Gạo & Ngũ cốc', icon: '🌾' },
  { value: 'gia vị', label: 'Gia vị', icon: '🧂' },
  { value: 'đồ đông lạnh', label: 'Đồ đông lạnh', icon: '🧊' },
  { value: 'khác', label: 'Khác', icon: '📦' },
] as const;

// Product Units - Match với backend ProductUnit enum
// Backend values: "kg", "gram", "túi", "bó", "hộp", "chai", "lon", "cái", "gói", "thùng", "khác"
export const PRODUCT_UNITS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'túi', label: 'Túi' },
  { value: 'bó', label: 'Bó' },
  { value: 'hộp', label: 'Hộp' },
  { value: 'chai', label: 'Chai' },
  { value: 'lon', label: 'Lon' },
  { value: 'cái', label: 'Cái' },
  { value: 'gói', label: 'Gói' },
  { value: 'thùng', label: 'Thùng' },
  { value: 'khác', label: 'Khác' },
] as const;

// Product Status - Match với backend ProductStatus enum
// Backend values: "Còn hàng", "Sắp hết hàng", "Hết hàng"
export const PRODUCT_STATUSES = [
  { value: 'Còn hàng', label: 'Còn hàng', color: '#10b981' },
  { value: 'Sắp hết hàng', label: 'Sắp hết hàng', color: '#f59e0b' },
  { value: 'Hết hàng', label: 'Hết hàng', color: '#ef4444' },
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]['value'];
export type ProductUnit = typeof PRODUCT_UNITS[number]['value'];
export type ProductStatus = typeof PRODUCT_STATUSES[number]['value'];
