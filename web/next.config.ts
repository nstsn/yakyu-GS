import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/yakyu-GS",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

