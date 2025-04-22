// app/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onSettingsPress: () => void;
  onNotificationsPress: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onSettingsPress,
  onNotificationsPress,
}) => {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] ?? 'User';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left: user icon + name */}
        <View style={styles.left}>
          <Link href="/userprofile" asChild>
            <TouchableOpacity style={styles.touchable}>
              <Ionicons name="person-circle" size={50} color="#007AFF" />
            </TouchableOpacity>
          </Link>
          <Text style={styles.name}>Hi, {firstName}</Text>
        </View>

        {/* Right: settings + notifications */}
        <View style={styles.right}>
          <TouchableOpacity onPress={onSettingsPress} style={styles.iconTouch}>
            <Ionicons name="settings-outline" size={28} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNotificationsPress} style={styles.iconTouch}>
            <Ionicons name="notifications-outline" size={28} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#fff' },
  container: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchable: {
    marginRight: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTouch: {
    marginLeft: 16,
  },
});

export default Header;
