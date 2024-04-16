// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgE2s_0hGn2Nn11oPcLtVSfnxDyEdfg1o",
  authDomain: "retreasure-8df2c.firebaseapp.com",
  projectId: "retreasure-8df2c",
  storageBucket: "retreasure-8df2c.appspot.com",
  messagingSenderId: "955016832347",
  appId: "1:955016832347:web:8d622c17a30fdaec50667e",
  measurementId: "G-HVY551NQNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const roomRef = collection(db, 'rooms');