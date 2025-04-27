import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   reactStrictMode: true,
   allowedDevOrigins: ['http://localhost:3000', 'http://192.168.1.131:3000'], // ✅ direct here

  env: {
    MONGODB_URI: process.env.MONGODB_URI || '', // Add this to handle the MongoDB URI securely
  },
  images: {
    domains: ['example.com'], // Add image domains if you're fetching images from external URLs
  },
};

module.exports = nextConfig;