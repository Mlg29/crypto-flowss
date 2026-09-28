import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Old CTA routes now point at merchant creation.
  async redirects() {
    return [
      { source: "/signup", destination: "/create-merchant", permanent: false },
      { source: "/demo", destination: "/create-merchant", permanent: false },
    ];
  },
};

export default nextConfig;
