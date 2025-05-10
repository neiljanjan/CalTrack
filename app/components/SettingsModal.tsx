// app/components/SettingsModal.tsx

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: visible ? 1 : 0,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleSignOut = () => {
    onClose();
    // TODO: integrate with auth context (this is just placeholder for now)
    router.replace('/loginPage');
  };

  const handleOption = (option: string) => {
    Alert.alert(option, `${option} settings will go here.`);
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <Animated.View style={[
          styles.modal,
          { transform: [{ scale: scaleAnim }] }
        ]}>
          <Text style={styles.header}>Settings</Text>

          {/* Settings Options */}
          <TouchableOpacity style={styles.option} onPress={() => handleOption('Edit Profile')}>
            <Text style={styles.optionText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handleOption('Units')}>
            <Text style={styles.optionText}>Units</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handleOption('Notifications')}>
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handleOption('Privacy')}>
            <Text style={styles.optionText}>Privacy (Delete Account)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handleOption('Help & Support')}>
            <Text style={styles.optionText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handleOption('About')}>
            <Text style={styles.optionText}>About</Text>
          </TouchableOpacity>

          {/* Sign Out */}
          <TouchableOpacity style={[styles.option, styles.signOut]} onPress={handleSignOut}>
            <Text style={[styles.optionText, styles.signOutText]}>Sign Out</Text>
          </TouchableOpacity>

          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeTxt}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
  },
  option: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  signOut: {
    backgroundColor: '#fdecea',
    marginTop: 20,
  },
  signOutText: {
    color: '#b71c1c',
    fontWeight: 'bold',
  },
  closeBtn: {
    marginTop: 25,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeTxt: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SettingsModal;
