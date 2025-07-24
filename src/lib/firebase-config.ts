// src/lib/firebase-config.ts
import type { FirebaseOptions } from 'firebase/app';

/**
 * ATTENTION:
 * 
 * Your Firebase credentials are now stored directly in this file.
 * This ensures they are correctly loaded by the application.
 * 
 * Please find your Web App configuration in the Firebase Console:
 * Project Settings > General > Your apps > Firebase SDK snippet > Config
 * https://console.firebase.google.com/project/pixel-universe-ub7uk/settings/general/
 */
export const firebaseConfig: FirebaseOptions = {
  projectId: "pixel-universe-ub7uk",
  appId: "1:973812314333:web:f6e74922db1673d2d62b34",
  storageBucket: "pixel-universe-ub7uk.firebasestorage.app",
  apiKey: "AIzaSyCN0aLeKTbE1gYlTX5kwebz63kbhIUR9ug",
  authDomain: "pixel-universe-ub7uk.firebaseapp.com",
  messagingSenderId: "973812314333"
};
