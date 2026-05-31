import { API_BASE_URL } from './util/url';

export interface ApiError extends Error {
  status?: number;
}

const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

export async function rawApiRequest<T>(
  path: string, 
  options: RequestInit = {},
  retryCount = 0,
  baseUrl: string = API_BASE_URL
): Promise<T> {
  const url = `${baseUrl}${path}`;
  console.log(`[API Request] ${options.method || 'GET'} ${url}${retryCount > 0 ? ` (Retry ${retryCount}/${MAX_RETRIES})` : ''}`);
  console.log(`[API Config] Base URL: ${API_BASE_URL}, Path: ${path}`);

  if (options.body) {
    try {
      console.log('[API Request Body]', JSON.parse(options.body as string));
    } catch {
      console.log('[API Request Body]', options.body);
    }
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log(`[API Request] Timeout triggered after ${REQUEST_TIMEOUT}ms`);
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    console.log('[API Request] Attempting to connect to server...');
    const startTime = Date.now();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    console.log(`[API Response] Status: ${response.status}, Duration: ${duration}ms`);

    const text = await response.text();
    console.log(`[API Response] Body length: ${text.length} bytes`);
    
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const message = data?.message || data?.error || response.statusText || 'Yêu cầu API thất bại';
      const error = new Error(message) as ApiError;
      error.status = response.status;
      console.error('[API Error] Status error:', error.message);
      throw error;
    }

    console.log('[API Response] Success!');
    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    // Log detailed error information
    console.error('[API Request Error]', {
      name: error.name,
      message: error.message,
      code: error.code,
      type: error.type,
      url: url,
      attemptedTime: new Date().toISOString(),
    });
    
    // Network error details
    if (error.name === 'TypeError') {
      console.error('[API Network Error] Network request failed - could not reach server');
      console.error('[API Debug] URL attempted:', url);
    }
    
    // Retry on timeout or network errors
    if ((error.name === 'AbortError' || error.name === 'TypeError') && retryCount < MAX_RETRIES) {
      console.log(`[API Request] Retrying after ${RETRY_DELAY}ms (Attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return rawApiRequest<T>(path, options, retryCount + 1, baseUrl);
    }
    
    if (error.name === 'AbortError') {
      throw new Error(`API request timeout - server not responding (${REQUEST_TIMEOUT}ms) - Check if backend is running on ${API_BASE_URL}`);
    }
    if (error.name === 'TypeError' && error.message.includes('Network')) {
      throw new Error(`Network error - Cannot reach ${baseUrl}. Check if the backend server is running and accessible from your device.`);
    }
    throw error;
  }
}
