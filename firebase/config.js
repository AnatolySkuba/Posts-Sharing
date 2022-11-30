import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence,
} from "firebase/auth/react-native";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/storage";
// import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDKpMBWtErJGlqhZtVFP-BorAR8AFMBYow",
    authDomain: "practice-7ded1.firebaseapp.com",
    projectId: "practice-7ded1",
    storageBucket: "practice-7ded1.appspot.com",
    messagingSenderId: "561757912271",
    appId: "1:561757912271:web:3f9d1ff313c3a068ba8bba",
    measurementId: "G-4PLEWVQ4M6",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// initialize firebase app
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// initialize auth
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, app, firebase, db };
