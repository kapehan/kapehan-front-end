/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add rewrites
  async rewrites() {
    return [
      {
        source: "/v1/:path*", // "/v1" will be the frontend proxy path
        destination: "http://kapehan-api.internal:3000/:path*", // Forward requests to your backend
      },
    ];
  },
}

export default nextConfig;