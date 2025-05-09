// /services/firestore.ts

import { db } from '../config/firebase';
import { Meal } from '../context/MealsContext';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  DocumentData,
  Unsubscribe,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

export async function createUserProfile(
  uid: string,
  data: { email: string; name?: string }
) {
  return setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function addMealEntry(
  uid: string,
  meal: Meal & { date: string }
) {
  const mealsCol = collection(db, 'users', uid, 'meals');
  return addDoc(mealsCol, {
    ...meal,
    createdAt: serverTimestamp(),
  });
}

export function listenToMeals(
  uid: string,
  callback: (meals: DocumentData[]) => void
): Unsubscribe {
  const mealsCol = collection(db, 'users', uid, 'meals');
  const mealsQuery = query(mealsCol, orderBy('createdAt', 'desc'));
  return onSnapshot(mealsQuery, snapshot => {
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(docs);
  });
}

export async function saveMealPlan(
  uid: string,
  date: string,
  section: string,
  meals: Meal[]
) {
  const planDoc = doc(db, 'users', uid, 'mealPlans', date);
  return setDoc(planDoc, {
    [section]: meals,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function fetchMealPlanForDate(
  uid: string,
  date: string
): Promise<Record<string, Meal[]>> {
  const docRef = doc(db, 'users', uid, 'mealPlans', date);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as Record<string, Meal[]>) : {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  };
}

export const getPlanForDate = async (uid: string, dateKey: string) => {
  const docRef = doc(db, 'users', uid, 'mealPlans', dateKey);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export async function getMealStatsByDateRange(
  uid: string,
  start: Date,
  end: Date
): Promise<Record<string, Meal[]>> {
  const mealsCol = collection(db, 'users', uid, 'meals');
  const mealsQuery = query(mealsCol, orderBy('createdAt'));
  const snapshot = await getDocs(mealsQuery);

  const meals = snapshot.docs
    .map(d => ({ id: d.id, ...d.data() as Meal }))
    .filter(m => {
      const date = new Date(m.date);
      return date >= start && date <= end;
    });

  const grouped: Record<string, Meal[]> = {};
  meals.forEach(m => {
    const dateKey = new Date(m.date).toDateString();
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(m);
  });

  return grouped;
}

export async function getWeightEntries(
  uid: string,
  start: Date,
  end: Date
): Promise<{ date: string; weight: number }[]> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return [];

  const data = snap.data();
  const history = data.weightHistory ?? [];

  return history
    .map((entry: any) => ({
      date: entry.date,
      weight: entry.weight,
    }))
    .filter((entry: { date: string }) => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });
}

export async function addWeightEntry(uid: string, weight: number) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  const existingHistory = snap.exists() && snap.data().weightHistory
    ? snap.data().weightHistory
    : [];

  const today = new Date().toISOString().split('T')[0]; // e.g. "2025-04-28"

  const updated = [
    ...existingHistory,
    { date: today, weight }
  ];

  await updateDoc(ref, { weightHistory: updated });
}

export async function deleteMealEntry(uid: string, mealId: string) {
  const mealRef = doc(db, 'users', uid, 'meals', mealId);
  await deleteDoc(mealRef);
}