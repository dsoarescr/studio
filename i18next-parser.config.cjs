module.exports = {
  locales: ['pt', 'en'],
  input: ['src/**/*.{ts,tsx}'],
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  defaultNamespace: 'common',
  keySeparator: false,
  namespaceSeparator: false,
};
