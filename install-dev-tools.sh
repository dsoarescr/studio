#!/bin/bash

echo "🚀 Instalando ferramentas de desenvolvimento recomendadas..."

# Ferramentas de Qualidade de Código
echo "📝 Instalando ferramentas de qualidade de código..."
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev husky lint-staged

# Ferramentas de Performance e Monitoramento
echo "⚡ Instalando ferramentas de performance..."
npm install --save-dev @next/bundle-analyzer
npm install --save-dev cross-env
npm install --save-dev compression-webpack-plugin

# Ferramentas de Teste Adicionais
echo "🧪 Instalando ferramentas de teste..."
npm install --save-dev @testing-library/user-event
npm install --save-dev msw
npm install --save-dev jest-environment-jsdom

# Ferramentas de Desenvolvimento Mobile
echo "📱 Instalando ferramentas mobile..."
npm install --save-dev @capacitor/core @capacitor/cli
npm install --save-dev @capacitor/ios @capacitor/android

# Ferramentas de Otimização
echo "🔧 Instalando ferramentas de otimização..."
npm install --save-dev sharp
npm install --save-dev imagemin imagemin-webp
npm install --save-dev workbox-webpack-plugin

# Ferramentas de Segurança
echo "🔒 Instalando ferramentas de segurança..."
npm install --save-dev helmet
npm install --save-dev rate-limiter-flexible

# Ferramentas de Analytics e Monitoramento
echo "📊 Instalando ferramentas de analytics..."
npm install --save-dev @sentry/nextjs
npm install --save-dev posthog-js

# Ferramentas de Acessibilidade
echo "♿ Instalando ferramentas de acessibilidade..."
npm install --save-dev @axe-core/react
npm install --save-dev eslint-plugin-jsx-a11y

# Ferramentas de Internacionalização
echo "🌍 Instalando ferramentas de i18n..."
npm install --save-dev next-intl
npm install --save-dev react-intl

# Ferramentas de Estado e Cache
echo "💾 Instalando ferramentas de estado..."
npm install --save-dev @tanstack/react-query
npm install --save-dev swr

echo "✅ Todas as ferramentas foram instaladas com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o Husky: npx husky install"
echo "2. Adicione o pre-commit hook: npx husky add .husky/pre-commit 'npm run lint-staged'"
echo "3. Configure o lint-staged no package.json"
echo "4. Execute: npm run lint para verificar o código"
echo "5. Execute: npm test para rodar os testes"
