import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyCZNXQmy6l0DXuqA4_2-ejvgeifkqNOqnY",
  authDomain: "kfc-project-1292f.firebaseapp.com",
  projectId: "kfc-project-1292f",
  storageBucket: "kfc-project-1292f.appspot.com",
  messagingSenderId: "107513396962",
  appId: "1:107513396962:web:a945189d9c69fbb1eb68bb",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore(app);
export default app;
