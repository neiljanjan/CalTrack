// app/userprofile.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserProfile = () => {
  // Dummy data – replace with your real user data
  const user = {
    name: 'Placeholder Name',
    dateStarted: '2023-01-01',
    currentHeight: '170 cm',
    currentWeight: '70 kg',
    currentCalIntake: '2000 kcal',
    goalWeight: '65 kg',
    goalType: 'Build Muscle', // or 'Maintain'
    calIntakeGoal: '2200 kcal',
  };

  // You can attach your edit functionality here (such as navigating to an edit screen or opening an inline form)
  const handleEdit = (section: string) => {
    console.log(`Edit ${section}`);
    // e.g. router.push(`/edit/${section}`)
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Picture and Header */}
      <View style={styles.profilePicContainer}>
        <Ionicons name="person-circle" size={80} color="#007AFF" />
      </View>

      {/* Basic Information Box */}
      <View style={styles.infoBox}>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => handleEdit('basic')}
        >
          <Ionicons name="pencil-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.boxHeader}>Basic Information</Text>
        <Text style={styles.infoText}>Name: {user.name}</Text>
        <Text style={styles.infoText}>Date Started: {user.dateStarted}</Text>
        <Text style={styles.infoText}>Current Height: {user.currentHeight}</Text>
        <Text style={styles.infoText}>Current Weight: {user.currentWeight}</Text>
        <Text style={styles.infoText}>Current Cal Intake: {user.currentCalIntake}</Text>
      </View>

      {/* Goals Box */}
      <View style={styles.infoBox}>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => handleEdit('goals')}
        >
          <Ionicons name="pencil-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.boxHeader}>Goals</Text>
        <Text style={styles.infoText}>Goal Weight: {user.goalWeight}</Text>
        <Text style={styles.infoText}>Goal: {user.goalType}</Text>
        <Text style={styles.infoText}>Calorie Intake Goal: {user.calIntakeGoal}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  boxHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
});

export default UserProfile;
