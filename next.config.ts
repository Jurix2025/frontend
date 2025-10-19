import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // Allow images from external sources
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '34.56.99.80',
        port: '8000',
        pathname: '/**',
      },
    ],
  },

  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
