import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAM036QX0TsLeSAmM45mjcTG1P5YuKZAzY",
  authDomain: "shuki-app.firebaseapp.com",
  projectId: "shuki-app",
  storageBucket: "shuki-app.firebasestorage.app",
  messagingSenderId: "371079686884",
  appId: "1:371079686884:web:696d96d51e2fb6ef061af1",
  measurementId: "G-Q7L47DHVWZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
