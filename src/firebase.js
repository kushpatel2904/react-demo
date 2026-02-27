// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ ADD THIS
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDC5QJjPGDAhUXzVO6GzzqLWrfgaT8JuOA",
  authDomain: "online-clothes-b4eb0.firebaseapp.com",
  databaseURL: "https://online-clothes-b4eb0-default-rtdb.firebaseio.com",
  projectId: "online-clothes-b4eb0",
  storageBucket: "online-clothes-b4eb0.appspot.com", // ⚠️ FIXED
  messagingSenderId: "797460559479",
  appId: "1:797460559479:web:d875686dc6d4f5ac397872",
  measurementId: "G-G8PQY40SRK"
};

const app = initializeApp(firebaseConfig);

// Firestore (already working)
export const db = getFirestore(app);

// Storage (NEW but same project)
export const storage = getStorage(app);
export const auth = getAuth(app);

