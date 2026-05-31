import { API_BASE_URL } from './config';

export async function testNetworkConnectivity(): Promise<{
  canReachServer: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  let canReachServer = false;

  console.log('[Network Diagnostic] ========================================');
  console.log(`[Network Diagnostic] Testing connectivity to: ${API_BASE_URL}`);
  console.log('[Network Diagnostic] ========================================');

  // Test login endpoint directly
  try {
    console.log('[Network Diagnostic] Testing /auth/login endpoint...');
    const { controller, timeoutId } = createTimeoutSignal(5000);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test', password: 'test' }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Any response (even 401/403) means the server is reachable
    canReachServer = true;
    console.log(`[Network Diagnostic] ✓ SUCCESS - Server responded with status ${response.status}`);
    console.log(`[Network Diagnostic] Server is reachable at: ${API_BASE_URL}`);
  } catch (error: any) {
    const errorMsg = error.message;
    console.error(`[Network Diagnostic] ✗ FAILED - ${errorMsg}`);
    
    if (error.name === 'AbortError') {
      errors.push(`Timeout - Server at ${API_BASE_URL} is not responding (5 second timeout)`);
    } else if (errorMsg.includes('Network')) {
      errors.push(`Network error - Cannot reach ${API_BASE_URL}`);
    } else {
      errors.push(`Error: ${errorMsg}`);
    }
  }

  console.log('[Network Diagnostic] ========================================');
  
  if (errors.length > 0) {
    console.log('[Network Diagnostic] TROUBLESHOOTING:');
    console.log('  1. Is the backend running? (npm run start:dev)');
    console.log('  2. Check API_BASE_URL in src/api/config.ts');
    console.log(`  3. Current URL: ${API_BASE_URL}`);
    console.log('  4. Your machine IP: 192.168.1.8');
    console.log('  5. For physical device use: http://192.168.1.8:3000');
    console.log('  6. For Android emulator use: http://10.0.2.2:3000');
  }
  
  console.log('[Network Diagnostic] ========================================');

  return {
    canReachServer,
    errors,
  };
}

function createTimeoutSignal(timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  return { controller, timeoutId };
}
