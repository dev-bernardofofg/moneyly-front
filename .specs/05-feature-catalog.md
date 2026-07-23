# 05 — Catálogo de Telas

Mapa tela → arquivos + hooks gerados + regras não-óbvias. Atualizar ao adicionar/alterar tela.

> **Âncora:** sincronizado em commit `6a6edc3`.
> **Fonte de verdade de endpoints/payloads: `moneyly-back/openapi.json`.** Hooks: `(resources)/(generated)/hooks/<tag>`. Em divergência, vale o openapi → regerar.

## Auth — `/auth`

- `(routes)/(public)/auth/` (`page.tsx`, `(sign-in)/sign-in.form.tsx`, `(sign-up)/sign-up.form.tsx`, `auth.schema.tsx`).
- Hooks `auth/auth.ts`: sign-in/up, Google, refresh, logout. `AuthProvider.setAuth` grava cookie + `localStorage.auth_user`. Refresh automático no interceptor (fila anti-corrida).

## Dashboard — `/dashboard`

- `(routes)/(private)/dashboard/page.tsx` + `(components)/(bases)/(charts)/monthly-history-chart.tsx` + `(stats)`.
- Hooks `overview/overview.ts` (`useGetOverviewDashboard`) + `transactions` (`summary-by-month`). Stats, transações recentes, histórico mensal agregado (R1).

## Transactions — `/transactions`

- `page.tsx` + `transaction.table.tsx` + `transaction.utils.ts`; form `(forms)/upsert-transaction.form.tsx` + `transaction.tabs.tsx`.
- Hooks `transactions/transactions.ts`: `useGetTransactions` (paginado), `usePostTransactionsCreate`, `usePut/DeleteTransactions{id}`, summaries. Schema form `(schemas)/transaction.schema.tsx`. Mutação invalida dashboard+lista+summary. Dinheiro: string→number no submit.

## Recurring Transactions — `/recurring-transactions`

- `page.tsx` + `recurring-transaction.table.tsx` + `recurring-transaction-history.dialog.tsx` + `.utils.ts`; form `(forms)/upsert-transaction-recurring.form.tsx`.
- Hooks `recurring-transactions/*`: CRUD + `{id}/transactions` (histórico) + `deactivate`/`reactivate`. Frequência `daily|weekly|monthly|yearly`; `dayOfMonth` só monthly, `dayOfWeek` (0=dom) só weekly. Materialização é no back (scheduler).

## Categories — `/categories`

- `page.tsx` + `category.table.tsx`; form `(forms)/upsert-category.form.tsx`, schema `(schemas)/category.schema.tsx`.
- Hooks `categories/categories.ts`: list, create, update/{id}, delete/{id}. **Global (`isGlobal`/`userId=null`) não editável/deletável no UI.**

## Planner (Budgets + Goals) — `/planner`

- `page.tsx` + `add-value-to-goal.form.tsx`; forms `(forms)/upsert-budget.form.tsx`, `upsert-goal.form.tsx`; swipers `(bases)/(swipers)`.
- Hooks `budgets/budgets.ts` (+`{id}`) e `goals/goals.ts` (+`{id}`, `add-amount`). Budget progress vem calculado do back; status `safe/attention/warning/exceeded` → cores via `(helpers)/budget-level.ts`. 1 budget/categoria (back 409 se duplicado). Repassar `periodId`.

## Overtime — `/overtime`

- `page.tsx` + `overtime.table.tsx`; forms `(forms)/upsert-overtime.form.tsx`, `upsert-company.form.tsx`; schema `(schemas)/overtime.schema.tsx`; `(bases)/(forms)/base-date-time-picker.tsx`.
- Hooks `overtime/overtime.ts` (list paginado por `month`/`year` civil, summary, CRUD) + `companies/companies.ts` (CRUD). Filtra por **mês civil** derivado do `startDate` do período selecionado, não por `periodId`. Valores decimais como string → `parseFloat`. Detalhe: `.specs/features/06-overtime.md`.

## Profile — `/profile`

- `page.tsx` + `profile-config-finance.form.tsx`; `(schemas)/initial-config.schema.tsx`; guard inicial (`use-initial-config`).
- Hooks `user/user.ts`: `GET /user/me`, `PUT /user/income-and-period`, `/financial-period`, `/income`. Define `financialDayStart/End` (período financeiro pessoal).

## Infra transversal

- `(utils)/axios-instance.ts` (`customInstance`, Bearer, refresh, formata erro) · `(utils)/cookies.ts` · `(utils)/routes.ts` · `(utils)/env.ts`.
- `(helpers)/`: `number.ts` (BRL), `string.ts` (parse moeda), `errors.ts` (`getErrorMessage`/`setFormFieldErrors`), `budget-level.ts`.
- `(contexts)/`: auth/period/theme/index (QueryClient).
- Geração: `kubb.config.ts`, `orval.config.ts`, `openapi.json` → `pnpm generate-hooks`.

## ✅ Contrato I1 consumido — front fechado (R1–R5)

- `pnpm generate-hooks` do json refinado (22 schemas). type-check **0**, lint, `pnpm build` verdes.
- `auth-provider.tsx` → `PostAuthSignIn200`/`AuthSession` (era `AuthResponse` órfão, não exportado no index).
- `initial-config.form.tsx` → `updateUser(getUserMe().data)` direto (drop overrides nullable; getUserMe é fonte de verdade pós-update).
- **R2 Export CSV**: `transactions/export-csv-button.tsx` → `getTransactionsExport()` (text/csv) → Blob download `transacoes-<hoje>.csv`. Botão no Header de `/transactions`.
- **R4 Insights**: rota `(routes)/(private)/insights/page.tsx` + `ROUTES.INSIGHTS` + link sidebar (`Lightbulb`) + `middleware` privateRoutes. `useGetOverviewInsights` → `FinancialInsights` (currentPeriod/trend/allTime/topCategories) via `BaseStats`+`Section`.
- ⚠️ `MonthlySummaryItem & any` em `trend.*`/`allTime.bestMonth` (artefato nullable-$ref) — render defensivo (`?.`/`?? `).

## 🟢 Notas (não bloqueiam)

- Ajustes de consumo durante I1 (type correto, sem tipo à mão): `GET /budgets/`→`BudgetProgress` (`budget-card`/`budget-swiper`/`upsert-budget.form`); `GET /user/financial-periods`→`FinancialPeriodSummary` (`use-periods`); `GET /categories/` não paginado (`categories/page` client-side).
- `@kubb/plugin-zod` removido do `kubb.config.ts` (zod gerado não consumido + quebrava em `allOf:[{$ref},{nullable:true}]`). Forms usam `(resources)/(schemas)` à mão.

## F1 / F2 — Done

- **F1 Saldo projetado**: Section em `/insights` via `useGetOverviewForecast` (`ForecastResponse`). Detalhe: `.specs/features/01-cash-flow-forecast.md`.
- **F2 Alertas**: `notification-bell.tsx` no Header global (`useGetNotifications` + patch read/read-all). ⚠️ migration back `0004` não aplicada → runtime erra até `db:push`. Detalhe: `.specs/features/02-budget-alerts.md`.

- **F3 Assinaturas**: `insights/subscriptions-section.tsx` (`useGetTransactionsSubscriptions`) + CTA recorrente. Detalhe: `.specs/features/03-subscription-detector.md`.
- **F4 Comparativo**: `insights/comparison-section.tsx` (`useGetOverviewInsightsComparison`), cor por signal. Detalhe: `.specs/features/04-comparative-insights.md`.

- **F5 Prévias dashboard**: `dashboard/page.tsx` 3 mini-cards (F1 forecast + `previews.subscriptions`/`comparison` do `useGetOverviewDashboard`), clicáveis → `/insights`. Detalhe: `.specs/features/05-dashboard-previews.md`.

## F7 — Done

- **F7 Overtime**: rota `/overtime` (ver seção acima). Detalhe: `.specs/features/06-overtime.md`.

## F8 / F9 / F10 — Done (handoff `moneyly-back/.specs/front-handoff-f8-f10.md`)

Regen de tipos no commit `5620216` (`Notification.type` virou union com `bill_reminder`/`goal_milestone`; endpoint `from-subscription`).

- **F8 Lembrete de contas**: só render — `notification-bell.tsx` diferencia `bill_reminder` pelo `type` (`CalendarClock`/warn). Detalhe: `.specs/features/07-bill-reminders.md`.
- **F9 Milestone de meta**: render `goal_milestone` (`PartyPopper`/income) + `add-value-to-goal.form.tsx` invalida notifications pós add-amount (notificação é síncrona no back). Detalhe: `.specs/features/08-goal-milestone-alerts.md`.
- **F10 Converter assinatura**: botão em `insights/subscriptions-section.tsx` → `usePostRecurringTransactionsFromSubscription`; toast com `nextExecution`; 409/400 via `getErrorMessage`; invalida recorrentes+assinaturas. Detalhe: `.specs/features/09-subscription-to-recurring.md`.

## Não implementado / parcial

- Roadmap R/F atual (R1–R5, F1–F10) todo Done no front.
- Pendências opcionais (spec "Não feito (v1)" de cada feature): toast/celebração de milestone pós add-amount (F9); esconder candidato residual cujo título bate com recorrente ativa (F10).
