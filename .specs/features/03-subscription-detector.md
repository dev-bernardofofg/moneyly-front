# F3 (Front) — Detector de Assinaturas

**Status:** Done. Espelha `moneyly-back/.specs/features/03-subscription-detector.md`.
Contrato: `GET /transactions/subscriptions` → `SubscriptionCandidate[]`.

## UI

- Componente: `src/app/(routes)/(private)/insights/subscriptions-section.tsx`.
- Section "Possíveis assinaturas" em `/insights` (após Top categorias).
- Hook gerado: `useGetTransactionsSubscriptions()`.
- Lista: título, `categoryName`, `cadence` (Semanal/Mensal/Anual), `occurrences`, `monthlyCost`/mês, `averageAmount`.
- CTA "Virar recorrente" → `BaseDialog` + `UpsertTransactionRecurringForm`.

## Contrato consumido (gerado)

`SubscriptionCandidate`: `title,categoryId,categoryName,averageAmount,occurrences,cadence(weekly|monthly|yearly),firstDate,lastDate,nextEstimatedDate,monthlyCost`. Ordenado por `monthlyCost` desc (back).

## Não feito (v1)

- CTA abre o form de recorrente **em branco** — sem pré-preencher do candidato. `UpsertTransactionRecurringForm` só aceita `recurringTransaction?` (modo edição); pré-seed exigiria estender form/schema. Reavaliar se pedirem.
