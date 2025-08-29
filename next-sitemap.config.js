/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://pixeluniverse.pt',
  generateRobotsTxt: true,
  exclude: ['/api/*'],
};
