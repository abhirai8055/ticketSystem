import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getEnv } from "@/lib/utils";

const firebaseConfig = {
  appId: '1:437108787604:android:ca4d12a7feb455a41a2781',
  authDomain: 'signal-clone-96920.firebaseapp.com',
  apiKey: 'AIzaSyDuDs9h2RTORdlBqvu8hLToBV_iKM3I28M',
  projectId: 'signal-clone-96920',
  storageBucket: 'signal-clone-96920.appspot.app',
  messagingSenderId: '437108787604',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const app2 = initializeApp(firebaseConfig, 'smu-management');

export const auth2 = getAuth(app2);

export { auth, db };
export default app;

