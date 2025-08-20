/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.aimlapi.com',
        port: '',
        pathname: '/generations/**',
      },
    ],
  },
};

module.exports = nextConfig;