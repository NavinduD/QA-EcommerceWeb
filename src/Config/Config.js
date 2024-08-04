import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, getDoc,getDocs, collection, onSnapshot,setDoc,doc, deleteDoc } from "firebase/firestore";
import { getStorage,ref } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD4ZhPSvdbuWYT4aaww2PFUfWLCpZ8pkns",
    authDomain: "ecommerceqa-e5fa7.firebaseapp.com",
    projectId: "ecommerceqa-e5fa7",
    storageBucket: "ecommerceqa-e5fa7.appspot.com",
    messagingSenderId: "129478023090",
    appId: "1:129478023090:web:b8f7b54bbf05c5359636ab",
    measurementId: "G-ZVCYM9TV4E"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app, "gs://ecommerceqa-e5fa7.appspot.com");

export { auth, db, storage, ref, setDoc, getDoc, getDocs, collection, onSnapshot,doc, deleteDoc, createUserWithEmailAndPassword, signInWithEmailAndPassword }