// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config'; // Import the configuration directly

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

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
