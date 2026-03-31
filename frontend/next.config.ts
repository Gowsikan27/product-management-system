import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
