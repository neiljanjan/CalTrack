// app/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

interface HeaderProps {
  onSettingsPress: () => void;
  onNotificationsPress: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onSettingsPress,
  onNotificationsPress,
}) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.headerContainer}>
      {/* Left Side: Profile picture link + welcome */}
      <View style={styles.leftContainer}>
        <Link href="/userprofile" asChild>
          <TouchableOpacity
            style={styles.profileContainer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="person-circle" size={40} color="#007AFF" />
          </TouchableOpacity>
        </Link>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.userName}>Placeholder Name</Text>
        </View>
      </View>

      {/* Right Side: Settings & Notifications */}
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={onSettingsPress} style={styles.iconButton}>
          <Ionicons name="settings-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNotificationsPress} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,  // increased for more breathing room
    paddingVertical: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    marginRight: 12,   // bump out to avoid clipping
    paddingHorizontal: 4,  // extra horizontal padding
  },
  welcomeContainer: {
    marginRight: 50,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
  },
});

export default Header;
