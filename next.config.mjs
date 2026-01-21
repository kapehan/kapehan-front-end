/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/v1/:path*", // Proxy all requests starting with /v1
        destination: "http://kapehan-api.internal:3000/v1/:path*", // Route to backend
      },
    ];
  },
};

export default nextConfig;