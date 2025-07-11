// Configuration for API endpoints and environment settings
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    endpoints: {
      properties: '/api/properties',
      agents: '/api/agents',
      amenities: '/api/amenities',
      auth: '/api/auth',
    }
  },
  
  // Firebase Configuration
  firebase: {
    projectId: 'dwello-homes',
    authDomain: 'dwello-homes.firebaseapp.com',
    storageBucket: 'dwello-homes.firebasestorage.app',
  },
  
  // App Configuration
  app: {
    name: 'Dwello',
    description: 'Find your perfect home in Ghana',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  }
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  const url = new URL(endpoint, config.api.baseUrl);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  return url.toString();
};

// Helper function to make authenticated API requests
export const apiRequest = async (
  endpoint: string, 
  options: RequestInit = {},
  token?: string
) => {
  const url = buildApiUrl(endpoint);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}; 