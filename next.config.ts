/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keeping this minimal to ensure stability
  serverExternalPackages: ['@genkit-ai/ai', 'genkit'],
};

module.exports = nextConfig;
