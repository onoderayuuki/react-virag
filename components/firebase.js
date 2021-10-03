import firebase from "firebase";
import "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: "AIzaSyA9YS-8VeXyZhvCob4-z5IhT1rUYOXXWIM",
    authDomain: "virag-d7f0f.firebaseapp.com",
    projectId: "virag-d7f0f",
    storageBucket: "virag-d7f0f.appspot.com",
  });
}

export default firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();