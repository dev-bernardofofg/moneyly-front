/**
 * Service worker do Firebase Cloud Messaging.
 *
 * Arquivo estático: não passa pelo build do Next e não enxerga process.env —
 * a config chega por query string no register() (ver (utils)/firebase.ts).
 * Usa o SDK compat porque service worker não aceita ESM via importScripts.
 */
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js');

const params = new URL(self.location.href).searchParams;

firebase.initializeApp({
  apiKey: params.get('apiKey'),
  projectId: params.get('projectId'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
});

const messaging = firebase.messaging();

// O backend envia payload data-only de propósito: com o bloco `notification`
// o browser exibiria sozinho e o handler abaixo exibiria de novo (duplicata).
messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};

  self.registration.showNotification(data.title || 'Moneyly', {
    body: data.body || '',
    // O back manda o ícone por tipo (entrada/saída); o do PWA é o fallback.
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/icon-192x192.png',
    // tag evita empilhar a mesma notificação se o push chegar duplicado
    tag: data.notificationId || undefined,
    data: { url: data.url || '/' },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const target = new URL(event.notification.data?.url || '/', self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se o app já está aberto, navega a aba existente em vez de abrir outra.
      const existing = clientList.find((client) => client.url.startsWith(self.location.origin));

      if (existing) {
        return existing.focus().then((client) => client.navigate(target));
      }

      return self.clients.openWindow(target);
    })
  );
});
