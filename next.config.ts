import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable the check for missing Suspense boundaries
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
};

export default nextConfig;