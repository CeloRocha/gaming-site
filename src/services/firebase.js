import firebase from 'firebase/compat/app';

import 'firebase/compat/auth'
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const {initializeApp} = firebase;
 
const firebaseConfig = {

    apiKey: process.env.REACT_APP_API_KEY,

    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  
    databaseURL: process.env.REACT_APP_DATABASE_URL,
  
    projectId: process.env.REACT_APP_PROJECT_ID,
  
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  
    appId: process.env.REACT_APP_APP_ID
  
};
  
  
  // Initialize Firebase
  
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);