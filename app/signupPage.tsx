// app/signupPage.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirm) {
      return Alert.alert('Error', 'Passwords do not match');
    }
    try {
      await signUp(email, password, name);
      router.replace('/onboarding/step1');
    } catch (e: any) {
      Alert.alert('Sign Up failed', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Name */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#666"
          onChangeText={setName}
          value={name}
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={[styles.input, { paddingRight: 40 }]}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={[styles.input, { paddingRight: 40 }]}
          placeholder="Confirm Password"
          placeholderTextColor="#666"
          secureTextEntry={!showConfirm}
          onChangeText={setConfirm}
          value={confirm}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirm(!showConfirm)}>
          <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <Text style={styles.btnText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/loginPage')}>
        <Text style={styles.link}>Already have an account? <Text style={styles.linkHighlight}>Log In</Text></Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#007AFF' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    paddingHorizontal: 10, marginBottom: 20, height: 50,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 20 },
  btnText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', fontSize: 14, color: '#666' },
  linkHighlight: { color: '#007AFF', fontWeight: '500' },
});
