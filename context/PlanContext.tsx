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
  deletePlanFood: (dateKey: string, section: Section, index: number) => void;
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
  deletePlanFood: () => {},
  loadPlanForDate: async () => {},
  loadingDates: new Set(),
});

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [planData, setPlanData] = useState<PlanData>({});
  const [loadingDates, setLoadingDates] = useState<Set<string>>(new Set());
  const userUid = auth.currentUser?.uid || "";

  const addPlanFood = (dateKey: string, section: Section, item: Meal) => {
    setPlanData((prev) => {
      const dayMeals = prev[dateKey] ?? { ...defaultMeals };
      const updatedDay = {
        ...dayMeals,
        [section]: [...dayMeals[section], item],
      };

      if (userUid) {
        saveMealPlan(userUid, dateKey, section, updatedDay[section]);
      }

      return {
        ...prev,
        [dateKey]: updatedDay,
      };
    });
  };

  const deletePlanFood = (dateKey: string, section: Section, index: number) => {
    setPlanData((prev) => {
      const currentDay = prev[dateKey] ?? { ...defaultMeals };
      const updatedSectionMeals = [...currentDay[section]];
      updatedSectionMeals.splice(index, 1);

      const updatedDay = {
        ...currentDay,
        [section]: updatedSectionMeals,
      };

      const updatedPlanData = {
        ...prev,
        [dateKey]: updatedDay,
      };

      if (userUid) {
        saveMealPlan(userUid, dateKey, section, updatedSectionMeals);
      }

      return updatedPlanData;
    });
  };

  const loadPlanForDate = async (uid: string, dateKey: string) => {
    if (!uid || loadingDates.has(dateKey)) return;

    setLoadingDates((prev) => new Set(prev).add(dateKey));
    const plan = await getPlanForDate(uid, dateKey);

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
    }

    setLoadingDates((prev) => {
      const next = new Set(prev);
      next.delete(dateKey);
      return next;
    });
  };

  return (
    <PlanContext.Provider
      value={{ planData, addPlanFood, deletePlanFood, loadPlanForDate, loadingDates }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
