// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDbxOg-vYPm8vU3InUG3ZR-uaS-kMUETa8",
    authDomain: "e-commerce-app-3c455.firebaseapp.com",
    databaseURL: "https://e-commerce-app-3c455-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "e-commerce-app-3c455",
    storageBucket: "e-commerce-app-3c455.appspot.com",
    messagingSenderId: "714031355581",
    appId: "1:714031355581:web:04bc29c53f2544f7f249d4",
};

const secondaryApp = initializeApp(firebaseConfig, "Secondary")
export const secondaryAuth = getAuth(secondaryApp)
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const database = getDatabase(app)
export const storage = getStorage(app)
