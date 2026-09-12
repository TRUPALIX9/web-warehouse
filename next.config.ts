import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["http://localhost:3000", "http://192.168.1.131:3000"], // ✅ direct here

  // MONGODB_URI is read on the server only (src/app/api/db.ts); it is not
  // exposed through `env`, which would inline it into built bundles.
  images: {
    domains: ["example.com"], // Add image domains if you're fetching images from external URLs
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
