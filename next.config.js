/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bypass build errors
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // Change from 'export' to 'standalone' to support API routes
  output: "standalone",
  // Remove distDir setting as it's not needed with standalone output
  // distDir: "out", 
  
  // Keep the experimental settings
  experimental: {
    ppr: false // Disable Partial Prerendering
  }
};

module.exports = nextConfig; 