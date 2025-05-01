import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These settings will bypass TypeScript and ESLint errors during build
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;