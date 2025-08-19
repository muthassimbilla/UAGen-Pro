/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'protocol',
            value: 'http'
          }
        ],
        destination: 'https://updatecontent.site/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
