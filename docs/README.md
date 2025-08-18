# Guia de Estrutura do Projeto Pixel Universe

Este documento serve como um guia de referência para programadores (e IAs) sobre como a aplicação "Pixel Universe" está estruturada. Use este guia para localizar rapidamente os ficheiros necessários para modificar páginas ou componentes específicos.

## 🚀 Princípios Básicos

A aplicação é construída com **Next.js** e utiliza o **App Router**. Isto significa que a estrutura de pastas dentro de `src/app` define diretamente os URLs da aplicação.

-   **Páginas**: Ficheiros chamados `page.tsx` dentro de uma pasta de rota definem a interface de utilizador para essa rota.
-   **Layouts**: Ficheiros chamados `layout.tsx` definem uma interface partilhada por múltiplas páginas.
-   **Componentes**: Elementos reutilizáveis da interface (botões, cartões, painéis) estão localizados na pasta `src/components`.

---

## 🗺️ Como Modificar Páginas Principais

Para alterar o conteúdo de uma página específica, edite o ficheiro `page.tsx` correspondente dentro de `src/app/(main)/`.

| Se quiser alterar...              | Modifique este ficheiro:                               | URL Correspondente |
| --------------------------------- | ------------------------------------------------------ | ------------------ |
| A **Página Principal** (Mapa)     | `src/app/(main)/page.tsx`                              | `/`                |
| A **Página da Comunidade**        | `src/app/(main)/community/page.tsx`                    | `/community`       |
| A **Página do Marketplace**       | `src/app/(main)/marketplace/page.tsx`                  | `/marketplace`     |
| A **Página de Conquistas**        | `src/app/(main)/achievements/page.tsx`                 | `/achievements`    |
| A **Página do seu Perfil**        | `src/app/(main)/member/page.tsx`                       | `/member`          |
| A **Página de Ranking**           | `src/app/(main)/ranking/page.tsx`                      | `/ranking`         |
| A **Página de Tutoriais**         | `src/app/(main)/tutorials/page.tsx`                    | `/tutorials`       |
| A **Página de Créditos**          | `src/app/(main)/credits/page.tsx`                      | `/credits`         |
| A **Página de Suporte**           | `src/app/(main)/support/page.tsx`                      | `/support`         |
| A **Página Premium**              | `src/app/(main)/premium/page.tsx`                      | `/premium`         |
| A **Galeria de Pixels**           | `src/app/(main)/pixels/page.tsx`                       | `/pixels`          |
| As **Páginas de Configurações**   | `src/app/(main)/settings/...` (ver secção abaixo)      | `/settings/...`    |

### Layouts Partilhados

-   **Layout Global (`app/layout.tsx`)**: Modifique este ficheiro para alterar elementos que aparecem em **todas** as páginas (ex: fontes, metadados globais, `<body>`).
-   **Layout Principal (`app/(main)/layout.tsx`)**: Modifique este ficheiro para alterar o cabeçalho (`UserProfileHeader`) e o rodapé (`BottomNavBar`) que aparecem na maioria das páginas.

---

## ⚙️ Como Modificar Páginas de Configurações

As páginas de configurações estão agrupadas dentro de `src/app/(main)/settings/`.

| Se quiser alterar...                    | Modifique este ficheiro:                                | URL Correspondente        |
| --------------------------------------- | ------------------------------------------------------- | ------------------------- |
| A página principal de **Configurações** | `src/app/(main)/settings/page.tsx`                      | `/settings`               |
| As configurações de **Conta**           | `src/app/(main)/settings/account/page.tsx`              | `/settings/account`       |
| As configurações de **Aparência**       | `src/app/(main)/settings/appearance/page.tsx`           | `/settings/appearance`    |
| As configurações de **Segurança**       | `src/app/(main)/settings/security/page.tsx`             | `/settings/security`      |
| As configurações de **Notificações**    | `src/app/(main)/settings/notifications/page.tsx`        | `/settings/notifications` |
| As configurações de **Idioma**          | `src/app/(main)/settings/language/page.tsx`             | `/settings/language`      |
| As configurações de **Acessibilidade**  | `src/app/(main)/settings/accessibility/page.tsx`        | `/settings/accessibility` |
| As configurações de **Desempenho**      | `src/app/(main)/settings/performance/page.tsx`          | `/settings/performance`   |
| A página de **Ajuda**                   | `src/app/(main)/settings/help/page.tsx`                 | `/settings/help`          |
| O **layout das páginas de Configurações** | `src/app/(main)/settings/layout.tsx`                  | `/settings/*`             |

---

## 🧩 Como Modificar Componentes Comuns

Os componentes reutilizáveis estão na pasta `src/components`.

| Se quiser alterar...                               | Modifique este ficheiro:                                      | Descrição                                                    |
| -------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| O **Cabeçalho Principal** (com perfil, créditos)   | `src/components/layout/UserProfileHeader.tsx`                 | O cabeçalho no topo da aplicação.                            |
| A **Barra de Navegação Inferior**                  | `src/components/layout/BottomNavBar.tsx`                      | O rodapé de navegação, visível em dispositivos móveis.         |
| A **Barra Lateral do Mapa**                        | `src/components/layout/MapSidebar.tsx`                        | O painel lateral com estatísticas e feed de atividade do mapa. |
| O **Modal de Autenticação** (Login/Registo)        | `src/components/auth/AuthModal.tsx`                           | A janela de popup para login e criação de conta.             |
| O **Menu do Utilizador** (no cabeçalho)            | `src/components/auth/UserMenu.tsx`                            | O menu dropdown que aparece ao clicar no avatar do utilizador. |
| A **Grelha de Píxeis Interativa**                  | `src/components/pixel-grid/PixelGrid.tsx`                     | O componente central que renderiza o mapa e os píxeis.       |
| O **Modal de Compra de Píxeis**                    | `src/components/pixel-grid/EnhancedPixelPurchaseModal.tsx`    | A janela de popup para comprar e personalizar um pixel.        |
| O **Centro de Notificações**                       | `src/components/layout/NotificationCenter.tsx`                | O painel que mostra as notificações do utilizador.             |
| O **Sistema de Pesquisa Global**                   | `src/components/layout/SearchSystem.tsx`                      | O componente de pesquisa que aparece no cabeçalho.           |

---

## 🤖 Como Modificar Funcionalidades de IA

A lógica de Inteligência Artificial está na pasta `src/ai`.

| Se quiser alterar...                                 | Modifique este ficheiro:                               |
| ---------------------------------------------------- | ------------------------------------------------------ |
| A **geração de descrições para píxeis**              | `src/ai/flows/generate-pixel-description.ts`           |
| A **configuração principal do Genkit** (modelo de IA) | `src/ai/genkit.ts`                                     |

---

## 💡 Outros Ficheiros Importantes

-   **`src/lib/store.ts`**: Contém a lógica de estado global da aplicação (créditos, XP, etc.), usando a biblioteca Zustand.
-   **`src/lib/firebase.ts`**: Configuração e inicialização do Firebase para o lado do cliente.
-   **`src/data/achievements-data.tsx`**: Contém os dados estáticos para todas as conquistas disponíveis na aplicação.
-   **`app/globals.css`**: Ficheiro CSS principal. Contém as variáveis de cor para os temas claro e escuro. Use este ficheiro para alterar o esquema de cores.
-   **`tailwind.config.ts`**: Ficheiro de configuração do Tailwind CSS, onde pode estender o tema (ex: adicionar novas fontes).
