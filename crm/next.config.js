/** @type {import('next').NextConfig} */
const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL;

if (process.env.NODE_ENV === 'production') {
  if (!gatewayUrl) {
    throw new Error('Production builds must set NEXT_PUBLIC_GATEWAY_URL to the public HTTPS API URL.');
  }

  let gateway;
  try {
    gateway = new URL(gatewayUrl);
  } catch {
    throw new Error('NEXT_PUBLIC_GATEWAY_URL must be a valid absolute URL.');
  }

  const hostname = gateway.hostname.toLowerCase();
  const isLocalGateway = ['localhost', '::1', '0.0.0.0'].includes(hostname)
    || /^127(?:\.\d{1,3}){3}$/.test(hostname);

  if (gateway.protocol !== 'https:' || isLocalGateway) {
    throw new Error('Production builds must use a publicly reachable HTTPS API URL; localhost and HTTP are not supported.');
  }
}

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
};

module.exports = nextConfig;
