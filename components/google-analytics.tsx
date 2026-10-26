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

    const scriptId = "_ga_script_safe";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);
    }
  }, [gaId]);

  return null;
}
