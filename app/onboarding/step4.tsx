import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { setUserProfile } from '../lib/firebaseUtils';

export default function Step4Onboarding() {
  const params = useLocalSearchParams<{ age?: string; weight?: string; height?: string }>();
  const age = Number(params.age);
  const weight = Number(params.weight);
  const height = Number(params.height);

  const [selectedGoal, setSelectedGoal] = useState<'build' | 'lose' | 'maintain' | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleFinish = async () => {
    if (!selectedGoal) {
      return Alert.alert('Please select a goal');
    }
    if (!user) {
      return Alert.alert('Not signed in');
    }

    const profileData = {
      age,
      weight,
      height,
      goal: selectedGoal,
      name: user.displayName || '',
      email: user.email || '',
      createdAt: new Date().toISOString(),
    };

    try {
      await setUserProfile(user.uid, profileData);
      router.replace('/(tabs)/homePage');
    } catch (err: any) {
      Alert.alert('Error saving profile', err.message);
    }
  };

  const goals = [
    { id: 'build', label: 'Build Muscle', icon: 'arm-flex' },
    { id: 'lose', label: 'Lose Weight',   icon: 'food-apple' },
    { id: 'maintain', label: 'Maintain',   icon: 'scale-bathroom' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What's your goal?</Text>
      <View style={styles.goalsContainer}>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[styles.goalBox, selectedGoal === goal.id && styles.goalBoxSelected]}
            onPress={() => setSelectedGoal(goal.id as any)}
          >
            <MaterialCommunityIcons
              name={goal.icon as any}
              size={40}
              color={selectedGoal === goal.id ? '#fff' : '#007AFF'}
            />
            <Text style={[styles.goalLabel, selectedGoal === goal.id && styles.goalLabelSelected]}>
              {goal.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <Link href="./step3" style={[styles.actionButton, styles.backButton]}>
          <Text style={styles.buttonText}>Back</Text>
        </Link>
        <TouchableOpacity onPress={handleFinish} style={[styles.actionButton, styles.nextButton]}>
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, marginBottom: 30, textAlign: 'center' },
  goalsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 40 },
  goalBox: { alignItems: 'center', justifyContent: 'center', width: 100, height: 100, borderColor: '#007AFF', borderWidth: 2, borderRadius: 10, padding: 10 },
  goalBoxSelected: { backgroundColor: '#007AFF' },
  goalLabel: { marginTop: 10, fontSize: 14, color: '#007AFF', textAlign: 'center' },
  goalLabelSelected: { color: '#fff', fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  actionButton: { flex: 0.45, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  backButton: { backgroundColor: '#777' },
  nextButton: { backgroundColor: '#007AFF' },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
