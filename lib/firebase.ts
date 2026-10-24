import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const requestForToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.log("Firebase Messaging is not supported in this browser.");
      return null;
    }
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.warn("Firebase config is missing (apiKey or projectId). Push notifications will be disabled.");
      return null;
    }

    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Register the firebase-messaging-sw.js
      try {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      } catch (err) {
        console.error('Service Worker registration failed:', err);
        return null;
      }

      // Tunggu sampai Service Worker benar-benar aktif sebelum meminta token
      const registration = await navigator.serviceWorker.ready;

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        // VAPID key opsional: jika tidak disetel, return null tanpa mencemari console
        return null;
      }

      const currentToken = await getToken(messaging, {
        serviceWorkerRegistration: registration,
        vapidKey,
      });
      if (currentToken) {
        return currentToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
        return null;
      }
    } else {
      console.log('Notification permission denied.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
    return null;
  }
};

export const onMessageListener = (callback: (payload: any) => void) => {
  isSupported().then((supported) => {
    if (supported && firebaseConfig.projectId && firebaseConfig.apiKey) {
      try {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
          callback(payload);
        });
      } catch (e) {
        console.warn("Failed to initialize Firebase Messaging:", e);
      }
    }
  });
};

export const storage = getStorage(app);
export { app };
