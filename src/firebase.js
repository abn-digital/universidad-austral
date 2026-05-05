import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            'AIzaSyAHBf6z6TRhBpqPm2to073VtiHJ7ZyXGv4',
  authDomain:        'hike-agentic-playground.firebaseapp.com',
  projectId:         'hike-agentic-playground',
  storageBucket:     'hike-agentic-playground.firebasestorage.app',
  messagingSenderId: '966549276703',
  appId:             '1:966549276703:web:d2dc8113a69d14dc62ed2a',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
