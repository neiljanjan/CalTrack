import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-5xl text-blue-500 
      font-bold">CalTracker</Text>
      <Link href="/loginPage" className="text-blue-500">Login</Link>
      <Link href="/signupPage" className="text-blue-500">Sign Up</Link>
      <Link href="/homePage" className="text-blue-500">Go To Home</Link>
    </View>
  );
}
