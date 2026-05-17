import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCOQ9BVmq6fdtqz7p6pJiiZvXS4kVYKiqQ',
  authDomain: 'dairy-stock-tracker.firebaseapp.com',
  projectId: 'dairy-stock-tracker',
  storageBucket: 'dairy-stock-tracker.firebasestorage.app',
  messagingSenderId: '332526681528',
  appId: '1:332526681528:web:a3819641242bb36769a34d',
  measurementId: 'G-3VGTVPN2TC',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
