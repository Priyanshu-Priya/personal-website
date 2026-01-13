import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase server action body size limit for image uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },

  // Allow Supabase Storage images and external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Empty turbopack config to acknowledge we're using Turbopack
  // Velite builds are handled separately via npm scripts
  turbopack: {},
};

export default nextConfig;
