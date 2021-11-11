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
        destination: `http://back-nestjs:${process.env.BACK_PORT}/api/:path*`,
      },
      {
        source: '/auth/:path*',
        destination: `http://back-nestjs:${process.env.BACK_PORT}/auth/:path*`,
      },
      {
        source: '/profile_image/:path*',
        destination: `http://back-nestjs:${process.env.BACK_PORT}/profile_image/:path*`,
      },
      {
        source: '/image/:path*',
        destination: `http://back-nestjs:${process.env.BACK_PORT}/image/:path*`,
      },
    ];
  },
};
