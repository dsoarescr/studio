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
    // Encontra a regra de imagem existente do Next.js
    const imageRule = config.module.rules.find(
      (rule) => rule.test && rule.test.toString().includes('svg|png|jpe?g|gif')
    );

    // Exclui .ico da regra de imagem existente
    if (imageRule && imageRule.test instanceof RegExp) {
        const test = imageRule.test.source.replace('|ico', '');
        imageRule.test = new RegExp(test);
    }
    
    // Adiciona uma nova regra para tratar .ico como recursos estáticos
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
