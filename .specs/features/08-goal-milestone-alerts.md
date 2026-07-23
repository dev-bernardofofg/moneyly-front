# F9 (Front) — Alertas de Milestone de Meta

**Status:** Done (render + invalidation). Espelha `moneyly-back/.specs/features/08-goal-milestone-alerts.md` (handoff: `front-handoff-f8-f10.md`).
Contrato: nenhum endpoint novo — `POST /goals/:id/add-amount` gera a notificação `goal_milestone` **na mesma request** (síncrono).

## Comportamento do back (relevante pro front)

- Cruzou marco (25/50/75/100%) no `add-amount` → 1 notificação por marco recém-atingido.
  Aporte grande pode cruzar vários marcos de uma vez → várias notificações. Nunca repete marco.
- 100% tem título `Meta concluída: <título>` — gatilho para UI de celebração.
- A resposta do `add-amount` continua a mesma (goal + milestones + progress) — dá para detectar
  o marco cruzado pela própria resposta, sem esperar a lista de notificações.

## UI

- **Render**: `notification-bell.tsx` — `goal_milestone` sempre `severity: "info"`; visual pelo
  `type`: ícone `PartyPopper` + borda/fundo `income`.
- **Invalidation**: `(routes)/(private)/planner/add-value-to-goal.form.tsx` inclui
  `getGetNotificationsQueryKey()` nos `invalidateKeys` do `useUpsertDialog` — a notificação já
  existe quando a resposta chega, então o sino atualiza junto com goals/overview.
- Semântica: `relatedId` → `goalId`, `periodId: null`.

## Não feito (v1)

- **Toast/celebração imediata pós add-amount** (opcional no handoff): detectar marco cruzado
  comparando `milestones` da resposta com o estado anterior e disparar toast custom
  (ex.: confete no 100%). Hoje só o toast genérico "Valor adicionado com sucesso" + sino.
