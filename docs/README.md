# Guia de Estrutura do Projeto Pixel Universe

Este documento serve como um guia de referência para programadores (e IAs) sobre como a aplicação "Pixel Universe" está estruturada. Use este guia para localizar rapidamente os ficheiros necessários para modificar páginas ou componentes específicos.

## 🚀 Princípios Básicos

A aplicação é construída com **Next.js** e utiliza o **App Router**. Isto significa que a estrutura de pastas dentro de `src/app` define diretamente os URLs da aplicação.

-   **Páginas**: Ficheiros chamados `page.tsx` dentro de uma pasta de rota definem a interface de utilizador para essa rota.
-   **Layouts**: Ficheiros chamados `layout.tsx` definem uma interface partilhada por múltiplas páginas.
-   **Componentes**: Elementos reutilizáveis da interface (botões, cartões, painéis) estão localizados na pasta `src/components`.

---

## ⚠️ Regras Críticas para Manter a Aplicação Estável

Existem duas regras fundamentais que **devem** ser seguidas para evitar quebrar a aplicação.

### 1. A Regra de Ouro da Grelha de Píxeis

| Se quiser alterar...                                                                   | ✅ **MODIFIQUE ESTE FICHEIRO**                           | ❌ **NÃO MODIFIQUE ESTE FICHEIRO**                         |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| **Toda a lógica visual e interativa da grelha**:<br>- Cor dos píxeis<br>- Destaques (hover/seleção)<br>- Animações<br>- Interações de clique<br>- Preços, donos, etc. | `src/components/pixel-grid/PixelGrid.tsx`              | `src/components/pixel-grid/PortugalMapSvg.tsx`            |

#### Explicação

-   **`PortugalMapSvg.tsx` (O MOLDE):** Este ficheiro contém apenas os dados vetoriais do mapa. Ele é usado **uma única vez** para criar a "forma" da grelha. **Qualquer alteração neste ficheiro irá corromper o mapa.** Ele deve ser tratado como um recurso estático e imutável.

-   **`PixelGrid.tsx` (O DECORADOR):** Este ficheiro pega na forma do mapa e aplica toda a lógica por cima. É aqui que se desenham os píxeis no `<canvas>`, se decide a cor de cada um, se adicionam efeitos de brilho, e se gere o que acontece quando um utilizador interage com a grelha.

**Exemplos de alterações em `PixelGrid.tsx`:**
- Adicionar um novo efeito visual quando um pixel é selecionado.
- Mudar a cor padrão dos píxeis não vendidos.
- Implementar uma animação para píxeis raros.
- Alterar as informações que aparecem no tooltip do pixel.
- Mudar a forma como o zoom ou a navegação (pan) funcionam.

### 2. A Regra de Ouro dos Layouts

| Se quiser alterar...                                                | ✅ **MODIFIQUE ESTE FICHEIRO**                           | ❌ **NÃO FAÇA ISTO**                                                                 |
| ------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| **O conteúdo de uma página** (ex: marketplace, comunidade, perfil). | `src/app/(main)/marketplace/page.tsx`                  | Não crie um novo `layout.tsx` dentro de `/marketplace` (ou qualquer outra pasta). |
| **O cabeçalho ou rodapé** para todas as páginas principais.         | `src/app/(main)/layout.tsx`                            | Não edite os layouts de páginas individuais para adicionar o cabeçalho.           |

#### Explicação

A aplicação usa um sistema de "layouts aninhados":
-   **`app/(main)/layout.tsx`** define o layout principal com o cabeçalho e o rodapé.
-   Qualquer página dentro de `app/(main)/...` (como `community/page.tsx`) herda automaticamente esse layout.
-   Se um novo `layout.tsx` for criado dentro de uma subpasta (ex: `community/layout.tsx`), ele irá **substituir** o layout principal, fazendo com que o cabeçalho e o rodapé desapareçam *apenas nessa página*.

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

---
## 🛠️ Como Modificar Funcionalidades e Componentes Existentes

Para alterar funcionalidades específicas, edite os seguintes ficheiros de componentes.

| Se quiser alterar...                               | Modifique este ficheiro:                                      | Descrição                                                    |
| -------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| A **Grelha de Píxeis Interativa** (cores, zoom, etc.) | `src/components/pixel-grid/PixelGrid.tsx`                  | Componente principal que renderiza e gere a grelha de píxeis.  |
| O **Cabeçalho Principal** (com perfil, créditos)   | `src/components/layout/UserProfileHeader.tsx`                 | O cabeçalho no topo da aplicação.                            |
| A **Barra de Navegação Inferior**                  | `src/components/layout/BottomNavBar.tsx`                      | O rodapé de navegação, visível em dispositivos móveis.         |
| A **Barra Lateral do Mapa** (Stats e Feed)         | `src/components/layout/MapSidebar.tsx`                        | O painel lateral com estatísticas e feed de atividade do mapa. |
| O **Modal de Autenticação** (Login/Registo)        | `src/components/auth/AuthModal.tsx`                           | A janela de popup para login e criação de conta.         |
| O **Menu do Utilizador** (no cabeçalho)            | `src/components/auth/UserMenu.tsx`                            | O menu dropdown que aparece ao clicar no avatar do utilizador. |
| O **Modal de Compra de Píxeis**                    | `src/components/pixel-grid/EnhancedPixelPurchaseModal.tsx`    | A janela de popup para comprar e personalizar um pixel.        |
| O **Centro de Notificações**                       | `src/components/layout/NotificationCenter.tsx`                | O painel que mostra as notificações do utilizador.             |
| O **Sistema de Pesquisa Global**                   | `src/components/layout/SearchSystem.tsx`                      | O componente de pesquisa que aparece no cabeçalho.           |

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
## 🤖 Como Modificar Funcionalidades de IA

A lógica de Inteligência Artificial está na pasta `src/ai`.

| Se quiser alterar...                                 | Modifique este ficheiro:                               |
| ---------------------------------------------------- | ------------------------------------------------------ |
| A **geração de descrições para píxeis**              | `src/ai/flows/generate-pixel-description.ts`           |
| A **configuração principal do Genkit** (modelo de IA) | `src/ai/genkit.ts`                                     |

---

## ✨ Como Adicionar Novas Funcionalidades

Seguir uma estrutura consistente é crucial para a manutenção do projeto.

### 1. Adicionar uma Nova Página
- **Passo 1**: Crie uma nova pasta dentro de `src/app/(main)/`. O nome da pasta será o URL (ex: `src/app/(main)/nova-pagina`).
- **Passo 2**: Dentro dessa nova pasta, crie um ficheiro `page.tsx`.
- **Passo 3**: Construa o seu componente React para a página dentro de `page.tsx`. Ele herdará automaticamente o cabeçalho e o rodapé.
- **Passo 4**: Adicione um novo link para a sua página no componente da barra de navegação, em `src/components/layout/BottomNavBar.tsx`.

### 2. Adicionar um Novo Componente Reutilizável
- **Passo 1**: Crie um novo ficheiro `.tsx` na pasta `src/components/`. Se for um componente complexo, crie uma subpasta para ele (ex: `src/components/novo-componente/index.tsx`).
- **Passo 2**: Desenvolva o seu componente.
- **Passo 3**: Importe e utilize o seu novo componente onde for necessário (numa página ou noutro componente).

### 3. Adicionar uma Nova Funcionalidade de IA
- **Passo 1**: Crie um novo ficheiro `[nome-da-funcionalidade]-flow.ts` dentro de `src/ai/flows/`.
- **Passo 2**: Siga a estrutura de um flow Genkit existente, definindo os schemas de input/output com Zod e a lógica do prompt.
- **Passo 3**: Importe e chame a sua nova função de IA no componente React onde ela será utilizada.

---
## 💡 Outros Ficheiros Importantes

| Para alterar...                                    | Modifique este ficheiro:              | Descrição                                                    |
| -------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------- |
| O **estado global do utilizador** (créditos, XP)   | `src/lib/store.ts`                    | Contém a lógica de estado global (Zustand).                    |
| As **cores e o tema** da aplicação                 | `app/globals.css`                     | Contém as variáveis de cor para os temas claro e escuro.       |
| As **fontes** ou estender o tema Tailwind          | `tailwind.config.ts`                  | Ficheiro de configuração do Tailwind CSS.                      |
| As **configurações do Firebase** no cliente        | `src/lib/firebase.ts`                 | Configuração e inicialização do Firebase para o lado do cliente. |
| Os **dados estáticos das conquistas**              | `src/data/achievements-data.tsx`      | Contém a lista e os detalhes de todas as conquistas.           |
| As **traduções de texto** (i18n)                   | `src/lib/i18n.ts`                     | Contém todas as strings de texto para diferentes idiomas.      |
| O **layout raiz** de toda a aplicação (`<html>`, `<body>`) | `src/app/layout.tsx`                | O ficheiro de layout mais fundamental.                         |
