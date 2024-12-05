import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        hostname:'limitless-whale-885.convex.cloud',
        protocol:'https'
      }
    ]
  }
};

export default nextConfig;
