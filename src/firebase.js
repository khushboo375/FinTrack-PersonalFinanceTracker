// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrIBW-h16Q8pcSdflW8NM4263O2_DWF34",
  authDomain: "personal-finance-tracker-f4110.firebaseapp.com",
  projectId: "personal-finance-tracker-f4110",
  storageBucket: "personal-finance-tracker-f4110.firebasestorage.app",
  messagingSenderId: "583014944764",
  appId: "1:583014944764:web:a98994e329a79169646c79",
  measurementId: "G-EW4RKM406G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };