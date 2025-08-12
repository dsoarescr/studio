/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['@genkit-ai/ai', 'genkit'],
  webpack: (config, { isServer }) => {
    // Adicionado para evitar erro com favicon.ico
    config.module.rules.push({
      test: /\.ico$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'static/media/', // ou o diretório que preferir
            publicPath: '/_next/static/media/',
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
