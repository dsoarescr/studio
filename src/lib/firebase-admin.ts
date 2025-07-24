// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  try {
    // In a managed environment like Firebase App Hosting, 
    // initializeApp() with no arguments will use the service account
    // credentials automatically provided by the environment.
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

// Safely export the services, providing mock objects if initialization fails
// This prevents the entire application from crashing during build or server start
// if the admin SDK fails to initialize for any reason.
export const adminAuth = admin.apps.length > 0 ? admin.auth() : ({} as admin.auth.Auth);
export const adminDb = admin.apps.length > 0 ? admin.firestore() : ({} as admin.firestore.Firestore);
