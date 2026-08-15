import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    minimumCacheTTL: 2592000, // 30 days (1 month edge cache)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.giphy.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
      },
      {
        protocol: 'https',
        hostname: 'resources.cosmo.fans',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cosmo.fans',
      },
      {
        protocol: 'https',
        hostname: '*.cosmo.fans',
      },
      {
        protocol: 'https',
        hostname: 'apollo.cafe',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
      },
      {
        protocol: 'https',
        hostname: 'huggingface.co',
      },
    ],
  },
};

export default nextConfig;
