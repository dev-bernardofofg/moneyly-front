# F2 (Front) — Alertas de Orçamento

**Status:** Done (UI). Espelha `moneyly-back/.specs/features/02-budget-alerts.md`.
Contrato: `GET /notifications?unreadOnly&page&limit` (paginado), `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`.

## UI

- Componente: `src/app/(components)/(bases)/(notifications)/notification-bell.tsx`.
- Sininho global no `Header` (`(components)/(layout)/header.tsx`) → presente em todas telas privadas.
- Badge com contagem não-lidas (`isRead === false`); `9+` acima de 9.
- Popover com lista (`useGetNotifications({page:1,limit:20})`), cor/ícone por `severity` (`info`/`warning`/`danger`).
- "Marcar como lida" (`usePatchNotificationsIdRead`) e "Marcar todas" (`usePatchNotificationsReadAll`) → `invalidateQueries(getGetNotificationsQueryKey)`.

## Contrato consumido (gerado)

`Notification`: `id,userId,type(budget_alert),severity(info|warning|danger),title,message,relatedId,periodId,dedupeKey,isRead,createdAt`. Lista = envelope paginado (`{success,data[],pagination}`).

## ⚠️ Dependência back (runtime)

Migration `0004_happy_veda.sql` (tabela `notifications`) gerada mas **não aplicada** no DB (back: `db:push` manual, toca DB remoto). Até aplicar, `/notifications` retorna erro → sininho fica vazio/erro silencioso. UI não quebra (lista vazia). Geração de alertas é interna (scheduler back `processBudgetAlerts`).

## Não feito (v1)

- Sem filtro `unreadOnly` na UI (traz tudo, calcula não-lidas no client).
- Sem paginação na lista (limit 20 fixo). Sem delete (contrato não expõe).
- Reaproveitado nada do `notifications-popover.tsx`/`alerts-popover.tsx` antigos (tipos hand-written / PlannerAlert — escopo diferente). Candidatos a remoção futura.
