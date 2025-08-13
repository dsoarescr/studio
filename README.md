# Firebase Studio

# 🎨 Pixel Universe - Mapa Interativo de Portugal

Uma plataforma inovadora que transforma Portugal num universo de pixels interativos, onde cada pixel representa uma identidade digital única.

## 🌟 Conceito da Aplicação

O **Pixel Universe** é uma plataforma revolucionária que combina:
- **Mapa Interativo de Portugal** dividido em pixels comprável
- **Identidades Digitais Únicas** para cada pixel
- **Gamificação Completa** com conquistas, níveis e recompensas
- **Comunidade Social** com partilha, comentários e colaboração
- **Marketplace** para compra/venda de pixels
- **Sistema Premium** com funcionalidades avançadas
- **IA Integrada** para descrições e assistência
- **Realidade Aumentada** para experiências imersivas

## 🚀 Funcionalidades Principais

### 🗺️ **Mapa Interativo**
- Navegação fluida com zoom e pan
- Pixels comprável em todo o território português
- Visualização em tempo real de atividade
- Filtros avançados e pesquisa

### 🎮 **Gamificação**
- Sistema de níveis e XP
- 50+ conquistas únicas
- Desafios diários e semanais
- Classificações globais e regionais
- Eventos sazonais

### 👥 **Comunidade**
- Feed social estilo Instagram
- Stories de pixels
- Live streaming de criação
- Colaboração em tempo real
- Clubes e grupos temáticos

### 🤖 **IA Avançada**
- Geração automática de descrições
- Sugestões de cores inteligentes
- Análise de tendências de mercado
- Assistente personalizado

### 📱 **Mobile-First**
- Otimizado para dispositivos móveis
- Gestos touch intuitivos
- Feedback háptico
- Performance adaptativa
- PWA ready

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 15, React 18, TypeScript
- **UI:** Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Pagamentos:** Stripe
- **IA:** Google Genkit + Gemini 2.0
- **Estado:** Zustand com persistência
- **Testes:** Jest, React Testing Library

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Rotas principais
│   ├── api/               # API routes
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── auth/              # Autenticação
│   ├── core/              # Componentes principais
│   ├── features/          # Funcionalidades avançadas
│   ├── layout/            # Layout e navegação
│   ├── mobile/            # Otimizações mobile
│   ├── payment/           # Sistema de pagamentos
│   ├── pixel-grid/        # Mapa e pixels
│   ├── security/          # Segurança
│   ├── ui/                # Componentes UI base
│   └── user/              # Perfis de utilizador
├── lib/                   # Utilitários e configurações
├── hooks/                 # React hooks customizados
├── data/                  # Dados e tipos
└── ai/                    # Integração IA
```

## 🎯 Páginas Principais

- **`/`** - Mapa interativo principal
- **`/marketplace`** - Compra/venda de pixels
- **`/community`** - Feed social e interações
- **`/achievements`** - Sistema de conquistas
- **`/ranking`** - Classificações e estatísticas
- **`/member`** - Perfil do utilizador
- **`/premium`** - Subscrições premium
- **`/settings`** - Configurações da conta

## 🚀 Configuração Essencial do Firebase

Para que o login e registo de utilizadores funcionem, **É OBRIGATÓRIO** ativar os métodos de autenticação no seu projeto Firebase.

### Como Ativar a Autenticação:

1. **Aceda à Consola Firebase**: Abra o seu projeto na [Firebase Console](https://console.firebase.google.com/).
2.  **Selecione o seu Projeto**: Clique em `pixel-universe-ub7uk`.
3.  **Navegue para a Autenticação**: No menu à esquerda, na secção "Build", clique em **Authentication**.
4.  **Comece a Usar**: Clique no botão **"Get started"**.
5.  **Ative os Métodos de Login**:
    *   Vá para o separador **"Sign-in method"**.
    *   Clique em **"Email/Password"** na lista de fornecedores.
    *   Ative o primeiro interruptor e clique em **"Save"**.
    *   (Opcional) Ative outros fornecedores como Google, Facebook, etc., seguindo o mesmo processo.

**Sem estes passos, o registo e login de utilizadores não irão funcionar.**

## 🏃‍♂️ Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Construir para produção
npm run build
```

A aplicação estará disponível em `http://localhost:9002`
---

## 🔥 Funcionalidades Firebase para Explorar

A sua aplicação já está configurada para usar Firebase. Aqui estão algumas funcionalidades da consola Firebase que pode integrar para potenciar o "Pixel Universe":

### 🤖 **Firebase Authentication**
- **Gestão de Utilizadores**: Veja e gira todos os utilizadores registados.
- **Provedores de Login**: Ative facilmente login com Google, Facebook, GitHub, etc., para facilitar o acesso dos seus utilizadores.
- **Templates de Email**: Personalize os emails de verificação, recuperação de password, etc.

### 💾 **Firestore Database (Base de Dados)**
- **Dados em Tempo Real**: Substitua os dados "mock" (estáticos) da sua aplicação (como posts da comunidade, itens do marketplace, etc.) por dados reais e dinâmicos.
- **Gestão de Dados**: Crie e gira as suas coleções de dados diretamente na consola. Por exemplo, pode criar uma coleção `pixels` para armazenar o dono, a cor e o preço de cada pixel do mapa.

### 🖼️ **Firebase Storage (Armazenamento)**
- **Upload de Ficheiros**: Permita que os seus utilizadores façam upload de imagens de perfil, imagens personalizadas para os seus pixels ou timelapses das suas criações.
- **Gestão de Conteúdo**: Armazene e gira todos os ficheiros dos seus utilizadores de forma segura.

### ⚙️ **Cloud Functions for Firebase**
- **Lógica de Backend Automatizada**: Crie funções que são acionadas por eventos. Por exemplo, pode criar uma função que atribui uma conquista a um utilizador automaticamente quando ele compra 10 pixels.
- **API Personalizada**: Crie os seus próprios endpoints de API para funcionalidades complexas sem ter de gerir um servidor.

### 📈 **Google Analytics for Firebase**
- **Análise de Comportamento**: Integre o Analytics para perceber como os utilizadores interagem com a sua aplicação, quais as páginas mais visitadas e que funcionalidades são mais populares.

A exploração destas funcionalidades irá permitir-lhe construir uma aplicação muito mais rica, interativa e profissional.

## 🎨 Design System

### Cores Principais
- **Primary:** `#D4A757` (Dourado Português)
- **Accent:** `#7DF9FF` (Azul Atlântico)
- **Background:** Dark theme otimizado

### Tipografia
- **Headlines:** Space Grotesk (moderno e tech)
- **Body:** Space Grotesk (legibilidade)
- **Code:** Source Code Pro (coordenadas e dados)

## 🔮 Roadmap Futuro

- **NFT Integration** - Pixels como NFTs únicos
- **Geolocalização Real** - GPS para pixels
- **Eventos Sazonais** - Natal, Verão, etc.
- **Sistema de Clãs** - Grupos colaborativos
- **API Pública** - Para desenvolvedores
- **Metaverso 3D** - Experiência imersiva

## 🤝 Contribuição

Este projeto está em desenvolvimento ativo. Contribuições são bem-vindas!

## 📄 Licença

© 2025 Pixel Universe. Todos os direitos reservados.

---
**Transforme Portugal num universo de possibilidades digitais! 🇵🇹✨**