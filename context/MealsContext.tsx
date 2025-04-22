import React, { createContext, useContext, useState, ReactNode } from "react";

export type Meal = {
  name: string;
  servings: number;
  calories: number;
  macros?: { protein: number; carbs: number; fats: number };
};

export type Section = "Breakfast" | "Lunch" | "Dinner" | "Snacks";

type MealsByType = Record<Section, Meal[]>;

type MealsContextType = {
  mealsByType: MealsByType;
  addFood: (section: Section, item: Meal) => void;
};

const defaultMeals: MealsByType = {
  Breakfast: [],
  Lunch: [],
  Dinner: [],
  Snacks: [],
};

const MealsContext = createContext<MealsContextType>({
  mealsByType: defaultMeals,
  addFood: () => {},
});

export const MealsProvider = ({ children }: { children: ReactNode }) => {
  const [mealsByType, setMealsByType] = useState<MealsByType>(defaultMeals);

  const addFood = (section: Section, item: Meal) => {
    setMealsByType((prev) => ({
      ...prev,
      [section]: [...prev[section], item],
    }));
  };

  return (
    <MealsContext.Provider value={{ mealsByType, addFood }}>
      {children}
    </MealsContext.Provider>
  );
};

export const useMeals = () => useContext(MealsContext);
