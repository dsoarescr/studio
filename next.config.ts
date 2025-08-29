const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const { withSentryConfig } = require('@sentry/nextjs');
const { withAxiom } = require('next-axiom');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
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
};

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(withAxiom(withBundleAnalyzer(nextConfig)), sentryWebpackPluginOptions);
