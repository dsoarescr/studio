// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// This is for server-side Genkit, which uses the GenAI key.
// The key is hardcoded here for simplicity in this environment.
// In a production app, use environment variables.
process.env.GOOGLE_API_KEY = "AIzaSyDPbqjR3o8mSQ1itdaoUQzyOmPEaUtaTI8";

let app: admin.app.App;

if (admin.apps.length === 0) {
  app = admin.initializeApp();
} else {
  app = admin.app();
}

export const adminAuth = app.auth();
export const adminDb = app.firestore();
