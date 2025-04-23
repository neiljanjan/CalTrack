// app/_layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { MealsProvider } from '@/context/MealsContext';
import { PlanProvider } from '@/context/PlanContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <MealsProvider>
        <PlanProvider>
          <React.Fragment>
            <Stack
              screenOptions={{
                headerShown: true,
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
              <Stack.Screen name="onboarding/step1" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/step2" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/step3" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/step4" options={{ headerShown: false }} />
            </Stack>
          </React.Fragment>
        </PlanProvider>
      </MealsProvider>
    </AuthProvider>
  );
}
