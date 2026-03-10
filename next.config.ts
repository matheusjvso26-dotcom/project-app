import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["app.fire675.com", "*.fire675.com", "localhost:3000"]
    }
  }
};

export default nextConfig;
