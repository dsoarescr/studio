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
- **Como começar:** Vá para a secção **Storage** na consola, clique em "Get Started" e siga o assistente de configuração.

### 🤖 **Cloud Functions for Firebase (Lógica de Backend Automatizada)**
- **O quê:** Execute código de backend em resposta a eventos (ex: um novo utilizador a registar-se, uma escrita na base de dados) sem precisar de gerir um servidor.
- **Ideia para o Pixel Universe:**
  - **Conquistas Automáticas:** Crie uma função que é acionada quando um utilizador compra um pixel. Se for o 10º pixel dele, a função pode atribuir-lhe automaticamente a conquista "Colecionador".
  - **Moderação de Conteúdo:** Analise automaticamente as imagens carregadas para os píxeis para detetar conteúdo impróprio.
  - **Atualizações de Ranking:** Atualize um ranking global sempre que uma transação importante ocorrer no marketplace.
- **Como começar:** Instale a Firebase CLI, inicializa as funções no seu projeto local e faça deploy.

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
