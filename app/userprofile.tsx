// app/userprofile.tsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './context/AuthContext';
import { db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setProfile(snap.data());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // fallback values if some fields are missing
  const data = {
    name: user?.displayName ?? profile?.name ?? 'User',
    age: profile?.age ?? '-',
    height: profile?.height ? `${profile.height} cm` : '-',
    weight: profile?.weight ? `${profile.weight} kg` : '-',
    started: profile?.createdAt
      ? new Date(profile.createdAt).toLocaleDateString()
      : '-',
    goal: profile?.goal ?? '-',
    calGoal: profile?.calIntakeGoal
      ? `${profile.calIntakeGoal} kcal`
      : '-',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profilePic}>
        <Ionicons name="person-circle" size={80} color="#007AFF" />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.boxHeader}>Basic Information</Text>
        <Text style={styles.infoText}>Name: {data.name}</Text>
        <Text style={styles.infoText}>Age: {data.age}</Text>
        <Text style={styles.infoText}>Height: {data.height}</Text>
        <Text style={styles.infoText}>Weight: {data.weight}</Text>
        <Text style={styles.infoText}>Started: {data.started}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.boxHeader}>Goals</Text>
        <Text style={styles.infoText}>Goal: {data.goal}</Text>
        <Text style={styles.infoText}>Calorie Goal: {data.calGoal}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  profilePic: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  boxHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});
