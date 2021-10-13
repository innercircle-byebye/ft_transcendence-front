/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.intra.42.fr"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://nestjs-back:3005/api/:path*",
      },
    ];
  },
};
