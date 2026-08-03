# F9 (Front) — Alertas de Milestone de Meta

**Status:** Done (render + invalidation + toast de celebração). Espelha `moneyly-back/.specs/features/08-goal-milestone-alerts.md` (handoff: `front-handoff-f8-f10.md`).
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
- **Toast de celebração imediata**: `AddValueToGoalForm` recebe o `goal` (não mais só `goalId`)
  e compara % antes (prop) vs % depois (resposta) — cruzou marco → toast extra com o **maior**
  marco cruzado (25/50/75: `Meta "<título>": <pct>% atingido`; 100: `Meta concluída: <título>.
Parabéns!` com duração maior). Os marcos intermediários ficam no sino (back notifica todos).

## Divergência de contrato (anotar pro back)

O handoff diz que a resposta do `add-amount` traz goal + milestones + progress, mas o
`openapi.json` tipa a resposta como `Goal` puro — o tipo gerado não tem `milestones`. O toast
contorna comparando percentuais (equivalente). Se o back expuser `milestones` no schema da
resposta e regenerar, dá para usar `isReached` direto.

## Não feito (v1)

- Confete/animação no 100% — hoje é só toast com duração maior.
