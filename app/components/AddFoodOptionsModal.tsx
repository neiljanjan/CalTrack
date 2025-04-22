import React, { useRef, useEffect } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Section } from "@/context/MealsContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  section: Section;
  dateKey?: string; // ← new
};

const AddFoodOptionsModal: React.FC<Props> = ({
  visible,
  onClose,
  section,
  dateKey,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const go = (path: "barcodeScanner" | "searchFoodItem") => {
    onClose();
    let qs = `section=${section}`;
    if (dateKey) qs += `&dateKey=${encodeURIComponent(dateKey)}`;
    router.push(`/${path}?${qs}`);
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={styles.header}>Add Food to {section}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => go("barcodeScanner")}
            >
              <Text style={styles.btnText}>Scan Barcode</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => go("searchFoodItem")}
            >
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
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
  },
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
export default AddFoodOptionsModal;
