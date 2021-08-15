import firebase from "firebase";
import "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
// .envに書いたファイルを参照している
// const firebaseApp = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
//   authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// });
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA9YS-8VeXyZhvCob4-z5IhT1rUYOXXWIM",
  authDomain: "virag-d7f0f.firebaseapp.com",
  databaseURL: "https://virag-d7f0f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "virag-d7f0f",
  storageBucket: "virag-d7f0f.appspot.com",
  messagingSenderId: "144265120378",
  appId: "1:144265120378:web:981320d00e2acfb75709c3",
  measurementId: "G-28XMS355EN"
});

export const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

