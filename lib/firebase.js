import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAM22GwaT3ULhHAdjJkNkMW38Bv-fjfTD0",
  authDomain: "vertex-9b601.firebaseapp.com",
  projectId: "vertex-9b601",
  storageBucket: "vertex-9b601.firebasestorage.app",
  messagingSenderId: "118714359866",
  appId: "1:118714359866:web:101e7a89f3e8ede1ca5503"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);