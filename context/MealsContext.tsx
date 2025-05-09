// context/MealsContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { addMealEntry, listenToMeals, deleteMealEntry } from '@/services/firestore';

export type Meal = {
  id?: string; // 🔥 Added for deletion
  name: string;
  servings: number;
  calories: number;
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
  date: string;
  section: Section;
};

export type Section = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
type MealsByType = Record<Section, Meal[]>;

type MealsContextType = {
  mealsByType: MealsByType;
  addFood: (section: Section, item: Omit<Meal, 'date' | 'section'>) => void;
  deleteFood: (mealId: string) => Promise<void>;
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
  deleteFood: async () => {},
});

export const MealsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [mealsByType, setMealsByType] = useState<MealsByType>(defaultMeals);

  useEffect(() => {
    if (!user) return;

    const today = new Date().toDateString();

    const unsubscribe = listenToMeals(user.uid, (meals) => {
      const grouped: MealsByType = {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: [],
      };

      meals.forEach((m) => {
        if (m.date === today) {
          const section = m.section as Section;
          if (grouped[section]) {
            grouped[section].push({
              id: m.id, // 🔥 Important for deletion
              name: m.name,
              servings: m.servings,
              calories: m.calories,
              macros: m.macros,
              date: m.date,
              section,
            });
          }
        }
      });

      setMealsByType(grouped);
    });

    return unsubscribe;
  }, [user]);

  const addFood = async (section: Section, item: Omit<Meal, 'date' | 'section'>) => {
    if (!user) return;

    const today = new Date().toDateString();

    const mealWithMeta: Meal = {
      ...item,
      section,
      date: today,
    };

    await addMealEntry(user.uid, mealWithMeta);
  };

  const deleteFood = async (mealId: string) => {
    if (!user) return;
    await deleteMealEntry(user.uid, mealId);
  };

  return (
    <MealsContext.Provider value={{ mealsByType, addFood, deleteFood }}>
      {children}
    </MealsContext.Provider>
  );
};

export const useMeals = () => useContext(MealsContext);
