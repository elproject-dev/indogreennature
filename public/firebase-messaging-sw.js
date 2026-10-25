importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCax703AQhXCpdtiqkMXw05wXNPuq_rISc",
  authDomain: "indogreennature-21b50.firebaseapp.com",
  projectId: "indogreennature-21b50",
  storageBucket: "indogreennature-21b50.firebasestorage.app",
  messagingSenderId: "386750521297",
  appId: "1:386750521297:web:9c2535ea9db733ca718af0"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Jika payload sudah memiliki notification dari FCM, Firebase Web SDK sudah otomatis
  // menampilkannya di background. Jangan panggil showNotification lagi agar tidak muncul 2x/3x!
  if (payload.notification) {
    return;
  }

  const notificationTitle = payload.data?.title || "CV. Indo Green Nature";
  const notificationOptions = {
    body: payload.data?.body || "",
    icon: payload.data?.icon || '/pwa-icon.png',
    badge: '/badge-icon.png',
    image: payload.data?.image,
    vibrate: [200, 100, 200],
    tag: 'ign-broadcast',
    renotify: true,
    data: {
      url: payload.fcmOptions?.link || payload.data?.url || '/'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
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

