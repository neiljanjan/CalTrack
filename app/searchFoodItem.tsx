import React, { useState, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMeals, Meal, Section } from "../context/MealsContext";
import { usePlan } from "@/context/PlanContext";

export default function SearchFoodItem() {
  const { section, dateKey } = useLocalSearchParams<{
    section: Section;
    dateKey?: string;
  }>();
  const { addFood } = useMeals();
  const { addPlanFood } = usePlan();
  const router = useRouter();
  const [query, setQuery] = useState("");

  // dummy master list, sorted
  const allFoods: Meal[] = useMemo(
    () =>
      [
        { name: "Apple", servings: 1, calories: 80 },
        { name: "Avocado Toast", servings: 1, calories: 180 },
        { name: "Banana", servings: 1, calories: 105 },
        { name: "Granola Bar", servings: 1, calories: 150 },
        { name: "Kale Salad", servings: 1, calories: 120 },
        { name: "Mixed Nuts", servings: 1, calories: 200 },
        { name: "Smoothie Bowl", servings: 1, calories: 250 },
        { name: "Turkey Sandwich", servings: 1, calories: 320 },
      ].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  // live filter
  const results = useMemo(
    () =>
      allFoods.filter((f) =>
        f.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [allFoods, query]
  );

  const onAdd = (item: Meal) => {
    if (dateKey) {
      addPlanFood(dateKey, section, item);
    } else {
      addFood(section, item);
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search foods..."
        placeholderTextColor="#666"
        selectionColor="#007AFF"
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={results}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => onAdd(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.cal}>{item.calories} kcal</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: "#000",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  name: { fontSize: 16 },
  cal: { fontSize: 14, color: "#666" },
});
