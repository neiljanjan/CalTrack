// /services/firestore.ts
import { db } from '../config/firebase';
import { Meal } from '../context/MealsContext';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  DocumentData,
  Unsubscribe
} from 'firebase/firestore';

export async function createUserProfile(
  uid: string,
  data: { email: string; name?: string }
) {
  return setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function addMealEntry(
  uid: string,
  meal: Meal & { date: string }
) {
  const mealsCol = collection(db, 'users', uid, 'meals');
  return addDoc(mealsCol, {
    ...meal,
    createdAt: serverTimestamp()
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

// Save meal plan for a given date and section
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

// Fetch meal plan for a date
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
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("📄 Fetched Firestore doc:", data);
    return data;
  } else {
    console.log("🛑 No doc found for", dateKey);
    return null;
  }
};