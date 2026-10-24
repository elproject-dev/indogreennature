importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAQXytrS1GWv3g53VoeE6cqOUzcLepzOZI",
  authDomain: "maga-swalayan-bf6c5.firebaseapp.com",
  projectId: "maga-swalayan-bf6c5",
  storageBucket: "maga-swalayan-bf6c5.firebasestorage.app",
  messagingSenderId: "874122742029",
  appId: "1:874122742029:web:9e982937ec315922274844"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || "Notifikasi Baru";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: '/pwa-icon.png',
    badge: '/badge-icon.png',
    data: {
      url: payload.fcmOptions?.link || '/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
