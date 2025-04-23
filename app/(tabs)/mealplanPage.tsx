import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CircularProgress from "react-native-circular-progress-indicator";
import Header from "../components/Header";
import AddFoodOptionsModal from "../components/AddFoodOptionsModal";

// 👉 Import the plan context, not meals
import { usePlan } from "@/context/PlanContext";
import { Section } from "@/context/MealsContext";

export default function MealPlanPage() {
  console.log('Rendering MealPlanPage');
  const { planData, addPlanFood } = usePlan();

  // date picker
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // track which section’s “+” was tapped
  const [addingSection, setAddingSection] = useState<Section | null>(null);

  // 👇 replace useMemo with this
  const dateKey = selectedDate.toDateString(); // now it will update on any re-render

  // 👇 and remove the memoized version entirely
  const mealsByTypeForDate = planData[dateKey] ?? {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  };


  // summary (totals for this plan page)
  const totalCalories = Object.values(mealsByTypeForDate)
    .flat()
    .reduce((sum, m) => sum + m.calories, 0);
  const calorieGoal = 2000;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header
          onSettingsPress={() => {
            /* … */
          }}
          onNotificationsPress={() => {
            /* … */
          }}
        />

        {/* DATE PICKER */}
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.calendarButtonText}>{dateKey}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <Modal transparent animationType="slide">
            <View style={styles.pickerModalContainer}>
              <View style={styles.pickerModalContent}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={(_, date) => {
                    // only update on Done
                    if (date) setSelectedDate(date);
                  }}
                  {...(Platform.OS === "ios"
                    ? { textColor: "#000" }
                    : { accentColor: "#000" })}
                  style={{ width: "100%" }}
                />
                <TouchableOpacity
                  style={styles.pickerDoneButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.pickerDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* PROGRESS */}
        <View style={styles.progressSection}>
          <View style={styles.circularWrapper}>
            <CircularProgress
              value={totalCalories}
              radius={80}
              maxValue={calorieGoal}
              showProgressValue={false}
              inActiveStrokeColor="#e0e0e0"
              activeStrokeColor="green"
              inActiveStrokeWidth={12}
              activeStrokeWidth={12}
            />
            <View style={styles.circularTextContainer}>
              <Text style={styles.circularText}>{totalCalories}</Text>
              <Text style={styles.circularSubText}>total calories</Text>
            </View>
          </View>
          {/* …macros… */}
        </View>

        {/* MEAL SECTIONS */}
        {(Object.keys(mealsByTypeForDate) as Section[]).map((section) => (
          <View key={section} style={styles.mealSection}>
            <View style={styles.mealSectionHeader}>
              <Text style={styles.mealSectionTitle}>{section}</Text>
              <TouchableOpacity
                style={styles.addMealButton}
                onPress={() => setAddingSection(section)}
              >
                <Text style={styles.addMealButtonText}>＋</Text>
              </TouchableOpacity>
            </View>
            {mealsByTypeForDate[section].map((meal, i) => (
              <View key={i} style={styles.mealItem}>
                <Text style={styles.mealItemText}>
                  {meal.name} – {meal.calories} kcal
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* ADD FOOD MODAL now gets dateKey */}
      <AddFoodOptionsModal
        visible={!!addingSection}
        onClose={() => setAddingSection(null)}
        section={addingSection!}
        dateKey={dateKey}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
  },
  calendarButton: {
    marginBottom: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  calendarButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  pickerModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerModalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  pickerDoneButton: {
    marginTop: 10,
  },
  pickerDoneText: {
    color: "#007AFF",
    fontSize: 16,
  },
  progressSection: {
    flexDirection: "row",
    width: "90%",
    marginBottom: 20,
    alignItems: "center",
  },
  circularWrapper: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  circularTextContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  circularText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
  },
  circularSubText: {
    fontSize: 14,
    color: "green",
  },
  macroContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  macroLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  macroBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginBottom: 10,
  },
  macroFill: {
    height: "100%",
    borderRadius: 5,
  },
  mealSection: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  mealSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mealSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  addMealButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  addMealButtonText: {
    color: "#fff",
    fontSize: 24,
    lineHeight: 24,
  },
  mealItem: {
    paddingVertical: 6,
  },
  mealItemText: {
    fontSize: 16,
  },
});
