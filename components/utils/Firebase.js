import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDLBHWveyiXv0hcHF-2vSwnBCt_xtPbugM",
  authDomain: "cuido-dabase.firebaseapp.com",
  projectId: "cuido-dabase",
  storageBucket: "cuido-dabase.appspot.com",
  messagingSenderId: "986004045604",
  appId: "1:986004045604:web:4a3b55b5aee334baa0fdb1",
  measurementId: "G-PL3JVWK60H"
};

// Initialize Firebase
 initializeApp(firebaseConfig);

 export const database = getFirestore();
 export const storage = getStorage();