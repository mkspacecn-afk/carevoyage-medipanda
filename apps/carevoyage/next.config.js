/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  i18n: {
    locales: ['en', 'zh-TW', 'fr', 'de', 'pt', 'es', 'th'],
    defaultLocale: 'en',
    localeDetection: false
  },
  async rewrites() {
    return [
      {
        source: '/api/stripe/:path*',
        destination: 'https://api.stripe.com/v1/:path*'
      }
    ]
  }
}

module.exports = nextConfig