import webpush from "web-push";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  configured = true;
}

export type StoredSubscription = {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function sendPushNotification(
  sub: StoredSubscription,
  payload: Record<string, unknown>
): Promise<{ ok: true } | { ok: false; expired: boolean }> {
  ensureConfigured();
  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      },
      JSON.stringify(payload)
    );
    return { ok: true };
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode;
    const expired = statusCode === 404 || statusCode === 410;
    return { ok: false, expired };
  }
}
