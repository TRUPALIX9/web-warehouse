import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI || '', // Add this to handle the MongoDB URI securely
  },
  images: {
    domains: ['example.com'], // Add image domains if you're fetching images from external URLs
  },
};
