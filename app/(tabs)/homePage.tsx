import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CircularProgress from "react-native-circular-progress-indicator";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "../components/Header";
import AddFoodOptionsModal from "../components/AddFoodOptionsModal.tsx";
import SettingsModal from "../components/SettingsModal";
import NotificationsModal from "../components/NotificationsModal";
import { useMeals } from "../context/MealsContext";

const screenHeight = Dimensions.get("window").height;
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;

export default function HomePage() {
  const insets = useSafeAreaInsets();
  const { mealsByType } = useMeals();

  // universal total across all sections
  const consumed = Object.values(mealsByType)
    .flat()
    .reduce((sum, m) => sum + m.calories, 0);

  const burned = 0;
  const net = consumed - burned;
  const goal = 2000;
  const displayValue = Math.min(consumed, goal);

  const [section, setSection] =
    useState<(typeof mealTypes)[number]>("Breakfast");
  const [addVisible, setAddVisible] = useState(false);
  const [settingsVis, setSettingsVis] = useState(false);
  const [notifyVis, setNotifyVis] = useState(false);

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 50, minHeight: screenHeight },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Header
          onSettingsPress={() => setSettingsVis(true)}
          onNotificationsPress={() => setNotifyVis(true)}
        />

        {/* SUMMARY CIRCLE */}
        <View style={styles.summaryBox}>
          <View style={styles.circularWrapper}>
            <CircularProgress
              value={displayValue}
              radius={60}
              maxValue={goal}
              showProgressValue={false}
              inActiveStrokeColor="#e0e0e0"
              activeStrokeColor="green"
              inActiveStrokeWidth={10}
              activeStrokeWidth={10}
            />
            <View style={styles.circularTextContainer}>
              <Text style={styles.circularText}>{consumed}</Text>
              <Text style={styles.circularSubText}>calories</Text>
            </View>
          </View>
          <View style={styles.linearContainer}>
            {[
              { label: "Consumed", value: consumed, color: "#007AFF" },
              { label: "Burned", value: burned, color: "#FF9500" },
              { label: "Net", value: net, color: "#34C759" },
            ].map(({ label, value, color }) => (
              <View key={label} style={styles.linearItem}>
                <Text style={styles.linearValue}>{value}</Text>
                <Text style={styles.linearLabel}>{label}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min((value / goal) * 100, 100)}%`,
                        backgroundColor: value > 0 ? color : "#e0e0e0",
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* MEAL‐TYPE TOGGLE */}
        <View style={styles.toggleContainer}>
          {mealTypes.map((mt) => (
            <TouchableOpacity
              key={mt}
              style={[
                styles.toggleButton,
                section === mt && styles.toggleButtonSelected,
              ]}
              onPress={() => setSection(mt)}
            >
              <Text
                style={[
                  styles.toggleText,
                  section === mt && styles.toggleTextSelected,
                ]}
              >
                {mt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MEAL LIST + ADD */}
        <View style={styles.mealsBox}>
          <Text style={styles.sectionTitle}>{section}</Text>
          {mealsByType[section].map((m, i) => (
            <View key={i} style={styles.mealItem}>
              <Ionicons
                name="fast-food-outline"
                size={24}
                color="#007AFF"
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.mealName}>{m.name}</Text>
                <Text style={styles.mealDetails}>
                  {m.servings}× • {m.calories} kcal
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.addSection}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddVisible(true)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <AddFoodOptionsModal
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        section={section}
      />
      <SettingsModal
        visible={settingsVis}
        onClose={() => setSettingsVis(false)}
      />
      <NotificationsModal
        visible={notifyVis}
        onClose={() => setNotifyVis(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 20,
  },
  summaryBox: {
    width: "90%",
    backgroundColor: "#E0F7FA",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  circularWrapper: { position: "relative" },
  circularTextContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  circularText: { fontSize: 20, fontWeight: "bold", color: "green" },
  circularSubText: { fontSize: 12, color: "green" },
  linearContainer: { flex: 1, marginLeft: 15 },
  linearItem: { marginBottom: 8, alignItems: "center" },
  linearValue: { fontSize: 16, fontWeight: "bold" },
  linearLabel: { fontSize: 12, color: "#666" },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3 },
  toggleContainer: { flexDirection: "row", width: "90%", marginBottom: 15 },
  toggleButton: {
    flex: 1,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007AFF",
    alignItems: "center",
  },
  toggleButtonSelected: { backgroundColor: "#007AFF" },
  toggleText: { color: "#007AFF" },
  toggleTextSelected: { color: "#fff", fontWeight: "bold" },
  mealsBox: {
    width: "90%",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    width: "100%",
    elevation: 2,
  },
  mealName: { fontSize: 16, fontWeight: "500" },
  mealDetails: { fontSize: 12, color: "#666" },
  addSection: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 24, lineHeight: 24 },
});
