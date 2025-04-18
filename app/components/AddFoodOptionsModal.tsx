import React, { useRef, useEffect } from "react";
import {
  Modal,
  TouchableOpacity,
  Animated,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

type Props = {
  visible: boolean;
  onClose: () => void;
  section: string;
  dateKey: string;
};

export default function AddFoodOptionsModal({
  visible,
  onClose,
  section,
  dateKey,
}: Props) {
  const slide = useRef(new Animated.Value(300)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 0 : 300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const goSearch = () => {
    onClose();
    router.push(`/searchFoodItem?section=${section}&date=${dateKey}`);
  };
  const goBarcode = () => {
    onClose();
    router.push(`/barcodeScanner?section=${section}&date=${dateKey}`);
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slide }] }]}
        >
          <Text style={styles.header}>Add to {section}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.btn} onPress={goBarcode}>
              <Text style={styles.btnText}>Scan Barcode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={goSearch}>
              <Text style={styles.btnText}>Search Item</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  header: { fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 15 },
  row: { flexDirection: "row", justifyContent: "space-around" },
  btn: {
    width: "45%",
    aspectRatio: 1,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  close: { marginTop: 15, alignSelf: "center" },
  closeText: { color: "#007AFF", fontSize: 16 },
});
