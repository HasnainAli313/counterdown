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
















// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyD3CQmgRlfypFiRvVL0GPiEHxtjo6FsQ7s",
//   authDomain: "countdown-board.firebaseapp.com",
//   projectId: "countdown-board",
//   storageBucket: "countdown-board.appspot.com",
//   messagingSenderId: "671636350936",
//   appId: "1:671636350936:web:1445dc60d6a0ff62f334ad"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// export { auth };























// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getDatabase } from 'firebase/database';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyD3CQmgRlfypFiRvVL0GPiEHxtjo6FsQ7s",
//   authDomain: "countdown-board.firebaseapp.com",
//   projectId: "countdown-board",
//   storageBucket: "countdown-board.appspot.com",
//   messagingSenderId: "671636350936",
//   appId: "1:671636350936:web:1445dc60d6a0ff62f334ad"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const database = getDatabase(app);

// export {auth};