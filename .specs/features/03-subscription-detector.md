# F3 (Front) — Detector de Assinaturas

**Status:** Done. Espelha `moneyly-back/.specs/features/03-subscription-detector.md`.
Contrato: `GET /transactions/subscriptions` → `SubscriptionCandidate[]`.

## UI

- Componente: `src/app/(routes)/(private)/insights/subscriptions-section.tsx`.
- Section "Possíveis assinaturas" em `/insights` (após Top categorias).
- Hook gerado: `useGetTransactionsSubscriptions()`.
- Lista: título, `categoryName`, `cadence` (Semanal/Mensal/Anual), `occurrences`, `monthlyCost`/mês, `averageAmount`.
- CTA "Converter em recorrente" → conversão direta via `POST /recurring-transactions/from-subscription` (F10). Detalhe: `09-subscription-to-recurring.md`.

## Contrato consumido (gerado)

`SubscriptionCandidate`: `title,categoryId,categoryName,averageAmount,occurrences,cadence(weekly|monthly|yearly),firstDate,lastDate,nextEstimatedDate,monthlyCost`. Ordenado por `monthlyCost` desc (back).

## Não feito (v1)

- ~~CTA abre o form de recorrente em branco — sem pré-preencher do candidato.~~ Resolvido pelo
  F10: o CTA agora converte direto pelo endpoint dedicado, sem form (mapeamento 1:1 do candidato).
