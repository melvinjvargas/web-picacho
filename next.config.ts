import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shldcpwxbvjrpcjgdryd.supabase.co",
      },
    ],
  },
};

export default nextConfig;
