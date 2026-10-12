// firebase.js — connects the app to your Firebase project.

import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBo8Tbr5U-8FXxcHYKjeMSyjbyVHs0BODg",
  authDomain: "grocery-app-17d58.firebaseapp.com",
  projectId: "grocery-app-17d58",
  storageBucket: "grocery-app-17d58.firebasestorage.app",
  messagingSenderId: "187562687591",
  appId: "1:187562687591:web:457902d940264d53b4a8c2"
};

const app = initializeApp(firebaseConfig);

// Firestore with OFFLINE support:
// - persistentLocalCache keeps a copy of your lists on the device,
//   so the app shows data and accepts changes without internet
// - changes made offline are queued and synced automatically once back online
// - persistentMultipleTabManager lets several open tabs share that copy safely
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

// Sign-in. Firebase remembers the login on the device, also offline.
export const auth = getAuth(app);
