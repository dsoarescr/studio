# 🛠️ Ferramentas de Desenvolvimento

Este documento lista todas as ferramentas recomendadas para o desenvolvimento do projeto.

## 📦 Instalação Rápida

Execute o script de instalação:
```bash
chmod +x install-dev-tools.sh
./install-dev-tools.sh
```

## 🎯 Ferramentas por Categoria

### 📝 Qualidade de Código

#### **Prettier**
- **Propósito**: Formatação automática de código
- **Comando**: `npm run format`
- **Verificação**: `npm run format:check`

#### **ESLint**
- **Propósito**: Análise estática de código
- **Comando**: `npm run lint`
- **Correção**: `npm run lint:fix`

#### **Husky + lint-staged**
- **Propósito**: Hooks do Git para qualidade de código
- **Configuração**: `npx husky install`

### ⚡ Performance e Monitoramento

#### **Bundle Analyzer**
- **Propósito**: Análise do tamanho do bundle
- **Comando**: `npm run analyze`

#### **Sharp**
- **Propósito**: Otimização de imagens
- **Uso**: Automático no Next.js

### 🧪 Testes

#### **Jest + Testing Library**
- **Propósito**: Framework de testes
- **Comandos**:
  - `npm test` - Executar testes
  - `npm run test:watch` - Modo watch
  - `npm run test:coverage` - Cobertura de testes

#### **MSW (Mock Service Worker)**
- **Propósito**: Mock de APIs para testes

### 📱 Desenvolvimento Mobile

#### **Capacitor**
- **Propósito**: Build de apps nativos
- **Comandos**:
  - `npx cap add ios`
  - `npx cap add android`

### 🔧 Otimização

#### **Workbox**
- **Propósito**: Service Workers para PWA

#### **Imagemin**
- **Propósito**: Compressão de imagens

### 🔒 Segurança

#### **Helmet**
- **Propósito**: Headers de segurança

#### **Rate Limiter**
- **Propósito**: Proteção contra ataques

### 📊 Analytics e Monitoramento

#### **Sentry**
- **Propósito**: Monitoramento de erros

#### **PostHog**
- **Propósito**: Analytics de produto

### ♿ Acessibilidade

#### **Axe Core**
- **Propósito**: Testes de acessibilidade

#### **ESLint JSX A11y**
- **Propósito**: Regras de acessibilidade

### 🌍 Internacionalização

#### **Next-intl**
- **Propósito**: i18n para Next.js

### 💾 Estado e Cache

#### **React Query**
- **Propósito**: Gerenciamento de estado do servidor

#### **SWR**
- **Propósito**: Hooks para data fetching

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção

# Qualidade de Código
npm run lint         # Verificar código
npm run lint:fix     # Corrigir problemas automaticamente
npm run format       # Formatar código
npm run format:check # Verificar formatação
npm run typecheck    # Verificar tipos TypeScript

# Testes
npm test             # Executar testes
npm run test:watch   # Testes em modo watch
npm run test:coverage # Cobertura de testes

# Análise
npm run analyze      # Analisar bundle
```

## 📋 Configuração Inicial

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar Husky**:
   ```bash
   npx husky install
   npx husky add .husky/pre-commit 'npm run lint-staged'
   ```

3. **Verificar configuração**:
   ```bash
   npm run lint
   npm run format:check
   npm test
   ```

## 🔧 Configurações Importantes

### Prettier (.prettierrc)
- Formatação consistente do código
- Configurações para TypeScript/React

### ESLint (.eslintrc.json)
- Regras de qualidade de código
- Integração com Prettier
- Regras de acessibilidade

### Jest (jest.config.js)
- Configuração para Next.js
- Mocks para APIs do navegador
- Cobertura de testes

## 📚 Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Guia do TypeScript](https://www.typescriptlang.org/docs)
- [Testing Library](https://testing-library.com/docs)
- [Prettier](https://prettier.io/docs)
- [ESLint](https://eslint.org/docs)

## 🆘 Solução de Problemas

### Erro de Prettier
```bash
npm run format:check
npm run format
```

### Erro de ESLint
```bash
npm run lint:fix
```

### Testes falhando
```bash
npm run test:coverage
# Verificar relatório de cobertura
```

### Bundle muito grande
```bash
npm run analyze
# Verificar relatório de análise
```
