import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint checks during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors
  },
  /* config options here */
  images:{
    remotePatterns:[
      {
        hostname:'limitless-whale-885.convex.cloud',
        protocol:'https'
      },{
        hostname:'enchanted-mandrill-466.convex.cloud',
        protocol:'https'
      }
    ]
  }
};

export default nextConfig;
