// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

// Function to initialize the Firebase app, ensuring it's only done once
function initializeFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

const app = initializeFirebaseApp();

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize providers for social login
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const githubProvider = new GithubAuthProvider();

export { 
  app,
  auth, 
  db, 
  googleProvider, 
  facebookProvider, 
  twitterProvider, 
  githubProvider,
};
