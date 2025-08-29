# Estado de Ferramentas e Configuração – Pixel Universe

Este documento consolida ferramentas instaladas, configuração, estado atual e pendências.

## Resumo Executivo
- App Next.js 15 (App Router) a correr em dev; erro de rendering resolvido.
- ESLint/Prettier/Husky/lint-staged ativos.
- Jest/Testing Library configurados.
- Axiom ativo; Sentry reativado (requer DSN); PostHog presente.
- Bundle Analyzer/Size Limit prontos.
- Prisma pronto (schema completo); migrações pendentes (precisa `DATABASE_URL`).
- PWA presente (SW regista em produção).
- Typecheck reforçado; há erros TS a resolver.

## Ferramentas por Domínio
### Base
- Next.js 15 + React 18.

### TypeScript
- TypeScript 5; `npm run typecheck`.
- `ignoreBuildErrors` removido (build falha com TS). Há erros TS em:
  - Ícones `lucide-react` não importados em vários componentes.
  - Parâmetros `any` em handlers.
  - Ajustes em `auth.ts`, `middleware`, utilitários, etc.

### Qualidade de Código
- ESLint 9 + `eslint-config-next` 15.
- Plugins: `unused-imports`, `import`, `security`.
- Prettier + `prettier-plugin-tailwindcss`.
- Husky + lint-staged (pre-commit roda prettier/eslint).

### Testes
- Jest 30 (JSDOM) + `jest-extended` + `whatwg-fetch`.
- Testing Library React.
- Scripts: `test`, `test:watch`, `test:coverage`.

### E2E (presentes)
- Cypress/Playwright instalados; sem pipeline definido.

### Performance
- `@next/bundle-analyzer` (usar `ANALYZE=true next build`).
- `size-limit`.

### Monitorização/Analytics
- Axiom (ativo via `next-axiom`).
- Sentry `@sentry/nextjs` reativado com `withSentryConfig` e `app/instrumentation*.ts`.
  - Requer `NEXT_PUBLIC_SENTRY_DSN`.
- PostHog: componente `PosthogPageview` disponível.

### Segurança
- Helmet instalado (não aplicado globalmente); rate limiting esboçado em `middleware`.

### Autenticação
- NextAuth + Prisma Adapter; rota `app/api/auth/[...nextauth]/route.ts`.
- Pendentes providers/segredos `.env.local`.

### Prisma/DB
- `@prisma/client` + `prisma`.
- `prisma/schema.prisma` com modelos (app + NextAuth).
- Scripts: `prisma:generate`, `prisma:migrate`, `prisma:studio`.
- Pendente: `DATABASE_URL` e migrações.

### PWA
- `public/sw.js`; registo apenas em produção.

### SEO/Sitemap
- `next-seo` via `src/lib/seo.ts`.
- `next-sitemap` disponível (rever config conforme necessário).

### Storybook
- Dependências e scripts presentes; pendente stories/setup.

## Alterações Recentes
- Corrigido erro de React child inválido no header (ícones renderizados corretamente).
- `PixelGridSafe` criado; `PixelGrid` reativado com `ssr: false`; vibração via `useHapticFeedback`.
- Sentry reativado em `next.config.ts` + `app/instrumentation*.ts`.
- Typecheck endurecido; removidos ignores de build.

## Pendências
1) Base de dados
   - [ ] Definir `DATABASE_URL` em `.env.local`.
   - [ ] `npx prisma generate` e `npx prisma migrate dev --name init`.

2) Sentry
   - [ ] Definir `NEXT_PUBLIC_SENTRY_DSN`.
   - [ ] Validar captação de erros.

3) TypeScript
   - [ ] Importar ícones `lucide-react` onde em falta.
   - [ ] Tipar handlers (`MobileOptimizations`, `SwipeGestures`) e converter `unknown`.
   - [ ] `auth.ts`: remover `pages.signUp`, proteger `session.user`.
   - [ ] Exportar `MarketplaceService` ou ajustar import.
   - [ ] Corrigir IP no `middleware` (NextRequest).

4) Storybook/E2E
   - [ ] Setup básico e smoke tests.

5) PWA
   - [ ] Rever registo em dev (opcional) e testar em produção.

## Como Executar
- Dev: `npm run dev` (9002)
- Lint/Format: `npm run lint`, `npm run lint:fix`, `npm run format`
- Typecheck: `npm run typecheck`
- Testes: `npm test`
- Analyzer: `npm run analyze` (ou `ANALYZE=true next build`)
- Prisma: `npm run prisma:generate`, `npm run prisma:migrate`, `npm run prisma:studio`

## Exemplo .env.local
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pixel_universe?schema=public"

# Auth
NEXTAUTH_URL="http://localhost:9002"
NEXTAUTH_SECRET="replace-with-strong-secret"

# Sentry
NEXT_PUBLIC_SENTRY_DSN=""

# App
NEXT_PUBLIC_SITE_URL="http://localhost:9002"
```

## Notas
- Typecheck com erros não críticos; planear correções faseadas.
- Sentry pode avisar sobre configs antigas; configuração atual segue `instrumentation`.
