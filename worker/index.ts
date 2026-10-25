// @ts-nocheck


importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// We don't have process.env here, but these are safe public keys
const firebaseConfig = {
  apiKey: "AIzaSyCax703AQhXCpdtiqkMXw05wXNPuq_rISc",
  authDomain: "indogreennature-21b50.firebaseapp.com",
  projectId: "indogreennature-21b50",
  storageBucket: "indogreennature-21b50.firebasestorage.app",
  messagingSenderId: "386750521297",
  appId: "1:386750521297:web:9c2535ea9db733ca718af0"
};

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Firebase SDK will automatically handle background messages that contain a 'notification' payload.
