const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY || 'http://localhost:4000';
const gatewayHostname = new URL(gatewayUrl).hostname.toLowerCase();
const isLocalGateway = ['localhost', '::1', '0.0.0.0'].includes(gatewayHostname)
  || /^127(?:\.\d{1,3}){3}$/.test(gatewayHostname);

if (process.env.NODE_ENV === 'production' && isLocalGateway) {
  throw new Error(
    'Production builds must set NEXT_PUBLIC_GATEWAY to a publicly reachable API URL; localhost cannot be used by website visitors.',
  );
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.boschchinhhang.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "pos.nvncdn.com",
      },
      {
        protocol: "https",
        hostname: "bizweb.dktcdn.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

module.exports = nextConfig;