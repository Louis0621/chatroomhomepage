//import React from 'react'
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkw7IbVc_AVLBaASut8JGGJJG6Mheb1Dc",
  authDomain: "homepage-a63c0.firebaseapp.com",
  projectId: "homepage-a63c0",
  storageBucket: "homepage-a63c0.appspot.com",
  messagingSenderId: "283426488624",
  appId: "1:283426488624:web:db2e4a83dfa37c459cc8f5",
  measurementId: "G-ELC5QY8ZML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
