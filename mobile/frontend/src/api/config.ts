import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * API Configuration
 *
 * Detects the appropriate API URL based on the platform:
 * - Android emulator: 10.0.2.2 (accesses host's localhost)
 * - iOS simulator: localhost
 * - Physical device: use Expo host IP or fallback to localhost
 */

const getApiBaseUrl = (port: number): string => {
  const platform = Platform.OS;
  const isDevice = Constants.isDevice;
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':').shift();

  console.log(`[API Config] Platform: ${platform}, isDevice: ${isDevice}, debuggerHost: ${debuggerHost}`);

  if (platform === 'android' && !isDevice) {
    // Android emulator - use machine IP
    console.log(`[API Config] Using Android emulator with machine IP`);
    return `http://192.168.1.9:${port}`;
  }

  if (debuggerHost && isDevice) {
    // Physical device - use Expo host IP
    console.log(`[API Config] Using physical device with Expo host: ${debuggerHost}`);
    return `http://${debuggerHost}:${port}`;
  }

  // iOS simulator or fallback - use machine IP for consistency
  console.log(`[API Config] Using fallback with machine IP`);
  return `http://192.168.1.9:${port}`;
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