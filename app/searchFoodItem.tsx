// app/searchFoodItem.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMeals, Section } from "../context/MealsContext";
import { usePlan } from "@/context/PlanContext";
import { searchFoods, getNutritionDetails } from "@/lib/nutritionix";

type FoodItem = {
  food_name: string;
  calories?: number;
};

export default function SearchFoodItem() {
  const { section, dateKey, source } = useLocalSearchParams<{
    section: Section;
    dateKey?: string;
    source: "log" | "plan";
  }>();

  const { addFood } = useMeals();
  const { addPlanFood } = usePlan();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const rawResults = await searchFoods(query.trim() || "apple");
        const sorted = rawResults
          .sort((a, b) => a.food_name.localeCompare(b.food_name))
          .slice(0, 10); // limit to top 10

        const enriched: FoodItem[] = await Promise.all(
          sorted.map(async (item) => {
            try {
              const details = await getNutritionDetails(item.food_name);
              return {
                food_name: item.food_name,
                calories: Math.round(details.nf_calories),
              };
            } catch {
              return { food_name: item.food_name };
            }
          })
        );

        setResults(enriched);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetch, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleAddFood = async (foodName: string) => {
    try {
      const details = await getNutritionDetails(foodName);

      const meal = {
        name: details.food_name,
        servings: details.serving_qty || 1,
        calories: Math.round(details.nf_calories),
        macros: {
          protein: Math.round(details.nf_protein),
          carbs: Math.round(details.nf_total_carbohydrate),
          fats: Math.round(details.nf_total_fat),
        },
      };

      if (source === "plan" && dateKey) {
        addPlanFood(dateKey, section, {
          ...meal,
          date: new Date().toDateString(),
          section,
        });
      } else {
        addFood(section, meal);
      }

      router.back();
    } catch (err) {
      console.error("Nutrition detail fetch error:", err);
    }
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

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, i) => item.food_name + i}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleAddFood(item.food_name)}
            >
              <View>
                <Text style={styles.name}>{item.food_name}</Text>
                {item.calories !== undefined && (
                  <Text style={styles.subtext}>{item.calories} kcal</Text>
                )}
              </View>
              <Text style={styles.cal}>Tap to add</Text>
            </TouchableOpacity>
          )}
        />
      )}
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
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  name: { fontSize: 16 },
  subtext: { fontSize: 12, color: "#777" },
  cal: { fontSize: 14, color: "#666" },
});
