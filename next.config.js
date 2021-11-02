/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.intra.42.fr', 'picsum.photos', 'back-nestjs'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://back-nestjs:3005/api/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://back-nestjs:3005/auth/:path*',
      },
    ];
  },
};
