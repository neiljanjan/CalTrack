// app/components/HelpModal.tsx

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type HelpModalProps = {
  visible: boolean;
  onClose: () => void;
};

const helpItems = [
  "Tap + to log a new meal under the current meal type.",
  "Switch between Breakfast, Lunch, Dinner, Snacks using the toggle buttons.",
  "View your calorie and macro progress on the Statistics page.",
  "Edit your goals and weight in your Profile page.",
  "Access Settings from the top right to manage account details.",
  "Check Notifications for reminders or updates.",
  "Delete a meal by tapping the trash icon next to it."
];

const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: visible ? 1 : 0,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.header}>How to Use the App</Text>

          <ScrollView style={{ width: '100%' }}>
            {helpItems.map((text, i) => (
              <View key={i} style={styles.helpItem}>
                <Text style={styles.helpNumber}>{i + 1}.</Text>
                <Text style={styles.helpText}>{text}</Text>
              </View>
            ))}
          </ScrollView>

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
    width: SCREEN_WIDTH * 0.85,
    maxHeight: '80%',
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
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  helpNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#007AFF',
  },
  helpText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  closeBtn: {
    marginTop: 10,
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

export default HelpModal;
