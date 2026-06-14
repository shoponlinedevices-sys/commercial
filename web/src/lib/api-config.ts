// API Configuration for web application
// Based on microservices architecture - matching mobile app behavior

export const API_CONFIG = {
  // Gateway URL (port 3000) - primary endpoint for cart, orders, notifications
  GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:4000',
  
  // Direct microservice URLs (fallback)
  AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3006',
  PRODUCTS_SERVICE_URL: process.env.NEXT_PUBLIC_PRODUCTS_SERVICE_URL || 'http://localhost:3003',
  SALES_SERVICE_URL: process.env.NEXT_PUBLIC_SALES_SERVICE_URL || 'http://localhost:3001',
  NOTIFICATION_SERVICE_URL: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || 'http://localhost:3002',
  ORDERS_SERVICE_URL: process.env.NEXT_PUBLIC_ORDERS_SERVICE_URL || 'http://localhost:3001',
};

// Use gateway as primary API endpoint for auth, cart, orders, notifications
export const API_BASE_URL = API_CONFIG.GATEWAY_URL;

// Use products service directly for products (matching mobile app behavior)
export const PRODUCTS_BASE_URL = API_CONFIG.PRODUCTS_SERVICE_URL;

// Use gateway for cart (matching mobile app behavior - cart endpoints are on gateway)
export const CART_BASE_URL = API_CONFIG.GATEWAY_URL;

// Use orders service directly for orders (matching mobile app behavior - order endpoints are on orders service)
export const ORDERS_BASE_URL = API_CONFIG.ORDERS_SERVICE_URL;

// Use gateway for notifications (gateway has notification endpoints and database access)
export const NOTIFICATION_BASE_URL = API_CONFIG.GATEWAY_URL;
