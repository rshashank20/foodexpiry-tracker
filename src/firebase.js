// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCvVscaYokqpvUUnPBiodJzVYX9dL0RUrU",
  authDomain: "foodexpiry-tracker.firebaseapp.com",
  projectId: "foodexpiry-tracker",
  storageBucket: "foodexpiry-tracker.firebasestorage.app",
  messagingSenderId: "581182120909",
  appId: "1:581182120909:web:77ac0fcd860d25b0919a84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore database, auth, and app instance
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { app };
