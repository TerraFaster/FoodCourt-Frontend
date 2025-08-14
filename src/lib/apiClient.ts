// lib/apiClient.ts
import { apiConfig, endpoints } from '../config/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface MenuItemResponse {
  id: number;
  nameEn: string;
  nameUk: string;
  descriptionEn: string;
  descriptionUk: string;
  unit: string;
  amount: number;
  timeToCook: number;
  price: number;
  promoPrice?: number | null;
  isNew: boolean;
  isPromo: boolean;
  imageUrl?: string;
  category: string;
}

export interface MenuItemRequest {
  id?: number;
  nameEn: string;
  nameUk: string;
  descriptionEn: string;
  descriptionUk: string;
  unit: string;
  amount: number;
  timeToCook: number;
  price: number;
  promoPrice?: number | null;
  isNew: boolean;
  isPromo: boolean;
  imageUrl?: string;
  category: string;
}

export interface FlagsUpdateRequest {
  isNew?: boolean;
  isPromo?: boolean;
  promoPrice?: number | null;
}

export interface ImageUploadResponse {
  imageUrl: string;
  // url: string;
}

export interface MenuItemPublicResponse {
  name: string;
  description: string;
  unit: string;
  amount: number;
  timeToCook: number;
  price: number;
  promoPrice?: number | null;
  isNew: boolean;
  isPromo: boolean;
  imageUrl?: string;
  category: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = apiConfig.baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get auth token from cookie
    const authToken = this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Always try to parse JSON response
      const contentType = response.headers.get('content-type');
      let responseData: any = {};
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      }

      if (!response.ok) {
        // Extract error message from response body or use default
        const errorMessage = responseData.message || `HTTP error! status: ${response.status}`;
        throw {
          message: errorMessage,
          status: response.status,
        } as ApiError;
      }

      return responseData as T;
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error
        throw {
          message: 'Network error. Please check your connection and try again.',
        } as ApiError;
      }
      throw error;
    }
  }

  private async requestWithFile<T>(
    endpoint: string,
    file: File,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get auth token from cookie
    const authToken = this.getAuthToken();
    
    const formData = new FormData();
    formData.append('file', file);
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...options.headers,
      },
      body: formData,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      const contentType = response.headers.get('content-type');
      let responseData: any = {};
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      }

      if (!response.ok) {
        const errorMessage = responseData.message || `HTTP error! status: ${response.status}`;
        throw {
          message: errorMessage,
          status: response.status,
        } as ApiError;
      }

      return responseData as T;
    } catch (error) {
      if (error instanceof TypeError) {
        throw {
          message: 'Network error. Please check your connection and try again.',
        } as ApiError;
      }
      throw error;
    }
  }

  private getAuthToken(): string | null {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'auth-token') {
        return value;
      }
    }
    return null;
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>(endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Menu Items methods
  async getAllMenuItems(): Promise<MenuItemResponse[]> {
    return this.request<MenuItemResponse[]>(endpoints.menuItems.getAll);
  }

  async getMenuItemById(id: number): Promise<MenuItemResponse> {
    return this.request<MenuItemResponse>(endpoints.menuItems.getById(id));
  }

  async createMenuItem(item: MenuItemRequest): Promise<MenuItemResponse> {
    return this.request<MenuItemResponse>(endpoints.menuItems.create, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateMenuItem(id: number, item: MenuItemRequest): Promise<void> {
    return this.request<void>(endpoints.menuItems.update(id), {
      method: 'PUT',
      body: JSON.stringify({ ...item, id }),
    });
  }

  async deleteMenuItem(id: number): Promise<void> {
    return this.request<void>(endpoints.menuItems.delete(id), {
      method: 'DELETE',
    });
  }

  async updateMenuItemFlags(id: number, flags: FlagsUpdateRequest): Promise<MenuItemResponse> {
    return this.request<MenuItemResponse>(endpoints.menuItems.updateFlags(id), {
      method: 'PATCH',
      body: JSON.stringify(flags),
    });
  }

  async uploadMenuItemImage(id: number, file: File): Promise<ImageUploadResponse> {
    // Validate file before sending
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw {
        message: 'File size exceeds 10MB limit',
      } as ApiError;
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw {
        message: 'Invalid file type. Only image files are allowed.',
      } as ApiError;
    }
    
    return this.requestWithFile<ImageUploadResponse>(endpoints.menuItems.uploadImage(id), file);
  }

  // async uploadMenuItemImage(id: number, file: File): Promise<ImageUploadResponse> {
  //   return this.requestWithFile<ImageUploadResponse>(endpoints.menuItems.uploadImage(id), file);
  // }

  // Public methods (no authentication required)
  async getPublicMenuItems(language?: string): Promise<MenuItemPublicResponse[]> {
    const params = new URLSearchParams();
    if (language) {
      params.append('lang', language);
    }
    
    const endpoint = params.toString() 
      ? `${endpoints.public.menuItems}?${params.toString()}`
      : endpoints.public.menuItems;
      
    return this.request<MenuItemPublicResponse[]>(endpoint, {
      headers: {} // Override to exclude auth header
    });
  }
}

export const apiClient = new ApiClient();