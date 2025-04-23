import React, { createContext, useContext, useState, ReactNode } from "react";
import { Meal, Section } from "./MealsContext";
import { getPlanForDate } from "@/services/firestore";

export type MealsByType = Record<Section, Meal[]>;
export type PlanData = Record<string, MealsByType>;

interface PlanContextType {
  planData: PlanData;
  addPlanFood: (dateKey: string, section: Section, item: Meal) => void;
  loadPlanForDate: (uid: string, dateKey: string) => Promise<void>;
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
});

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [planData, setPlanData] = useState<PlanData>({});

  const addPlanFood = (dateKey: string, section: Section, item: Meal) => {
    setPlanData((prev) => {
      const dayMeals = prev[dateKey] ?? { ...defaultMeals };
      return {
        ...prev,
        [dateKey]: {
          ...dayMeals,
          [section]: [...dayMeals[section], item],
        },
      };
    });
  };

  const loadPlanForDate = async (uid: string, dateKey: string) => {
    console.log("📦 Loading meal plan for:", uid, dateKey);
    const plan = await getPlanForDate(uid, dateKey);
    console.log("🧾 Retrieved plan from Firestore:", plan);
  
    if (plan) {
      setPlanData((prev) => {
        const updated = {
          ...prev,
          [dateKey]: {
            Breakfast: plan.Breakfast ?? [],
            Lunch: plan.Lunch ?? [],
            Dinner: plan.Dinner ?? [],
            Snacks: plan.Snacks ?? [],
          },
        };
        console.log("✅ Updating planData with:", updated);
        return updated;
      });
    } else {
      console.log("🚫 No data found for", dateKey);
    }
  };
  

  return (
    <PlanContext.Provider value={{ planData, addPlanFood, loadPlanForDate }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
