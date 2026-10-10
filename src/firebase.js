import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
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
export const db = getFirestore(app);
export const auth = getAuth(app);