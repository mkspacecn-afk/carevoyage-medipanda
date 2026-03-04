/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  i18n: {
    locales: ['en', 'zh-TW', 'th', 'ms', 'id', 'vi', 'tl'],
    defaultLocale: 'en',
    localeDetection: true
  }
}

module.exports = nextConfig