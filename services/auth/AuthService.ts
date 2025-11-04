/**
 * Auth Service - Microfrontend Module
 * Handles authentication logic independent of other services
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'seller' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          name: 'Seller Demo',
          role: 'seller',
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        this.currentUser = mockUser;
        this.token = mockToken;
        
        resolve({
          user: mockUser,
          token: mockToken,
        });
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    this.token = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser;
  }
}

export default AuthService.getInstance();
