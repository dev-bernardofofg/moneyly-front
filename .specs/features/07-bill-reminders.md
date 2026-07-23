# F8 (Front) — Lembrete de Contas a Vencer

**Status:** Done. Espelha `moneyly-back/.specs/features/07-bill-reminders.md` (handoff: `moneyly-back/.specs/front-handoff-f8-f10.md`).
Contrato: nenhum endpoint novo — `GET /notifications` passa a retornar `type: "bill_reminder"`.

## O que o front faz

Nada para gerar — só renderizar. O scheduler horário do back detecta despesas recorrentes
ativas com vencimento nos próximos 3 dias e cria a notificação (idempotente por
(recorrente, data de vencimento)).

## UI

- Componente: `src/app/(components)/(bases)/(notifications)/notification-bell.tsx` (mesmo sino do F2).
- `bill_reminder` sempre chega com `severity: "info"` — o visual é diferenciado pelo `type`,
  não pela severidade: ícone `CalendarClock` + borda/fundo `warn` (`notificationIcon`/`notificationColor`).
- `title`/`message` já vêm prontos em pt-BR do back (`Conta a vencer: <título>` ·
  `Netflix de R$ 55,90 vence em 2 dias (05/07).`) — front não formata nada.

## Contrato consumido (gerado)

- `Notification.type` agora é union `"budget_alert" | "bill_reminder" | "goal_milestone"`
  (regen no commit `5620216`).
- Semântica de `relatedId` por tipo: `bill_reminder` → `recurringTransactionId`, `periodId: null`.
  `relatedId` pode apontar para registro já deletado (notificação é histórico) — tratar como opaco.

## Não feito (v1)

- Sem navegação ao clicar (ex.: ir para `/recurring-transactions` filtrado pela recorrente) —
  `relatedId` é best-effort, exigiria tratar 404.
