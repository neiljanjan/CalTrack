// app/services/firestore.ts
import { db } from '../config/firebase';
import { Meal } from '../context/MealsContext';
import {
  collection,
  doc,
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
