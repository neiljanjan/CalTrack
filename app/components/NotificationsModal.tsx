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
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NotificationsModalProps = {
  visible: boolean;
  onClose: () => void;
};

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
          {[
            'Your daily calorie log is missing!',
            'New workout challenge available.',
            "Don't forget to log your meal."
          ].map((msg, i) => (
            <View key={i} style={styles.notificationItem}>
              <Text style={styles.notificationText}>{msg}</Text>
            </View>
          ))}

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
  notificationItem: {
    width: '100%',
    paddingVertical: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  notificationText: {
    fontSize: 18,
    color: '#333',
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

export default NotificationsModal;
