/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'protocol',
            value: 'http', // শুধু HTTP হলে redirect হবে
          },
        ],
        destination: 'https://updatecontent.site/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
