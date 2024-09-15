import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_measurementId
};
console.log(firebaseConfig,"name") 
// const firebaseApp =
//   getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

//   export const firebaseAuth = getAuth(firebaseApp);

const firebaseApp = initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

export {firebaseApp,  firebaseAuth}

// export const firebaseAuth = getAuth(firebaseApp);
// export const firebaseDb = getFirestore(firebaseApp);
