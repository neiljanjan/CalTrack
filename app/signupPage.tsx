import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

const SignupPage = () => {
    const navigation = useNavigation();
    return (
      <View className="flex-1 bg-white">
        <SafeAreaView className="flex">
          <View className="flex-row justify-start">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              className="bg-blue-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center">
            <Text className="text-5xl text-blue-500 font-bold mt-20 mb-20">
              CalTracker
            </Text>
          </View>
        </SafeAreaView>
  
        <View className="flex-1 bg-white px-8 pt-8">
          <View className="form space-y-2">
            <View className="flex-row align-center">
              <Entypo
                name="email"
                size={24}
                color="black"
                style={{ marginRight: 20, marginTop: 25 }}
              />
              <TextInput
                style={{
                  padding: 16,
                  backgroundColor: "white",
                  color: "gray",
                  marginBottom: 30,
                  borderBottomWidth: 2,
                  borderBottomColor: "black",
                  width: "85%",
                }}
                placeholder="Enter your email address"
                value="Enter your email address"
              />
            </View>

            <View className="flex-row align-center">
              <Entypo
                name="user"
                size={24}
                color="black"
                style={{ marginRight: 20, marginTop: 25 }}
              />
              <TextInput
                style={{
                  padding: 16,
                  backgroundColor: "white",
                  color: "gray",
                  marginBottom: 30,
                  borderBottomWidth: 2,
                  borderBottomColor: "black",
                  width: "85%",
                }}
                placeholder="Enter your name"
                value="Enter your name"
              />
            </View>
  
            <View className="flex-row align-center">
              <Entypo
                name="lock"
                size={24}
                color="black"
                style={{ marginRight: 20, marginTop: 25 }}
              />
              <TextInput
                style={{
                  padding: 16,
                  backgroundColor: "white",
                  color: "gray",
                  marginBottom: 30,
                  borderBottomWidth: 2,
                  borderBottomColor: "black",
                  width: "85%",
                }}
                placeholder="Enter your password"
                value="Enter your password"
              />
            </View>

            <View className="flex-row align-center">
              <Entypo
                name="lock"
                size={24}
                color="black"
                style={{ marginRight: 20, marginTop: 25 }}
              />
              <TextInput
                style={{
                  padding: 16,
                  backgroundColor: "white",
                  color: "gray",
                  marginBottom: 30,
                  borderBottomWidth: 2,
                  borderBottomColor: "black",
                  width: "85%",
                }}
                placeholder="Confirm your password"
                value="Confirm your password"
              />
            </View>
  
            <Link href="/onboarding/step1" className="py-3 bg-blue-500 rounded-xl">
              <Text className="text-white text-center bg-blue-500 rounded-xl font-xl align-center justify-center flex">
                Sign Up
              </Text>
            </Link>
  
            <View className="flex-row justify-center">
              <Text className="text-center mt-10">
                Joined us before?{" "}
                <Link href="/loginPage" className="text-blue-500">
                  Log in
                </Link>
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
};

export default SignupPage;