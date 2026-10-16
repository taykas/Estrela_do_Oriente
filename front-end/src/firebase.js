import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAf28nF58u8rsAdiX60tDIkoSJu-CykhLY",
  authDomain: "estrela-do-oriente-d5b88.firebaseapp.com",
  projectId: "estrela-do-oriente-d5b88",
  storageBucket: "estrela-do-oriente-d5b88.firebasestorage.app",
  messagingSenderId: "438771514018",
  appId: "1:438771514018:web:e9063dc03de1104b0075fb"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);