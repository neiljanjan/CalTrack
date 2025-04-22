import { useEffect, useState } from 'react';
import { useRouter, useNavigationContainerRef } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 100); // Give layout time to mount

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (user) {
      router.replace('/(tabs)/homePage');
    } else {
      router.replace('/loginPage');
    }
  }, [user, isReady]);

  return null;
}
