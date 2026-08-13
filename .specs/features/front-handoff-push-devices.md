# Tarefa: registrar device para push (FCM) no Moneyly

O backend já envia push, mas o log está: `[push] skip — nenhum device registrado para o usuário`. O front precisa registrar o dispositivo. Sem esse POST, push in-app nunca chega.

## Contexto

- Back: PERN (`moneyly-back`), Firebase Admin no mesmo projeto Firebase do front.
- Push é web (FCM JS SDK). O back guarda **Firebase Installation ID (FID)**, não o registration token antigo.
- `getToken()` está **deprecado**. Usar `register()` + `onRegistered()` de `firebase/messaging`.
- Payload do back é **data-only** (sem bloco `notification`). O service worker monta a notificação em `onBackgroundMessage`. Se o SW também tratar `notification` do FCM, a notificação duplica.

## Contrato da API (já existe)

Auth: `Authorization: Bearer <access_token>` em todas as rotas abaixo. Sem token → 401.

### Registrar (upsert)

`POST /notifications/devices`

Body:

```json
{ "fid": "<Firebase Installation ID>" }
```

- `fid`: string, 8–512 chars.
- `User-Agent` o back lê do header; não enviar no body.
- Mesmo FID em outro usuário transfere o registro (unique no banco).
- Chamar sempre que o SDK emitir/renovar o FID (login + rotações).

Resposta 200:

```json
{
  "data": { "registered": true },
  "message": "Dispositivo registrado para notificações"
}
```

### Remover

`DELETE /notifications/devices/:fid`

- Logout ou usuário desativando push.
- Idempotente (FID inexistente não é erro).

Resposta 200:

```json
{
  "data": { "unregistered": true },
  "message": "Dispositivo removido das notificações"
}
```

## Payload que o SW recebe (data-only)

Todos os valores são **string**:

| campo            | exemplo                         | obrigatório                         |
| ---------------- | ------------------------------- | ----------------------------------- |
| `title`          | `Conta a vencer: Netflix`       | sim                                 |
| `body`           | `Netflix de R$ 55,90 vence...`  | sim                                 |
| `url`            | `/` ou rota do app              | sim (default `/`)                   |
| `notificationId` | uuid                            | não                                 |
| `type`           | `budget_alert` \| `bill_reminder` \| `goal_milestone` | não |

Ao clicar na notificação, navegar para `payload.data.url`.

## O que implementar no front

1. Firebase web no **mesmo** `projectId` do back (`FIREBASE_PROJECT_ID`).
2. VAPID key: Firebase Console → Project settings → Cloud Messaging → Web Push certificates. Expor só a pública (`NEXT_PUBLIC_FIREBASE_VAPID_KEY`).
3. `public/firebase-messaging-sw.js` na raiz (FCM exige esse nome). Inicializar o mesmo app Firebase no SW (compat scripts).
4. HTTPS ou `localhost`.
5. Pedir `Notification.requestPermission()` (gesto do usuário, não no boot silencioso).
6. Depois do login, com permissão `granted`:
   - `onRegistered(messaging, (fid) => POST /notifications/devices { fid })`
   - `register(messaging, { vapidKey })`
7. Guardar o FID atual (memória/localStorage) para o DELETE no logout.
8. No logout: `DELETE /notifications/devices/:fid` **antes** de limpar o token.
9. SW: `onBackgroundMessage` → `showNotification(title, { body, data: { url } })`.
10. Foreground: `onMessage` → toast/inbox, sem `showNotification` se a UI já mostra.

## Exemplo de registro (SDK atual)

```ts
import { getMessaging, onRegistered, register } from "firebase/messaging";

const messaging = getMessaging(app);

onRegistered(messaging, (fid) => {
  // POST /notifications/devices { fid } com Bearer do usuário logado
});

await register(messaging, {
  vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
});
```

Não usar `getToken()` / não enviar FCM registration token. O Admin SDK do back manda para FID (`fids`).

## Exemplo de SW (background)

```js
importScripts("https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js");

firebase.initializeApp({ /* mesma config do app web */ });
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, url } = payload.data ?? {};
  self.registration.showNotification(title ?? "Moneyly", {
    body: body ?? "",
    data: { url: url ?? "/" },
  });
});
```

Alinhar a versão dos `importScripts` com o `firebase` do `package.json`.

## Regras de UX / arquitetura (Moneyly)

- Next.js App Router + TS strict + Tailwind + shadcn/ui.
- Lógica em hook/service (`use-push-notifications.ts` / `push.service.ts`), UI só visual.
- Comentários em PT-BR, só intenção não-óbvia.
- Loading/erro da permissão: denied vs default vs granted.
- Não bloquear login se push falhar (efeito colateral).
- Regenerar client da API (`pnpm api:generate`) se o OpenAPI já tiver `POST /notifications/devices`.

## Fora de escopo

- Não alterar o backend.
- Não criar tópicos FCM.
- Não enviar push pelo front.
- Não usar token legado no lugar do FID.

## Critério de pronto

- Após login + permissão, `POST /notifications/devices` retorna `registered: true`.
- O warn `[push] skip — nenhum device registrado` some no back quando uma notificação é criada.
- Logout chama `DELETE /notifications/devices/:fid`.
- App em background recebe notificação; clique abre `url`.
- App em foreground não duplica notificação nativa.
