import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_measurementId,
};
console.log(firebaseConfig, "name");
// const firebaseApp =
//   getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

//   export const firebaseAuth = getAuth(firebaseApp);

const firebaseApp = initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

export { firebaseApp, firebaseAuth };

// export const firebaseAuth = getAuth(firebaseApp);
// export const firebaseDb = getFirestore(firebaseApp);
