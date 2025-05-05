// /config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC0zf4wWjb8E4r5SocoM2GK9SN-suhQbx4',
  authDomain: 'caltrack-7d1e0.firebaseapp.com',
  projectId: 'caltrack-7d1e0',
  storageBucket: 'caltrack-7d1e0.firebasestorage.app',
  messagingSenderId: '953941602877',
  appId: '1:953941602877:web:a97f14bdd7c22a974af054',
  measurementId: 'G-3G8VDHYTDD',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // memory-only persistence
export const db = getFirestore(app);