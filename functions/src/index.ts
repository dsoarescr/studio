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