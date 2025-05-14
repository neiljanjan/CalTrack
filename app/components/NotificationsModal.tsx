// app/components/NotificationsModal.tsx

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

type NotificationsModalProps = {
  visible: boolean;
  onClose: () => void;
};

const notifications = [
  {
    title: "Daily Calorie Log Missing",
    message: "Don't forget to log your calories today.",
    time: "2 hours ago"
  },
  {
    title: "New Meal Plan Available",
    message: "Check out our latest meal suggestions for your goals.",
    time: "1 day ago"
  },
  {
    title: "Weigh-In Reminder",
    message: "Log your weight today to track your progress.",
    time: "3 days ago"
  }
];

const NotificationsModal: React.FC<NotificationsModalProps> = ({ visible, onClose }) => {
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
          <Text style={styles.header}>Notifications</Text>

          <TouchableOpacity style={styles.markAllBtn} onPress={() => console.log("Marked all as read")}>
            <Text style={styles.markAllText}>Mark All As Read</Text>
          </TouchableOpacity>

          <ScrollView style={{ width: '100%' }}>
            {notifications.map((note, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{note.title}</Text>
                <Text style={styles.cardMessage}>{note.message}</Text>
                <Text style={styles.cardTime}>{note.time}</Text>
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
    height: SCREEN_WIDTH * 1.2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  markAllBtn: {
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  markAllText: {
    color: '#fff',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
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

export default NotificationsModal;
