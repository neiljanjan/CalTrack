// app/userProfile.tsx

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Stack } from 'expo-router';
import { addWeightEntry } from '@/services/firestore'; // ✅ added

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [goalWeightInput, setGoalWeightInput] = useState('');
  const [calGoalInput, setCalGoalInput] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [user]);

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

  const handleSaveGoals = async () => {
    if (!user) return;
    try {
      const ref = doc(db, 'users', user.uid);
      await updateDoc(ref, {
        weight: parseFloat(weightInput),
        goalWeight: parseFloat(goalWeightInput),
        calIntakeGoal: parseInt(calGoalInput),
      });

      // ✅ Also store in the weights subcollection
      if (weightInput) {
        await addWeightEntry(user.uid, parseFloat(weightInput));
      }

      setEditVisible(false);
      fetchProfile(); // refresh view
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

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
    goalWeight: profile?.goalWeight ? `${profile.goalWeight} kg` : '-',
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Your Profile',
          headerShown: true,
          headerTintColor: '#007AFF',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <Text style={styles.infoText}>Goal Weight: {data.goalWeight}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setWeightInput(''); // leave blank
                setGoalWeightInput(profile?.goalWeight?.toString() || '');
                setCalGoalInput(profile?.calIntakeGoal?.toString() || '');
                setEditVisible(true);
              }}
            >
              <Text style={styles.editButtonText}>Edit Goals</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={editVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Goals</Text>

            <TextInput
              style={styles.input}
              placeholder="Current Weight (kg)"
              placeholderTextColor="#666"
              value={weightInput}
              onChangeText={setWeightInput}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Goal Weight (kg)"
              placeholderTextColor="#666"
              value={goalWeightInput}
              onChangeText={setGoalWeightInput}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Daily Calorie Goal (kcal)"
              placeholderTextColor="#666"
              value={calGoalInput}
              onChangeText={setCalGoalInput}
              keyboardType="numeric"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveGoals}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    minHeight: Dimensions.get('window').height,
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
  editButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: '#000',
  },
  modalActions: {
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
