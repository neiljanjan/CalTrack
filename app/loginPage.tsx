// app/loginPage.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      router.replace('/(tabs)/homePage');
    } catch (e: any) {
      Alert.alert('Login failed', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CalTracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.btnText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/signupPage')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20, backgroundColor:'#fff' },
  title: { fontSize:32, fontWeight:'bold', textAlign:'center', marginBottom:40 },
  input: {
    borderWidth:1, borderColor:'#ccc', borderRadius:8,
    padding:12, marginBottom:20
  },
  button: {
    backgroundColor:'#007AFF', padding:15,
    borderRadius:8, marginBottom:20
  },
  btnText: { color:'#fff', textAlign:'center', fontSize:16 },
  link: { color:'#007AFF', textAlign:'center' },
});
