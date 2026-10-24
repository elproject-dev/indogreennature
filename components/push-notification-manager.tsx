"use client"

import { useEffect, useState } from 'react'
import { requestForToken, onMessageListener } from '@/lib/firebase'
import { toast } from 'sonner'

export function PushNotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {

      const setupPushNotifications = async () => {
        try {
          const token = await requestForToken();

          if (token) {
            // Send token to backend to subscribe to 'all_users' topic
            await fetch('/api/subscribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            });
            console.log("Successfully subscribed to notifications");
          }
        } catch (error) {
          console.error("Error setting up push notifications:", error);
        }
      };

      let promptTimer: NodeJS.Timeout | null = null;

      // Jika izin sudah diberikan, langsung daftarkan token tanpa menampilkan banner.
      // Jika belum (default), minta izin lewat tombol agar browser mau menampilkan popup.
      if (typeof Notification !== 'undefined') {
        if (Notification.permission === 'granted') {
          setupPushNotifications();
        } else if (
          Notification.permission === 'default' &&
          !sessionStorage.getItem('notif-prompt-dismissed')
        ) {
          // Beri jeda agar loading spinner selesai terlebih dahulu sebelum popup muncul
          promptTimer = setTimeout(() => {
            setShowPrompt(true);
          }, 3000);
        }
      }

      onMessageListener((payload: any) => {
        const title = payload?.notification?.title || 'Notifikasi Baru';
        const options = {
          body: payload?.notification?.body,
          icon: '/pwa-icon.png',
          badge: '/badge-icon.png'
        };

        // Mainkan suara custom saat aplikasi sedang terbuka
        try {
          const audio = new Audio('/notif.wav');
          // Browser kadang memblokir autoplay jika user belum berinteraksi dengan web
          audio.play().catch(e => console.log('Audio di-blokir oleh browser: ', e));
        } catch (error) {
          console.error("Gagal memutar suara:", error);
        }

        if (Notification.permission === 'granted') {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, options);
          });
        }

        // Selalu tampilkan toast di dalam web
        toast(title, {
          description: options.body,
          duration: 10000,
        });
      });

      return () => {
        if (promptTimer) clearTimeout(promptTimer);
      };
    }
  }, [])

  const handleEnable = async () => {
    setShowPrompt(false)
    try {
      const token = await requestForToken();
      if (token) {
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        toast.success('Notifikasi berhasil diaktifkan');
      }
    } catch (error) {
      console.error("Error enabling push notifications:", error);
    }
  }

  const handleDismiss = () => {
    sessionStorage.setItem('notif-prompt-dismissed', '1')
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm rounded-md border bg-background p-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
      <p className="text-sm font-semibold text-foreground">Aktifkan notifikasi?</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Dapatkan info promo terbaru dari CV. Indo Green Nature langsung di perangkat Anda.
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-sm px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
        >
          Nanti
        </button>
        <button
          type="button"
          onClick={handleEnable}
          className="rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
        >
          Aktifkan
        </button>
      </div>
    </div>
  )
}
