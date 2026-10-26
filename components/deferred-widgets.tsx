"use client";

import dynamic from "next/dynamic";

// Firebase Messaging cukup berat; dimuat sebagai chunk terpisah setelah hydration (tanpa SSR)
// sehingga tidak masuk bundle awal dan tidak menambah Total Blocking Time.
const PushNotificationManager = dynamic(
  () => import("@/components/push-notification-manager").then((m) => m.PushNotificationManager),
  { ssr: false }
);

export function DeferredPushNotificationManager() {
  return <PushNotificationManager />;
}
