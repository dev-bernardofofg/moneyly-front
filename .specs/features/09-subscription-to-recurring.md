# F10 (Front) — Converter Assinatura Detectada em Recorrente

**Status:** Done (fluxo principal). Espelha `moneyly-back/.specs/features/09-subscription-to-recurring.md` (handoff: `front-handoff-f8-f10.md`).
Contrato: `POST /recurring-transactions/from-subscription` → `201` com a recorrente criada.

## UI

- Componente: `src/app/(routes)/(private)/insights/subscriptions-section.tsx` (`SubscriptionRow`).
- Botão "Converter em recorrente" por candidato (substituiu o CTA do F3 que abria
  `UpsertTransactionRecurringForm` em branco — conversão agora é 1 clique, sem form).
- Hook gerado: `usePostRecurringTransactionsFromSubscription()`.

## Mapeamento candidato → body (1:1)

`title` ← `candidate.title` · `amount` ← `candidate.averageAmount` · `categoryId` ←
`candidate.categoryId` · `cadence` ← `candidate.cadence` · `nextEstimatedDate` ←
`candidate.nextEstimatedDate`. `description` não enviado (opcional).

## Sucesso

- Toast com "Próxima cobrança em dd/MM" usando a **`nextExecution` retornada** — importante
  porque o back avança a data de início para o futuro se `nextEstimatedDate` já passou
  (a primeira cobrança nunca é imediata; evita duplicar a despesa que gerou a detecção).
- Invalida `getGetRecurringTransactionsQueryKey()` + `getGetTransactionsSubscriptionsQueryKey()`.

## Erros

- `409` (recorrente ativa com mesmo título normalizado — case/acentos/sufixo numérico ignorados)
  e `400` (categoria inexistente): mensagem da API exibida via `getErrorMessage` em toast.

## Filtro de candidato residual

O detector pode **continuar retornando** o candidato após a conversão (a heurística olha
transações antigas, sem `recurringTransactionId` retroativo). Mitigação client-side na
`SubscriptionsSection`: `useGetRecurringTransactions({ limit: 100 })` (ativas por padrão —
mesmo conjunto do 409 do back) → esconder candidatos cujo título normalizado bate com recorrente
ativa. Normalização em `FN_UTILS_STRING.normalizeTitle` — **paridade obrigatória** com
`normalizeTitle` do back (`subscription-detector.ts`): lowercase, NFD sem acentos, sem sufixo
numérico. Como a mutação invalida a query de recorrentes, o candidato some da lista na hora.

## Não feito (v1)

- Campo `description` opcional não exposto (conversão é 1 clique, sem dialog).
- Filtro cobre até 100 recorrentes ativas (1 página) — suficiente na prática; acima disso,
  candidato residual pode reaparecer até as próximas execuções criarem o vínculo.
