import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow loading avatars from Unsplash used in the demo testimonials
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Allow Google profile photos
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
