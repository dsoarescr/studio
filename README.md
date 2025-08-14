# Firebase Studio

Este é um projeto Next.js inicializado no Firebase Studio, focado na criação de uma aplicação web interativa chamada "Pixel Universe".

Para começar, explore o código na pasta `src/app`.

## 🚀 Configuração Essencial do Firebase

Para que o login e registo de utilizadores funcionem, **É OBRIGATÓRIO** ativar os métodos de autenticação no seu projeto Firebase.

### Como Ativar a Autenticação:

1.  **Aceda à Consola Firebase**: Abra o seu projeto na [Firebase Console](https://console.firebase.google.com/).
2.  **Selecione o seu Projeto**: Clique em `pixel-universe-ub7uk`.
3.  **Navegue para a Autenticação**: No menu à esquerda, na secção "Build", clique em **Authentication**.
4.  **Comece a Usar**: Clique no botão **"Get started"**.
5.  **Ative os Métodos de Login**:
    *   Vá para o separador **"Sign-in method"**.
    *   Clique em **"Email/Password"** na lista de fornecedores.
    *   Ative o primeiro interruptor e clique em **"Save"**.
    *   (Opcional) Ative outros fornecedores como Google, Facebook, etc., seguindo o mesmo processo.

**Sem estes passos, o registo e login de utilizadores não irão funcionar.**

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