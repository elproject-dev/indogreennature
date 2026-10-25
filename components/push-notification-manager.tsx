"use client"

import { useEffect, useState } from 'react'
import { requestForToken, onMessageListener } from '@/lib/firebase'
import { toast } from 'sonner'
import { Bell, Loader2 } from 'lucide-react'

export function PushNotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isActivating, setIsActivating] = useState(false)

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

      // Event listener kustom untuk memicu popup notifikasi secara manual dari mana saja
      const handleCustomOpen = () => {
        setShowPrompt(true);
      };
      window.addEventListener('open-notification-prompt', handleCustomOpen);

      // Jika izin sudah diberikan, langsung daftarkan token tanpa menampilkan banner.
      // Jika belum (default), minta izin lewat tombol agar browser mau menampilkan popup.
      if (typeof Notification !== 'undefined') {
        if (Notification.permission === 'granted') {
          setupPushNotifications();
        } else if (
          Notification.permission === 'default' &&
          !sessionStorage.getItem('notif-prompt-dismissed')
        ) {
          // Beri jeda agar loading selesai terlebih dahulu sebelum popup muncul
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
        window.removeEventListener('open-notification-prompt', handleCustomOpen);
      };
    }
  }, [])

  const handleEnable = async () => {
    // 1. Validasi ketersediaan Notification API pada browser / Android PWA
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Browser atau perangkat ini belum mendukung notifikasi web.');
      setShowPrompt(false);
      return;
    }

    // 2. Jika izin sudah diblokir sebelumnya oleh pengguna di pengaturan Android/Chrome
    if (Notification.permission === 'denied') {
      toast.error(
        'Izin notifikasi diblokir di Android. Buka Pengaturan Situs / Izin Aplikasi untuk mengaktifkannya.',
        { duration: 6000 }
      );
      setShowPrompt(false);
      sessionStorage.setItem('notif-prompt-dismissed', '1');
      return;
    }

    setIsActivating(true);

    try {
      // 3. PENTING UNTUK ANDROID: Panggil Notification.requestPermission() LANGSUNG
      // di dalam event handler klik pengguna (User Gesture context).
      // Jangan gunakan async delay sebelum ini agar Chrome Android tidak membatalkan User Activation.
      let permission: NotificationPermission = Notification.permission;
      if (permission !== 'granted') {
        const req = Notification.requestPermission();
        if (req && typeof (req as any).then === 'function') {
          permission = await req;
        } else {
          permission = await new Promise<NotificationPermission>((resolve) => {
            Notification.requestPermission(resolve);
          });
        }
      }

      if (permission === 'granted') {
        toast.success('Notifikasi sistem berhasil diaktifkan!');
        setShowPrompt(false);

        // 4. Daftarkan Service Worker dan dapatkan Token FCM di background
        try {
          const token = await requestForToken();
          if (token) {
            await fetch('/api/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            });
            console.log("Successfully subscribed to notifications with token");
          }
        } catch (fcmErr) {
          console.warn("FCM background token registration warning:", fcmErr);
        }
      } else if (permission === 'denied') {
        toast.error(
          'Izin notifikasi ditolak. Anda dapat mengaktifkannya kapan saja di Pengaturan Android.',
          { duration: 6000 }
        );
        setShowPrompt(false);
        sessionStorage.setItem('notif-prompt-dismissed', '1');
      } else {
        // User menutup popup sistem tanpa memilih ('default')
        setShowPrompt(false);
      }
    } catch (error) {
      console.error("Error enabling push notifications on Android:", error);
      toast.error('Gagal meminta izin notifikasi sistem.');
      setShowPrompt(false);
    } finally {
      setIsActivating(false);
    }
  }

  const handleDismiss = () => {
    sessionStorage.setItem('notif-prompt-dismissed', '1')
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm rounded-lg border border-border bg-card/95 backdrop-blur-md p-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
          <Bell className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">Aktifkan Notifikasi?</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Dapatkan info promo, artikel herbal, dan pemberitahuan penting CV. Indo Green Nature langsung di perangkat Anda.
          </p>
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isActivating}
              onClick={handleDismiss}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
            >
              Nanti
            </button>
            <button
              type="button"
              disabled={isActivating}
              onClick={handleEnable}
              className="rounded-md bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isActivating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Aktifkan</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
