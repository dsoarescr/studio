
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // We recommend to set experimental.serverActions.allowedOrigins
  // for server actions to protect against CSRF attacks.
  // experimental: {
  //   serverActions: {
  //     allowedOrigins: ["my-proxy.com", "*.my-proxy.com"],
  //   },
  // },
};

export default nextConfig;
