# Firebase Studio

Este é um projeto Next.js inicializado no Firebase Studio, focado na criação de uma aplicação web interativa chamada "Pixel Universe".

Para começar, explore o código na pasta `src/app`.

## 🚀 Configuração Essencial do Firebase

Para que o login e registo de utilizadores funcionem, **É OBRIGATÓRIO** ativar os métodos de autenticação e configurar as regras do Firestore no seu projeto Firebase.

### Como Ativar a Autenticação:

1.  **Aceda à Consola Firebase**: Abra o seu projeto na [Firebase Console](https://console.firebase.google.com/).
2.  **Selecione o seu Projeto**: Clique no nome do seu projeto.
3.  **Navegue para a Autenticação**: No menu à esquerda, na secção "Build", clique em **Authentication**.
4.  **Comece a Usar**: Clique no botão **"Get started"**.
5.  **Ative os Métodos de Login**:
    *   Vá para o separador **"Sign-in method"**.
    *   Clique em **"Email/Password"** na lista de fornecedores.
    *   Ative o primeiro interruptor e clique em **"Save"**.
    *   (Opcional) Ative outros fornecedores como Google, Facebook, etc., seguindo o mesmo processo.

### Como Configurar as Regras do Firestore:

1.  **Navegue para o Firestore**: No menu à esquerda, na secção "Build", clique em **Firestore Database**.
2.  **Aceda às Regras**: No topo da página, clique no separador **"Regras"**.
3.  **Cole as Novas Regras**: Substitua o conteúdo existente pelas seguintes regras:
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Permite que qualquer utilizador leia dados públicos (ex: píxeis, perfis de outros)
        match /{document=**} {
          allow read: if true;
        }

        // Permite que um utilizador autenticado crie, leia, atualize e apague
        // apenas os seus próprios documentos.
        match /users/{userId} {
          allow read, update, delete: if request.auth != null && request.auth.uid == userId;
          allow create: if request.auth != null;
        }

        // Exemplo para uma coleção de 'pixels':
        // Permite a leitura por todos, mas a escrita apenas pelo dono do pixel.
        match /pixels/{pixelId} {
          allow read: if true;
          allow write: if request.auth != null && request.auth.uid == resource.data.ownerId;
        }
      }
    }
    ```
4.  **Publique**: Clique no botão **"Publicar"**.

**Sem estes passos, o registo, login e a interação com a base de dados não irão funcionar.**

---

## 🔥 Funcionalidades Firebase Recomendadas para Explorar

A sua aplicação já está configurada para usar Firebase. Ative estas funcionalidades na consola para potenciar o "Pixel Universe":

### 🖼️ **Firebase Storage (Armazenamento de Ficheiros)**
- **O quê:** Permite que os seus utilizadores façam upload de ficheiros como imagens, vídeos ou outros tipos de media.
- **Ideia para o Pixel Universe:**
  - **Avatares de Perfil:** Deixe os utilizadores carregarem a sua própria imagem de perfil.
  - **Imagens de Píxeis:** Permita que um utilizador que comprou um pixel lhe associe uma imagem, que poderá ser vista por outros ao clicar no pixel.
- **Como começar:**
  1.  **Aceda ao Storage**: Na consola Firebase, no menu "Build", clique em **Storage**.
  2.  **Inicie**: Clique em **"Get started"**.
  3.  **Modo de Produção**: Selecione a opção "Começar em modo de produção" e clique em **Avançar**.
  4.  **Localização**: Escolha a localização (pode deixar a predefinida) e clique em **Concluído**.
  5.  **Aceda às Regras**: No topo da página, clique no separador **"Regras"**.
  6.  **Cole as Novas Regras**: Substitua o conteúdo existente por estas regras de segurança. Elas garantem que apenas um utilizador autenticado pode escrever na sua própria pasta:
      ```
      rules_version = '2';
      service firebase.storage {
        match /b/{bucket}/o {
          // Permite que qualquer pessoa veja os ficheiros
          match /{allPaths=**} {
            allow read: if true;
          }

          // Apenas utilizadores autenticados podem escrever na sua própria pasta
          // Exemplo: /users/USER_ID/profile.jpg
          match /users/{userId}/{allPaths=**} {
            allow write: if request.auth != null && request.auth.uid == userId;
          }
        }
      }
      ```
  7.  **Publique**: Clique em **"Publicar"**.

### 🤖 **Cloud Functions for Firebase (Lógica de Backend Automatizada)**
- **O quê:** Execute código de backend em resposta a eventos (ex: um novo utilizador a registar-se, uma escrita na base de dados) sem precisar de gerir um servidor.
- **Ideia para o Pixel Universe:**
  - **Conquistas Automáticas:** Crie uma função que é acionada quando um utilizador compra um pixel. Se for o 10º pixel dele, a função pode atribuir-lhe automaticamente a conquista "Colecionador".
  - **Moderação de Conteúdo:** Analise automaticamente as imagens carregadas para os píxeis para detetar conteúdo impróprio.
  - **Atualizações de Ranking:** Atualize um ranking global sempre que uma transação importante ocorrer no marketplace.
- **Como começar:**
  1.  **Instale a Firebase CLI**: Se ainda não tiver, instale as ferramentas de linha de comando do Firebase. Abra um terminal e execute:
      ```bash
      npm install -g firebase-tools
      ```
  2.  **Login no Firebase**: No terminal, faça login na sua conta Google:
      ```bash
      firebase login
      ```
  3.  **Inicialize as Funções**: Na raiz do seu projeto (na mesma pasta que o `package.json`), execute o seguinte comando:
      ```bash
      firebase init functions
      ```
      - **Escolha o projeto**: Selecione "Use an existing project" e escolha o seu projeto "Pixel Universe" na lista.
      - **Linguagem**: Selecione "TypeScript".
      - **ESLint**: Responda "Yes" para usar o ESLint para encontrar bugs.
      - **Dependências**: Responda "Yes" para instalar as dependências com o npm.
  4.  **Escreva a sua Primeira Função**: O comando anterior criou uma pasta `functions`. Abra o ficheiro `functions/src/index.ts` e substitua o conteúdo pelo exemplo abaixo. Esta função atribui créditos de boas-vindas a cada novo utilizador:
      ```typescript
      /**
       * Importa os módulos necessários.
       */
      import * as functions from "firebase-functions";
      import * as admin from "firebase-admin";

      // Inicializa a app de admin para poder aceder aos serviços Firebase.
      admin.initializeApp();

      // Obtém uma referência à base de dados Firestore.
      const db = admin.firestore();

      /**
       * Função acionada quando um novo utilizador é criado na Autenticação Firebase.
       *
       * @summary Atribui créditos e XP de boas-vindas a um novo utilizador.
       */
      export const onNewUserCreate = functions
          .region("europe-west1") // Recomenda-se escolher a região mais próxima
          .auth.user().onCreate(async (user) => {
            const { uid, email, displayName, photoURL } = user;

            // Cria um novo documento na coleção 'users' com os dados do utilizador.
            await db.collection("users").doc(uid).set({
              uid,
              email,
              displayName: displayName || "Novo Explorador",
              photoURL: photoURL || "https://placehold.co/96x96.png",
              level: 1,
              xp: 0,
              xpMax: 1000,
              credits: 500, // <-- Créditos de boas-vindas!
              specialCredits: 50,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              lastLogin: admin.firestore.FieldValue.serverTimestamp(),
              isPremium: false,
              isVerified: false,
            });

            functions.logger.log(`Novo utilizador ${displayName} (${uid}) criado com sucesso.`);
            return null;
          });
      ```
  5.  **Faça o Deploy**: Para publicar a sua função para o Firebase, execute no terminal:
      ```bash
      firebase deploy --only functions
      ```
      Após alguns instantes, a sua função estará ativa!

### 📈 **Google Analytics for Firebase (Análise de Comportamento)**
- **O quê:** Uma ferramenta poderosa e gratuita para perceber como os utilizadores interagem com a sua aplicação.
- **Ideia para o Pixel Universe:**
  - **Funil de Compra:** Veja quantos utilizadores clicam num pixel, quantos iniciam a compra e quantos a finalizam.
  - **Regiões Populares:** Descubra quais as áreas do mapa que recebem mais atenção.
  - **Engajamento:** Meça que funcionalidades (marketplace, comunidade, etc.) são mais utilizadas.
- **Como começar:** Na consola, vá a **Settings > Project settings > Integrations** e ligue o Google Analytics.

### ⚙️ **Firebase Remote Config (Configuração Remota)**
- **O quê:** Altere a aparência e o comportamento da sua aplicação para todos os utilizadores sem precisar de fazer um novo deploy.
- **Ideia para o Pixel Universe:**
  - **Eventos Sazonais:** Crie um parâmetro como `special_event_theme`. Na consola, pode mudá-lo de "none" para "christmas". Na sua aplicação, quando o valor for "christmas", mude as cores para um tema natalício e ative uma promoção especial nos píxeis.
  - **Testes A/B:** Teste diferentes preços para os píxeis para ver qual gera mais receita.
- **Como começar:** Vá para a secção **Remote Config** na consola e comece a definir os seus parâmetros.

### 🔔 **Cloud Messaging (FCM - Notificações Push)**
- **O quê:** Envie notificações push para os seus utilizadores, mesmo quando eles não estão com a aplicação aberta.
- **Ideia para o Pixel Universe:**
  - **Alertas de Mercado:** Notifique um utilizador quando alguém fizer uma oferta num dos seus píxeis à venda.
  - **Eventos Comunitários:** Envie uma notificação quando um evento em que o utilizador se inscreveu estiver prestes a começar.
- **Como começar:** A configuração é feita na secção **Cloud Messaging** nas configurações do projeto.

A exploração destas funcionalidades irá permitir-lhe construir uma aplicação muito mais rica, interativa e profissional.
