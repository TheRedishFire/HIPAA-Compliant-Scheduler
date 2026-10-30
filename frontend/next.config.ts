import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://129.146.77.217/api/:path*",
      },
    ];
  },
};

export default nextConfig;
