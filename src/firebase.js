// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

// Export Firestore database
export const db = getFirestore(app);
