/**
 * Importa os módulos necessários.
 */
"use strict";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {UserRecord} from "firebase-admin/auth";

// Inicializa a app de admin para poder aceder aos serviços Firebase.
admin.initializeApp();

// Obtém uma referência à base de dados Firestore.
const db = admin.firestore();

/**
 * Função acionada quando um novo utilizador é criado na Autenticação Firebase.
 *
 * @summary Atribui créditos e XP de boas-vindas a um novo utilizador.
 */
export const onnewusercreate = functions
  .region("eur3") // Corrigido para a região principal do projeto
  .auth.user()
  .onCreate(async (user: UserRecord) => {
    const {uid, email, displayName, photoURL} = user;

    // Cria um novo documento na coleção 'users' com os dados do utilizador.
    await db
      .collection("users")
      .doc(uid)
      .set({
        uid,
        email,
        displayName: displayName || "Novo Explorador",
        photoURL:
          photoURL ||
          "https://firebasestorage.googleapis.com/v0/b/pixel-universe-ub7uk.appspot.com/o/user_profile_placeholder.png?alt=media&token=c2181279-c893-4d54-8f29-5b0e6187d53f",
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

    functions.logger.log(
      `Novo utilizador ${displayName || email} (${uid}) criado com sucesso.`
    );
    return null;
  });
