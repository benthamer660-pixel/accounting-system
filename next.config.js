/** @type {import('next').NextConfig} */
const nextConfig = {
  // تعطيل تحسين الصور للاستضافة الثابتة
  images: {
    unoptimized: true
  },

  // إعدادات الاستضافة
  trailingSlash: true,

  // تكوين المسارات
  basePath: '',

  // تكوين البيئة
  env: {
    CUSTOM_KEY: 'accounting-system',
  },

  // تحسين الأداء
  experimental: {
    optimizeCss: true,
  },

  // إعدادات الإنتاج
  productionBrowserSourceMaps: false,

  // إعدادات الأمان (للاستضافة العادية فقط)
  async headers() {
    if (process.env.BUILD_STATIC === 'true') return []

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // إعادة التوجيه (للاستضافة العادية فقط)
  async redirects() {
    if (process.env.BUILD_STATIC === 'true') return []

    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ]
  },

  // تكوين Webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // تحسينات إضافية
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
    }

    return config
  },
}

// تكوين للاستضافة الثابتة
if (process.env.BUILD_STATIC === 'true') {
  nextConfig.output = 'export'
  nextConfig.distDir = 'out'
}

module.exports = nextConfig
