import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOVzmhoEuEbEr8JBNPLW76b5yJ_CZJTr0",
  authDomain: "usa2026-ace4d.firebaseapp.com",
  projectId: "usa2026-ace4d",
  storageBucket: "usa2026-ace4d.appspot.com",
  messagingSenderId: "520122172540",
  appId: "1:520122172540:web:c4a7b3d3d849e57ff435f9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app);

export const createUser = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password)
export const loginUser = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password)
