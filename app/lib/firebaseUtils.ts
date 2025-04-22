import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Save the full user profile to Firestore
export const setUserProfile = async (uid: string, profile: any) => {
  try {
    await setDoc(doc(db, 'users', uid), profile, { merge: true });
    console.log('User profile saved!');
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};
