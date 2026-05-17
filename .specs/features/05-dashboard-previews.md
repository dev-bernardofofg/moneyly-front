# F5 (Front↔Back) — Prévias no Dashboard

**Status:** parcial (F1 feito no front; F3/F4 aguardam back). **Tipo:** UX/perf.

## Contexto

`/dashboard` é a página mais acessada (homepage pós-login). Quer prévia das features novas (F1 forecast, F2 alertas, F3 assinaturas, F4 comparativo) sem encarecer a home.

## Custo por fonte

| Preview | Endpoint | Custo | Decisão |
|---|---|---|---|
| F1 forecast | `GET /overview/forecast` | leve (escopo período) | ✅ feito: `BaseStats` "Saldo projetado" no dashboard, clicável → `/insights`. 1 call leve, query key próprio. |
| F2 alertas | `GET /notifications` | barato/indexado | ✅ já coberto: `NotificationBell` global no Header (mesma query, cache compartilhado, zero call extra). |
| F3 assinaturas | `GET /transactions/subscriptions` | **pesado** (`findAllByUserId` + heurística) | ❌ não chamar na homepage. |
| F4 comparativo | `GET /overview/insights/comparison` | **pesado** (scan histórico + N períodos) | ❌ não chamar na homepage. |

## Pedido ao backend

Para F3/F4 na home sem N scans pesados por load, **estender `GET /overview/dashboard`** (já é a 1 call agregada da home) com bloco compacto, computado/cacheável no back:

```
data.previews?: {
  subscriptions: { count: number, topMonthlyCost: number | null, topTitle: string | null },
  comparison:    { signal: "up"|"down"|"stable", deltaPct: number | null, topHighlight: string | null }
}
```

- Aditivo, opcional → não quebra contrato atual do dashboard (R1).
- Back reusa heurísticas de F3/F4 mas resume (sem listas completas) e pode cachear por período/usuário.
- Front então renderiza 2 mini-cards no dashboard ligando para `/insights` (detalhe completo lá).

Registrar em `moneyly-back/.specs/features/` quando o back priorizar. Até lá: dashboard mostra só F1 + sininho (F2).

## Front (feito)

- `src/app/(routes)/(private)/dashboard/page.tsx`: card "Saldo projetado" (`useGetOverviewForecast`, `periodId` do `PeriodProvider`), clicável → `/insights`.
