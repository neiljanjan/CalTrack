import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (servings: number) => void;
  foodName: string;
};

const SetServingsModal: React.FC<Props> = ({
  visible,
  onClose,
  onConfirm,
  foodName,
}) => {
  const [servings, setServings] = useState("1");

  const handleConfirm = () => {
    const num = parseFloat(servings);
    if (!isNaN(num) && num > 0) {
      onConfirm(num);
      setServings("1");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Set Servings for</Text>
          <Text style={styles.foodName}>{foodName}</Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={servings}
            onChangeText={setServings}
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirm}>
              <Text style={styles.btnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#007AFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnCancel: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 10,
    marginRight: 5,
    borderRadius: 6,
    alignItems: "center",
  },
  btnConfirm: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 10,
    marginLeft: 5,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default SetServingsModal;
