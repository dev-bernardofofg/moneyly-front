# F5 (Front↔Back) — Prévias no Dashboard

**Status:** Done. **Tipo:** UX/perf.

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

**✅ Back entregou:** `data.previews{subscriptions{count,topMonthlyCost,topTitle},comparison{signal,deltaPct,topHighlight}}` em `GET /overview/dashboard` (aditivo, 1 só `findAllByUserId`, F3/F4 resumido). `DashboardOverview` openapi estendido.

## Front (feito)

- `src/app/(routes)/(private)/dashboard/page.tsx`:
  - Card "Saldo projetado" (`useGetOverviewForecast`, `periodId` do `PeriodProvider`).
  - Card "Possíveis assinaturas" (`previews.subscriptions.count` + `topTitle`).
  - Card "Despesa vs média" (`previews.comparison.deltaPct` + cor por `signal`, `topHighlight`).
  - Todos clicáveis → `/insights` (detalhe completo). F3/F4 via `previews` = **zero call extra** (mesmo `useGetOverviewDashboard`). F2 = sininho global.
