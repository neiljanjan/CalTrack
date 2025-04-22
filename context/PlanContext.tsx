import React, { createContext, useContext, useState, ReactNode } from "react";
import { Meal, Section } from "./MealsContext";

export type MealsByType = Record<Section, Meal[]>;
export type PlanData = Record<string, MealsByType>;

export interface PlanContextType {
  planData: PlanData;
  addPlanFood: (dateKey: string, section: Section, item: Meal) => void;
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

  return (
    <PlanContext.Provider value={{ planData, addPlanFood }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
