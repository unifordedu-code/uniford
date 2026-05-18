import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uniford.net",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "nuclearmed.org",
      },
      {
        protocol: "https",
        hostname: "mtk.sa",
      },
    ],
  },
};

export default nextConfig;