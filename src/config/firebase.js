import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Check if demo mode is enabled
const isDemoMode = process.env.REACT_APP_USE_DEMO_MODE === 'true';

// Firebase configuration
const firebaseConfig = isDemoMode ? {
  // Demo configuration - uses localStorage for data
  apiKey: process.env.REACT_APP_DEMO_API_KEY || 'demo-key',
  authDomain: process.env.REACT_APP_DEMO_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.REACT_APP_DEMO_PROJECT_ID || 'demo-project',
  storageBucket: process.env.REACT_APP_DEMO_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.REACT_APP_DEMO_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.REACT_APP_DEMO_APP_ID || 'demo-app-id'
} : {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Validate environment variables only if not in demo mode
if (!isDemoMode && (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || 
    !firebaseConfig.storageBucket || !firebaseConfig.messagingSenderId || !firebaseConfig.appId)) {
  throw new Error('Missing required Firebase environment variables. Please check your .env file or enable demo mode.');
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATORS === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firebase emulators connection failed:', error.message);
    }
  }
}

export default app;