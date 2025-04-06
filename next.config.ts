import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images:{
    domains:["avatars.githubusercontent.com","lh3.googleusercontent.com","jeet-twitter-dev.s3.ap-south-1.amazonaws.com"]
  }
};

export default nextConfig;
