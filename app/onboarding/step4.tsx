// app/onboarding/step4.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Step4Onboarding = () => {
  // State to track the selected goal. It can be "build", "lose", or "maintain".
  const [selectedGoal, setSelectedGoal] = useState<
    "build" | "lose" | "maintain" | null
  >(null);

  // Data for the three goal options.
  const goals = [
    { id: "build", label: "Build Muscle", icon: "arm-flex" as any },
    { id: "lose", label: "Lose Weight", icon: "food-apple" as any },
    { id: "maintain", label: "Maintain", icon: "scale-bathroom" as any },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What's your goal?</Text>
      <View style={styles.goalsContainer}>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalBox,
              selectedGoal === goal.id && styles.goalBoxSelected,
            ]}
            onPress={() =>
              setSelectedGoal(goal.id as "build" | "lose" | "maintain")
            }
          >
            <MaterialCommunityIcons
              name={goal.icon}
              size={40}
              color={selectedGoal === goal.id ? "#fff" : "#007AFF"}
            />
            <Text
              style={[
                styles.goalLabel,
                selectedGoal === goal.id && styles.goalLabelSelected,
              ]}
            >
              {goal.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Button row with Back and Next */}
      <View style={styles.buttonRow}>
        <Link href="./step3" style={[styles.actionButton, styles.backButton]}>
          <Text style={styles.buttonText}>Back</Text>
        </Link>
        <Link
          href="/(tabs)/homePage"
          style={[styles.actionButton, styles.nextButton]}
        >
        <Text style={styles.buttonText}>Next</Text>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: "center",
  },
  goalsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
  },
  goalBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    borderColor: "#007AFF",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },
  goalBoxSelected: {
    backgroundColor: "#007AFF",
  },
  goalLabel: {
    marginTop: 10,
    fontSize: 14,
    color: "#007AFF",
    textAlign: "center",
  },
  goalLabelSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Button row style:
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButton: {
    flex: 0.45,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#777",
  },
  nextButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Step4Onboarding;
