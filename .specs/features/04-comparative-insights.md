# F4 (Front) — Insights Comparativos

**Status:** Done. Espelha `moneyly-back/.specs/features/04-comparative-insights.md`.
Contrato: `GET /overview/insights/comparison?periodsBack=` → `ComparativeInsights` (aditivo; `/overview/insights` intacto).

> **Atualização 2026-10-26:** endpoint, hook e `comparison-section.tsx` foram removidos. O comparativo por categoria vs média agora vem de `useGetOverviewInsights` (`categories` e `spending`). O texto abaixo é histórico.

## UI

- Componente: `src/app/(routes)/(private)/insights/comparison-section.tsx`.
- Section "Comparativo vs média (N períodos)" em `/insights` (após Top categorias, antes de assinaturas).
- Hook gerado: `useGetOverviewInsightsComparison()` (sem `periodsBack` = default back 3).
- Bloco totais: `currentExpense` vs `averageExpense` + `deltaPct` com seta/cor por `signal`.
- `highlights[]` como lista destacada. `byCategory[]`: nome + `message` + delta colorido.
- Cor por signal: `up`=despesa subiu=ruim (`text-expense`), `down`=caiu=bom (`text-income`), `stable`=neutro.

## Contrato consumido (gerado)

`ComparativeInsights`: `basis{periodsCompared,currentPeriod}`, `totals{currentExpense,averageExpense,deltaPct|null,signal}`, `byCategory[]{categoryId,categoryName,currentExpense,averageExpense,deltaPct|null,signal,message}`, `highlights[]`.

## Não feito (v1)

- Sem controle de `periodsBack` na UI (usa default). Empty state quando `byCategory` vazio (histórico insuficiente).
