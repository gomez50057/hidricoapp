const nextConfig = {
  basePath: '/planhidrico',
  assetPrefix: '/planhidrico/',
  trailingSlash: true,
  images: {
    unoptimized: true, // ← Importantísimo para no optimizar imágenes en serverless
  },
  async rewrites() {
    return [
      {
        source: '/planhidrico/api/:path*/',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*/`,
      },
    ];
  },
};

module.exports = nextConfig;
