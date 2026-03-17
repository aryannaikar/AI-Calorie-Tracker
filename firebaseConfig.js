// firebaseConfig.js

import { getReactNativePersistence } from "@firebase/auth/react-native";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXVz13vbiJifo-NwEw-d98A-Mtwz4bWMc",
  authDomain: "foodapp-e3c92.firebaseapp.com",
  projectId: "foodapp-e3c92",
  storageBucket: "foodapp-e3c92.firebasestorage.app",
  messagingSenderId: "76468980241",
  appId: "1:76468980241:web:41325180c2e41047497fb0"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);
