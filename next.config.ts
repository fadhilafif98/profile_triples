import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["react-icons", "lucide-react", "motion", "gsap"],
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
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
