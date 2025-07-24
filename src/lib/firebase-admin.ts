// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // In a managed environment like Firebase App Hosting,
    // this will use the service account credentials automatically provided.
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const adminAuth = admin.apps.length > 0 ? admin.auth() : ({} as admin.auth.Auth);
export const adminDb = admin.apps.length > 0 ? admin.firestore() : ({} as admin.firestore.Firestore);
