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
    // Exclude .ico files from the default image loader
    const imageRule = config.module.rules.find(
      (rule) =>
        typeof rule === 'object' &&
        rule.test instanceof RegExp &&
        rule.test.test('.svg')
    );
    if (imageRule && typeof imageRule === 'object') {
      imageRule.exclude = /\.ico$/;
    }

    // Add a new rule for .ico files using asset/resource
    config.module.rules.push({
      test: /\.ico$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name][ext]',
      },
    });

    return config;
  },
};

export default nextConfig;
