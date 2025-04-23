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
  console.log('Rendering SearchFoodItem');
  const { section, dateKey, source } = useLocalSearchParams<{
    section: Section;
    dateKey?: string;
    source: 'log' | 'plan';
  }>();
  
  const { addFood } = useMeals();
  const { addPlanFood } = usePlan();
  const router = useRouter();
  const [query, setQuery] = useState("");


  //dummy data
  const allFoods: Meal[] = useMemo(
    () =>
      [
        {
          name: "Apple",
          servings: 1,
          calories: 80,
          macros: { protein: 0, carbs: 22, fats: 0 },
        },
        {
          name: "Avocado Toast",
          servings: 1,
          calories: 180,
          macros: { protein: 4, carbs: 20, fats: 10 },
        },
        {
          name: "Banana",
          servings: 1,
          calories: 105,
          macros: { protein: 1, carbs: 27, fats: 0 },
        },
        {
          name: "Granola Bar",
          servings: 1,
          calories: 150,
          macros: { protein: 3, carbs: 17, fats: 7 },
        },
        {
          name: "Kale Salad",
          servings: 1,
          calories: 120,
          macros: { protein: 5, carbs: 10, fats: 6 },
        },
        {
          name: "Mixed Nuts",
          servings: 1,
          calories: 200,
          macros: { protein: 6, carbs: 8, fats: 18 },
        },
        {
          name: "Smoothie Bowl",
          servings: 1,
          calories: 250,
          macros: { protein: 7, carbs: 35, fats: 9 },
        },
        {
          name: "Turkey Sandwich",
          servings: 1,
          calories: 320,
          macros: { protein: 20, carbs: 30, fats: 12 },
        },
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
    console.log("Adding to", source, item); // ← Debug log
  
    if (source === "plan" && dateKey) {
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
