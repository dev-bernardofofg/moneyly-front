# F1 (Front) — Saldo Livre e projeção

**Status:** Done. Espelha `moneyly-back/.specs/features/01-cash-flow-forecast.md`.
Contrato: `GET /overview/forecast?periodId=<uuid?>` → `ForecastResponse`.

## UI

- Rota: `/dashboard`: seção principal “Saldo Livre”, antes dos indicadores do período.
- Exibe valor disponível, dias restantes, confiança, renda fixa/variável, contas recorrentes
  e reservas de orçamento/metas.
- Rota: `/insights` (`src/app/(routes)/(private)/insights/page.tsx`).
- Section "Saldo projetado (fim do período)" no topo, antes dos cards de insights.
- Hook gerado: `useGetOverviewForecast()` (sem `periodId` = período atual).
- `BaseStats` (4): Saldo realizado (`realized.balance`), Entradas previstas (`projected.recurringIncome`), Saídas previstas (`projected.recurringExpense`), Saldo projetado (`projectedEndBalance`, descrição = nº de `projected.occurrences`).
- Variant `default`/`destructive` por sinal do saldo. Dinheiro via `FN_UTILS_NUMBERS.formatCurrency`.

## Contrato consumido (gerado)

`ForecastResponse`: `period`, `realized`, `projected`, `projectedEndBalance`,
`freeBalance{total,daysRemaining,confidence,income,commitments,reserves,components}` e `asOf`.
Dinheiro = `number`.

## Não feito (v1)

- Sem seletor de período próprio (usa período atual; `periodId` do contrato não exposto na UI ainda).
- Lista detalhada de `occurrences` não renderizada (só contagem). Reavaliar se pedirem.
