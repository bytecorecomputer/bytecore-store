import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCw3b7ApkFJHXaDrJn4KJ28wsJTlXIS_rY",
    authDomain: "bytecore-computer-centre.firebaseapp.com",
    projectId: "bytecore-computer-centre",
    storageBucket: "bytecore-computer-centre.firebasestorage.app",
    messagingSenderId: "508379331210",
    appId: "1:508379331210:web:2b63919918b2af36f1cb73",
    measurementId: "G-76X8QDEBHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Analytics removed to fix build error

// Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
