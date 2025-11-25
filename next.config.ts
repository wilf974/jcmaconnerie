import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  // Configuration pour les images
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
};

export default nextConfig;
