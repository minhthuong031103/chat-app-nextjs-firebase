// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCaAX_wJ8NYIFO5OKj0JGsWfOzdEoT1_zk',
  authDomain: 'chat-app-b2988.firebaseapp.com',
  projectId: 'chat-app-b2988',
  storageBucket: 'chat-app-b2988.appspot.com',
  messagingSenderId: '761344685514',
  appId: '1:761344685514:web:cb288033895f78486b0b33',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
