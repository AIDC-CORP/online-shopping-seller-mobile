/**
 * Products Service - Microfrontend Module
 * Handles product catalog management
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  unit: string;
}

class ProductsService {
  private static instance: ProductsService;

  private constructor() {}

  static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  async getProducts(category?: string): Promise<Product[]> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Sản phẩm A',
            description: 'Mô tả sản phẩm A',
            price: 100000,
            stock: 50,
            category: 'electronics',
            imageUrl: 'https://via.placeholder.com/150',
            unit: 'cái',
          },
          {
            id: '2',
            name: 'Sản phẩm B',
            description: 'Mô tả sản phẩm B',
            price: 200000,
            stock: 30,
            category: 'fashion',
            imageUrl: 'https://via.placeholder.com/150',
            unit: 'cái',
          },
        ];
        
        if (category) {
          resolve(mockProducts.filter(p => p.category === category));
        } else {
          resolve(mockProducts);
        }
      }, 500);
    });
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now().toString(),
          ...product,
        });
      }, 500);
    });
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          name: 'Updated Product',
          description: 'Updated',
          price: 150000,
          stock: 40,
          category: 'electronics',
          imageUrl: 'https://via.placeholder.com/150',
          unit: 'cái',
          ...updates,
        });
      }, 500);
    });
  }

  async deleteProduct(id: string): Promise<void> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }
}

export default ProductsService.getInstance();
