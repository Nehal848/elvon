const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/analyze-report',
        destination: '/analysis-report',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    if (!backendUrl) return []
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl.replace(/\/+$/, '')}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
