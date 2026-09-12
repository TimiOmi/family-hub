self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title || "Family Hub", {
      body: data.body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: data.todoId ? `todo-${data.todoId}` : undefined,
      data: { todoId: data.todoId, url: data.url || "/" },
      actions: [
        { action: "done", title: "Doing it now" },
        { action: "snooze", title: "Push it" },
      ],
      requireInteraction: true,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const { todoId, url } = event.notification.data || {};

  event.waitUntil(
    (async () => {
      if (event.action === "done" && todoId) {
        try {
          await fetch(`/api/todos/${todoId}/done`, { method: "POST" });
        } catch {
          // fall through to opening the app so the user can retry
        }
      }

      const targetUrl =
        event.action === "snooze" && todoId ? `/todos/${todoId}/snooze` : url || "/";

      const clientsList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of clientsList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })()
  );
});
