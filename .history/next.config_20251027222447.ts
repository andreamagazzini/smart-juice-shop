import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore Prisma seed file during build
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/prisma/seed': false,
      };
    }
    return config;
  },
};

export default nextConfig;
