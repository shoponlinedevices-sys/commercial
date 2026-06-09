import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * API Configuration
 *
 * Uses domain name for cross-network access:
 * - All platforms use thegioithietbi.online domain
 * - HTTPS protocol for secure communication
 * - Works across different networks (not limited to local network)
 */

const getApiBaseUrl = (port: number): string => {
  const platform = Platform.OS;
  const isDevice = Constants.isDevice;
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':').shift();

  console.log(`[API Config] Platform: ${platform}, isDevice: ${isDevice}, debuggerHost: ${debuggerHost}`);

  // Use localhost for simulator, domain for real device (works across different networks)
  const isSimulator = !isDevice;
  // const baseUrl = isSimulator 
  //   ? `http://${debuggerHost || 'localhost'}:${port}`
  //   : `https://thegioithietbi.online`;

   const baseUrl = `https://thegioithietbi.online`;
  
  console.log(`[API Config] Using base URL: ${baseUrl}, port: ${port}`);
  return baseUrl;
};

// Detect current Expo host for logging
const debuggerHost = Constants.expoConfig?.hostUri?.split(':').shift();

// API URLs
export const API_BASE_URL = getApiBaseUrl(3000); // gateway (cart endpoints)
export const AUTH_SERVICE_BASE_URL = getApiBaseUrl(3006); // auth-svc (auth endpoints)
export const PRODUCTS_SERVICE_BASE_URL = getApiBaseUrl(3003); // products-svc (products endpoints)
export const SALES_SERVICE_BASE_URL = getApiBaseUrl(3001); // sales-svc (orders endpoints)
export const ORDERS_SERVICE_BASE_URL = getApiBaseUrl(3001); // sales-svc (orders endpoints)
export const NOTIFICATION_API_BASE_URL = getApiBaseUrl(3002);
export const EMAIL_SERVICE_BASE_URL = getApiBaseUrl(3011); // email-svc (email endpoints)

console.log('================================');
console.log('[API Config]');
console.log('Host:', debuggerHost);
console.log('API_BASE_URL:', API_BASE_URL);
console.log('AUTH_SERVICE_BASE_URL:', AUTH_SERVICE_BASE_URL);
console.log('PRODUCTS_SERVICE_BASE_URL:', PRODUCTS_SERVICE_BASE_URL);
console.log('SALES_SERVICE_BASE_URL:', SALES_SERVICE_BASE_URL);
console.log('ORDERS_SERVICE_BASE_URL:', ORDERS_SERVICE_BASE_URL);
console.log('NOTIFICATION_API_BASE_URL:', NOTIFICATION_API_BASE_URL);
console.log('================================');