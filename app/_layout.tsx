// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';  // adjust path if needed
import './globals.css';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* Tab‐based app */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Landing page */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Auth flows */}
        <Stack.Screen name="loginPage" options={{ headerShown: false }} />
        <Stack.Screen name="signupPage" options={{ headerShown: false }} />
        {/* Onboarding */}
        <Stack.Screen name="onboarding/step1" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/step2" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/step3" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/step4" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
