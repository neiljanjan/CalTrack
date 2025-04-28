// context/PlanContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Meal, Section } from "./MealsContext";
import { getPlanForDate, saveMealPlan } from "@/services/firestore";
import { auth } from "@/config/firebase";

export type MealsByType = Record<Section, Meal[]>;
export type PlanData = Record<string, MealsByType>;

interface PlanContextType {
  planData: PlanData;
  addPlanFood: (dateKey: string, section: Section, item: Meal) => void;
  loadPlanForDate: (uid: string, dateKey: string) => Promise<void>;
  loadingDates: Set<string>;
}

const defaultMeals: MealsByType = {
  Breakfast: [],
  Lunch: [],
  Dinner: [],
  Snacks: [],
};

const PlanContext = createContext<PlanContextType>({
  planData: {},
  addPlanFood: () => {},
  loadPlanForDate: async () => {},
  loadingDates: new Set(),
});

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [planData, setPlanData] = useState<PlanData>({});
  const [loadingDates, setLoadingDates] = useState<Set<string>>(new Set());

  const addPlanFood = (dateKey: string, section: Section, item: Meal) => {
    setPlanData((prev) => {
      const dayMeals = prev[dateKey] ?? { ...defaultMeals };
      const updatedDay = {
        ...dayMeals,
        [section]: [...dayMeals[section], item],
      };

      // 🔥 Save updated day meals to Firestore!
      if (userUid) {
        saveMealPlan(userUid, dateKey, section, updatedDay[section]);
      }

      return {
        ...prev,
        [dateKey]: updatedDay,
      };
    });
  };

  // To get user id when adding (import auth)
  const userUid = auth.currentUser?.uid || "";

  const loadPlanForDate = async (uid: string, dateKey: string) => {
    if (!uid) return;
    if (loadingDates.has(dateKey)) return;

    setLoadingDates((prev) => new Set(prev).add(dateKey));

    console.log("📦 Loading meal plan for:", uid, dateKey);
    const plan = await getPlanForDate(uid, dateKey);
    console.log("🧾 Retrieved plan from Firestore:", plan);

    if (plan) {
      setPlanData((prev) => ({
        ...prev,
        [dateKey]: {
          Breakfast: plan.Breakfast ?? [],
          Lunch: plan.Lunch ?? [],
          Dinner: plan.Dinner ?? [],
          Snacks: plan.Snacks ?? [],
        },
      }));
    } else {
      console.log("🚫 No data found for", dateKey);
    }

    setLoadingDates((prev) => {
      const next = new Set(prev);
      next.delete(dateKey);
      return next;
    });
  };

  return (
    <PlanContext.Provider value={{ planData, addPlanFood, loadPlanForDate, loadingDates }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
