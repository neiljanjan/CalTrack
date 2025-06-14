// context/MealsContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { addMealEntry, listenToMeals } from '@/services/firestore';

export type Meal = {
  name: string;
  servings: number;
  calories: number;
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
  date: string;           // ✅ now required
  section: Section;       // ✅ also required
};

export type Section = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
type MealsByType = Record<Section, Meal[]>;

type MealsContextType = {
  mealsByType: MealsByType;
  addFood: (section: Section, item: Omit<Meal, 'date' | 'section'>) => void;
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
              name: m.name,
              servings: m.servings,
              calories: m.calories,
              macros: m.macros,
              date: m.date,
              section: section,
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

  return (
    <MealsContext.Provider value={{ mealsByType, addFood }}>
      {children}
    </MealsContext.Provider>
  );
};

export const useMeals = () => useContext(MealsContext);
