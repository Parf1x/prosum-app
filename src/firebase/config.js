// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Если будете использовать

const firebaseConfig = {
  apiKey: "AIzaSyAnrL5Fg2je-rq8sHNDJSh8hBC76LGuLwc",
  authDomain: "prosum-8d2f8.firebaseapp.com",
  projectId: "prosum-8d2f8",
  storageBucket: "prosum-8d2f8.firebasestorage.app", // Используем ваше значение
  messagingSenderId: "667504405777",
  appId: "1:667504405777:web:661363e2d22405b73270b0",
  measurementId: "G-03EPZWRSYT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
// export const analytics = getAnalytics(app); // Если будете использовать