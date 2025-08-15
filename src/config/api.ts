// config/api.ts
export interface ApiConfig {
  baseURL: string;
}

const getApiConfig = (): ApiConfig => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL)
    return { baseURL: process.env.NEXT_PUBLIC_API_BASE_URL };
  
  return { baseURL: 'http://localhost:3000' };
};

export const apiConfig = getApiConfig();

// API endpoints
export const endpoints = {
  auth: {
    login: '/api/admin/Auth/login'
  },
  menuItems: {
    getAll: '/api/admin/MenuItems',
    getById: (id: number) => `/api/admin/MenuItems/${id}`,
    create: '/api/admin/MenuItems',
    update: (id: number) => `/api/admin/MenuItems/${id}`,
    delete: (id: number) => `/api/admin/MenuItems/${id}`,
    updateFlags: (id: number) => `/api/admin/MenuItems/${id}/flags`,
    uploadImage: (id: number) => `/api/admin/MenuItems/${id}/image`
  },
  public: {
    menuItems: '/api/MenuItems'
  }
} as const;