/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  i18n: {
    locales: ['en', 'zh-TW', 'fr', 'de', 'pt', 'es', 'th'],
    defaultLocale: 'en',
    localeDetection: false
  }
}

module.exports = nextConfig