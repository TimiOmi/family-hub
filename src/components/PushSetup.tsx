"use client";

import { useEffect, useState } from "react";
import { usePerson } from "@/lib/person-context";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type Status = "checking" | "prompt" | "asking" | "on" | "denied" | "unsupported";

export function PushSetup() {
  const { personId } = usePerson();
  const [status, setStatus] = useState<Status>(() => {
    if (typeof window === "undefined") return "checking";
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return "unsupported";
    }
    if (Notification.permission === "denied") return "denied";
    if (Notification.permission === "default") return "prompt";
    return "checking";
  });

  useEffect(() => {
    if (!personId || status !== "checking") return;
    navigator.serviceWorker.register("/sw.js").catch(() => setStatus("unsupported"));

    if (Notification.permission === "granted") {
      subscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personId, status]);

  async function subscribe() {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        setStatus("unsupported");
        return;
      }
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
    }
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId, subscription: subscription.toJSON() }),
    });
    setStatus("on");
  }

  async function requestPermission() {
    setStatus("asking");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await navigator.serviceWorker.register("/sw.js").catch(() => setStatus("unsupported"));
      await subscribe();
    } else {
      setStatus("denied");
    }
  }

  if (status === "on" || status === "checking") return null;

  if (status === "unsupported") {
    return (
      <p className="mx-auto max-w-md rounded-lg bg-amber-100 p-3 text-xs text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
        This browser can&apos;t receive push alerts. On iPhone, add this app to your Home Screen
        first (Share → Add to Home Screen), then open it from there.
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className="mx-auto max-w-md rounded-lg bg-amber-100 p-3 text-xs text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
        Notifications are blocked for this app. Enable them in your browser/site settings to get
        reminder alerts.
      </p>
    );
  }

  return (
    <button
      onClick={requestPermission}
      disabled={status === "asking"}
      className="mx-auto block rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600 active:scale-[0.98] disabled:opacity-60"
    >
      🔔 Turn on reminder alerts
    </button>
  );
}
