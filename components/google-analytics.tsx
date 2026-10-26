"use client";

import { useEffect } from "react";

interface GoogleAnalyticsProps {
  gaId?: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (!gaId || process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;

    const win = window as any;
    win.dataLayer = win.dataLayer || [];
    function gtag(...args: any[]) {
      win.dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", gaId);

    let loaded = false;
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll", "touchstart"];

    const loadScript = () => {
      if (loaded) return;
      loaded = true;
      events.forEach((e) => window.removeEventListener(e, loadScript));

      const scriptId = "_ga_script_safe";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);
      }
    };

    // Performa (TBT): script GTM dimuat setelah halaman idle atau saat interaksi pertama,
    // bukan saat render awal. dataLayer di atas tetap menampung event sampai script siap.
    events.forEach((e) => window.addEventListener(e, loadScript, { once: true, passive: true }));
    const timer = window.setTimeout(loadScript, 4000);

    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, loadScript));
    };
  }, [gaId]);

  return null;
}
