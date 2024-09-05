import { initializeApp } from "firebase/app";
import { getFirestore,updateDoc, collection, addDoc, getDocs,query, deleteDoc,where,doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3CQmgRlfypFiRvVL0GPiEHxtjo6FsQ7s",
    authDomain: "countdown-board.firebaseapp.com",
    projectId: "countdown-board",
    storageBucket: "countdown-board.appspot.com",
    messagingSenderId: "671636350936",
    appId: "1:671636350936:web:1445dc60d6a0ff62f334ad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth };
export { db,updateDoc, collection, addDoc, getDocs,query,deleteDoc, where,doc};
