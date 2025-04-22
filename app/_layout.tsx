// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: true, // globally show headers (can override per screen)
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="loginPage" options={{ headerShown: false }} />
        <Stack.Screen name="signupPage" options={{ headerShown: false }} />
        <Stack.Screen
          name="userprofile"
          options={{
            title: 'Your Profile',
            headerTintColor: '#007AFF',
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        {/* Onboarding steps (if you want to hide headers for those too) */}
        <Stack.Screen name="onboarding/step1" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/step2" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/step3" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/step4" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
