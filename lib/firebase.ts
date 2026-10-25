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
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return null;
    }

    // Pastikan izin sudah granted sebelum memproses token
    if (Notification.permission !== 'granted') {
      return null;
    }

    const supported = await isSupported();
    if (!supported) {
      console.log("Firebase Messaging is not supported in this browser.");
      return null;
    }
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.warn("Firebase config is missing (apiKey or projectId). Push notifications will be disabled.");
      return null;
    }

    // Pastikan service worker firebase-messaging-sw.js terdaftar
    let registration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      try {
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      } catch (err) {
        console.warn('Service worker register warning:', err);
      }
      try {
        registration = await navigator.serviceWorker.ready;
      } catch (err) {
        console.warn('Service worker ready warning:', err);
      }
    }

    const messaging = getMessaging(app);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    const tokenOptions: { serviceWorkerRegistration?: ServiceWorkerRegistration; vapidKey?: string } = {};
    if (registration) {
      tokenOptions.serviceWorkerRegistration = registration;
    }
    if (vapidKey) {
      tokenOptions.vapidKey = vapidKey;
    }

    const currentToken = await getToken(messaging, tokenOptions);
    if (currentToken) {
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error) {
    console.warn('An error occurred while retrieving token: ', error);
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
