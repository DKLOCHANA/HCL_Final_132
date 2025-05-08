// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvvdJGNUk-RgyWs0dMWVu9xCB_CZ3Wh8Y",
  authDomain: "furniture-48e45.firebaseapp.com",
  projectId: "furniture-48e45",
  storageBucket: "furniture-48e45.firebasestorage.app",
  messagingSenderId: "247144462761",
  appId: "1:247144462761:web:6620f3492f99810459acb8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail };