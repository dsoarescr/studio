// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

if (typeof window === 'undefined') {
  if (admin.apps.length === 0) {
    try {
      // Use application default credentials provided by the environment
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } catch (error: any) {
      console.error("Firebase admin initialization error:", error.stack);
    }
  }
}

export const adminAuth = admin.apps.length > 0 ? admin.auth() : ({} as admin.auth.Auth);
export const adminDb = admin.apps.length > 0 ? admin.firestore() : ({} as admin.firestore.Firestore);

export const initializeAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }
  return admin.initializeApp();
};
