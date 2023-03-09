/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'onlineweb4-prod.s3.eu-north-1.amazonaws.com',
        pathname: '/media/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
