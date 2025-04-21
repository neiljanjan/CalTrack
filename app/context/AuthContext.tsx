// app/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  UserCredential,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUserProfile } from '../services/firestore';

type AuthContextType = {
  user: User | null;
  signUp: (email: string, password: string, name?: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  signUp: async () => { throw new Error('uninitialized'); },
  signIn: async () => { throw new Error('uninitialized'); },
  signOut: async () => { throw new Error('uninitialized'); }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // initialize profile in Firestore
    await createUserProfile(cred.user.uid, { email, name });
    return cred;
  };

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const signOut = () => fbSignOut(auth);

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
