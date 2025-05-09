// app/(tabs)/mealplanPage.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CircularProgress from "react-native-circular-progress-indicator";
import Header from "../components/Header";
import AddFoodOptionsModal from "../components/AddFoodOptionsModal";
import SettingsModal from "../components/SettingsModal";
import NotificationsModal from "../components/NotificationsModal";
import { useAuth } from "@/context/AuthContext";
import { usePlan } from "@/context/PlanContext";
import { Section, Meal } from "@/context/MealsContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { saveMealPlan } from "@/services/firestore";

const screenHeight = Dimensions.get("window").height;
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;

export default function MealPlanPage() {
  const { user } = useAuth();
  const {
    planData,
    addPlanFood,
    deletePlanFood,
    loadPlanForDate,
    loadingDates,
  } = usePlan();
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [addingSection, setAddingSection] = useState<Section | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const dateKey = selectedDate.toDateString();
  const mealsByTypeForDate = planData[dateKey];
  const isLoading = loadingDates.has(dateKey);

  const safeMeals = mealsByTypeForDate ?? {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  };

  const allMeals = Object.values(safeMeals).flat();

  const totalCalories = allMeals.reduce((sum, m) => sum + m.calories, 0);
  const macroTotals = allMeals.reduce(
    (acc, m) => {
      if (m.macros) {
        acc.protein += m.macros.protein;
        acc.carbs += m.macros.carbs;
        acc.fats += m.macros.fats;
      }
      return acc;
    },
    { protein: 0, carbs: 0, fats: 0 }
  );

  const calorieGoal = 2000;

  useEffect(() => {
    if (user) {
      loadPlanForDate(user.uid, dateKey);
    }
  }, [user, dateKey]);

  const handleDelete = (section: Section, index: number) => {
    Alert.alert("Delete Planned Meal", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deletePlanFood(dateKey, section, index),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: insets.bottom + 50,
            paddingTop: insets.top + 20,
            minHeight: screenHeight,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Header
          onSettingsPress={() => setSettingsVisible(true)}
          onNotificationsPress={() => setNotificationsVisible(true)}
        />

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

        {/* Summary */}
        <View style={styles.summaryBox}>
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
            <Text style={styles.circularSubText}>calories</Text>
          </View>

          {/* Macros */}
          <View style={styles.bottomSummary}>
            {[
              { label: "Protein", value: macroTotals.protein, goal: 150, color: "#007AFF" },
              { label: "Carbs", value: macroTotals.carbs, goal: 250, color: "#FF9500" },
              { label: "Fats", value: macroTotals.fats, goal: 70, color: "#34C759" },
            ].map((macro) => (
              <View key={macro.label} style={styles.macroItem}>
                <CircularProgress
                  value={macro.value}
                  radius={30}
                  maxValue={macro.goal}
                  progressValueColor="#333"
                  activeStrokeColor={macro.color}
                  inActiveStrokeColor="#e0e0e0"
                  inActiveStrokeWidth={6}
                  activeStrokeWidth={6}
                  progressValueFontSize={14}
                  valueSuffix="g"
                />
                <Text style={styles.macroLabel}>{macro.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Meals Section */}
        {isLoading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Loading meal plan...
          </Text>
        ) : (
          (Object.keys(safeMeals) as Section[]).map((section) => (
            <View key={section} style={styles.mealsBox}>
              <View style={styles.mealSectionHeader}>
                <Text style={styles.sectionTitle}>{section}</Text>
              </View>

              {safeMeals[section].map((meal, i) => (
                <View key={i} style={styles.mealItem}>
                  <Ionicons
                    name="fast-food-outline"
                    size={24}
                    color="#007AFF"
                    style={{ marginRight: 8 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealDetails}>
                      {meal.servings > 1 ? `${meal.servings}× • ` : ""}
                      {meal.calories} kcal
                      {meal.macros
                        ? ` • ${meal.macros.protein} Proteins ${meal.macros.carbs} Carbs ${meal.macros.fats} Fats`
                        : ""}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(section, i)}>
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.addSection}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setAddingSection(section)}
                >
                  <Text style={styles.addButtonText}>＋</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {addingSection && (
        <AddFoodOptionsModal
          visible={true}
          onClose={() => setAddingSection(null)}
          section={addingSection}
          dateKey={dateKey}
        />
      )}

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
      <NotificationsModal visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 20,
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
  summaryBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    elevation: 2,
  },
  circularTextContainer: {
    position: "absolute",
    top: "32%",
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
  bottomSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  macroItem: {
    alignItems: "center",
    flex: 1,
  },
  macroLabel: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
  },
  mealsBox: {
    width: "90%",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  mealSectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    width: "100%",
  },
  mealName: {
    fontSize: 16,
    fontWeight: "500",
  },
  mealDetails: {
    fontSize: 12,
    color: "#666",
  },
  addSection: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 24,
  },
});
