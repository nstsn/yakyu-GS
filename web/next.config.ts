import type { NextConfig } from "next";

// Config for GitHub Pages deployment
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/yakyu-GS",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

