
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBeIrcl55DRuIWoMTwAzh_7SmTyCe9rTQ",
  authDomain: "bsbproject-775f9.firebaseapp.com",
  projectId: "bsbproject-775f9",
  storageBucket: "bsbproject-775f9.firebasestorage.app",
  messagingSenderId: "961548331165",
  appId: "1:961548331165:web:8f788c007fc3c90a370c74"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const gprovider = new GoogleAuthProvider();
export const db = getFirestore(app);