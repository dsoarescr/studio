
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config'; // Import the configuration directly

let app: FirebaseApp | null = null;
if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
} else if (typeof window !== 'undefined') {
  app = getApp();
}

// We need to handle the case where app might not be fully initialized on the server
const auth = app ? getAuth(app) : ({} as any); 
const db = app ? getFirestore(app) : ({} as any);

// Initialize providers for social login
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const githubProvider = new GithubAuthProvider();

export { 
  auth, 
  db, 
  googleProvider, 
  facebookProvider, 
  twitterProvider, 
  githubProvider,
};
