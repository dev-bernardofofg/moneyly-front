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

## Comportamento conhecido (aceito na v1)

O candidato pode **continuar aparecendo** no detector após a conversão: a heurística do F3 olha
transações antigas, que não ganham `recurringTransactionId` retroativo. As próximas execuções da
recorrente criam o vínculo e o candidato some naturalmente. Decisão v1: invalidar e deixar a
lista se reconciliar (comentário em `subscriptions-section.tsx`).

## Não feito (v1)

- **Mitigação de candidato residual**: esconder candidatos cujo título normalizado bate com
  recorrente ativa (client-side, cruzando com `useGetRecurringTransactions`). Ver plano em
  aberto — exige replicar a normalização de título do back (case/acentos/sufixo numérico).
- Campo `description` opcional não exposto (conversão é 1 clique, sem dialog).
