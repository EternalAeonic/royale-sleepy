import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDvXGYheohvAUQoVD855gG4fcZccq8ZVms",
  authDomain: "royale-sleepy-5d744.firebaseapp.com",
  projectId: "royale-sleepy-5d744",
  storageBucket: "royale-sleepy-5d744.firebasestorage.app",
  messagingSenderId: "279325542395",
  appId: "1:279325542395:web:b8f921856cbb2bdc3d6d5e",
  measurementId: "G-1C5L6ZJZ1K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
