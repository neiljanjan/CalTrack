import { Stack } from "expo-router";
import { MealsProvider } from "./context/MealsContext";
import { PlanProvider } from "./context/PlanContext";
import "./globals.css";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  return (
    <MealsProvider>
      <PlanProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="loginPage" options={{ headerShown: false }} />
          <Stack.Screen name="signupPage" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/step1" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/step2" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/step3" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/step4" options={{ headerShown: false }} />
        </Stack>
      </PlanProvider>
    </MealsProvider>
  );
}
