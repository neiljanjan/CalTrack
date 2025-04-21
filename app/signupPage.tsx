// app/signupPage.tsx
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

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSignUp = async () => {
    if (password !== confirm) {
      return Alert.alert('Error', 'Passwords do not match');
    }
    try {
      await signUp(email, password, name);
      router.replace('/(tabs)/homePage');
    } catch (e: any) {
      Alert.alert('Sign Up failed', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={setName}
        value={name}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setConfirm}
        value={confirm}
      />
      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <Text style={styles.btnText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/loginPage')}>
        <Text style={styles.link}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20, backgroundColor:'#fff' },
  title: { fontSize:28, fontWeight:'bold', textAlign:'center', marginBottom:30 },
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
