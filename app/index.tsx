// app/index.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // already signed in → go to your tabs
      router.replace('/(tabs)/homePage');
    } else {
      // not signed in → go to login
      router.replace('/loginPage');
    }
  }, [user]);

  // you can return null because we're just redirecting
  return null;
}
