# 05 — Catálogo de Telas

Mapa tela → arquivos + hooks gerados + regras não-óbvias. Atualizar ao adicionar/alterar tela.

> **Âncora:** sincronizado em commit `6a6edc3`.
> **Fonte de verdade de endpoints/payloads: `moneyly-back/openapi.json`.** Hooks: `src/api/generated/hooks/<tag>`. Em divergência, vale o openapi → regerar.

## Auth — `/auth`

- `(routes)/(public)/auth/` (`page.tsx`, `(sign-in)/sign-in.form.tsx`, `(sign-up)/sign-up.form.tsx`, `auth.schema.tsx`).
- Hooks `auth/auth.ts`: sign-in/up, Google, refresh, logout. `AuthProvider.setAuth` grava cookie + `localStorage.auth_user`. Refresh automático no interceptor (fila anti-corrida).

## Dashboard — `/dashboard`

- `(routes)/(private)/dashboard/page.tsx` + `free-balance-section.tsx` + `freshness.helpers.ts` + `src/components/charts/monthly-history-chart.tsx` + `(stats)`.
- Hooks `overview/overview.ts` (`useGetOverviewForecast`, `useGetOverviewDashboard`, `useGetOverviewCardBills`) + `accounts` + `transactions` (`summary-by-month`). Saldo Livre com frescor das contas, próximo pagamento, "Fazer check-in" e "Registrar horas" (dialog); stats, transações recentes, histórico mensal agregado (R1).

## Check-in — `/check-in` (F21)

- `check-in/page.tsx` + `check-in.action.tsx` (reducer e importação) + `check-in.helpers.ts` + `check-in-review.tsx` + `import-category-picker.tsx` + `import-statement.helpers.ts`.
- Hooks `transactions/transactions.ts` (`usePostTransactionsImportPreview`, `usePostTransactionsImport`) + `accounts`. Vários `.ofx`/`.pdf` de uma vez; a prévia é uma chamada por arquivo e o `accountKey` resolve a conta. Conta nova é perguntada uma vez. Só linha sem categoria identificada e `possible_duplicate` pedem revisão. Arquivo inválido falha sozinho; falha ao confirmar mantém a revisão. Tela final mostra o Saldo Livre antes e depois. Detalhe: `.specs/features/01-cash-flow-forecast.md`.

## Transactions — `/transactions`

- `page.tsx` + `transaction.table.tsx` + `transaction.utils.ts`; form `src/forms/upsert-transaction.form.tsx` + `transaction.tabs.tsx`.
- Hooks `transactions/transactions.ts`: `useGetTransactions` (paginado), `usePostTransactionsCreate`, `usePut/DeleteTransactions{id}`, summaries. Schema form `src/schemas/transaction.schema.tsx`. Mutação invalida dashboard+lista+summary. Dinheiro: string→number no submit.

## Recurring Transactions — `/recurring-transactions`

- `page.tsx` + `recurring-transaction.table.tsx` + `.utils.ts`; form `src/forms/upsert-transaction-recurring.form.tsx`.
- Hooks `recurring-transactions/*`: CRUD + `deactivate`/`reactivate`. Frequência `daily|weekly|monthly|yearly`; `dayOfMonth` só monthly, `dayOfWeek` (0=dom) só weekly. Recorrência é só previsão (entra no Saldo Livre); o back não cria transação. O histórico saiu da interface no F21.

## Categories — `/categories`

- `page.tsx` + `category.table.tsx`; form `src/forms/upsert-category.form.tsx`, schema `src/schemas/category.schema.tsx`.
- Hooks `categories/categories.ts`: list, create, update/{id}, delete/{id}. **Global (`isGlobal`/`userId=null`) não editável/deletável no UI.**

## Planner (Budgets + Goals) — removido

- `/planner` saiu no F21, com `add-value-to-goal.form.tsx`, os forms de orçamento e meta e os swipers. Orçamentos e metas continuam no back, mas o front não os usa e o Saldo Livre não os considera.

## Accounts — `/accounts`

- `page.tsx` + `account-period-summary.tsx` + `transfers-section.tsx`; form `src/forms/upsert-account.form.tsx`. Hooks `accounts/accounts.ts` e `transfers/transfers.ts`. Saldo inicial por conta ("Corrigir saldo") e frescor (`dataThrough`, `freshness`).

## Overtime — `/overtime`

- `page.tsx` + `overtime.table.tsx`; forms `src/forms/upsert-overtime.form.tsx`, `upsert-company.form.tsx`; schema `src/schemas/overtime.schema.tsx`; `src/components/forms/base-shift-picker.tsx`.
- Hooks `overtime/overtime.ts` (list paginado por `month`/`year` civil, summary, CRUD) + `companies/companies.ts` (CRUD). Filtra por **mês civil** derivado do `startDate` do período selecionado, não por `periodId`. Horas extras não geram transação; as horas do mês M vão com o salário M+1 (`nextPayment.overtime`). Detalhe: `.specs/features/06-overtime.md`.

## Profile — `/profile`

- `page.tsx` + `profile-config-finance.form.tsx`; `src/schemas/initial-config.schema.tsx`; guard inicial (`use-initial-config`).
- Hooks `user/user.ts`: `GET /user/me`, `PUT /user/income-and-period`, `/financial-period`. Define `financialDayStart/End` (período financeiro pessoal).

## Infra transversal

- `src/lib/axios-instance.ts` (`customInstance`, Bearer, refresh, formata erro) · `src/lib/cookies.ts` · `src/lib/routes.ts` · `src/lib/env.ts`.
- `src/lib/`: `number.ts` (BRL), `string.ts` (parse moeda), `errors.ts` (`getErrorMessage`/`setFormFieldErrors`), `budget-level.ts`.
- `src/contexts/`: auth/period/theme/index (QueryClient).
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
- `@kubb/plugin-zod` removido do `kubb.config.ts` (zod gerado não consumido + quebrava em `allOf:[{$ref},{nullable:true}]`). Forms usam `src/schemas` à mão.

## F1 / F2 — Done

- **F1 Saldo Livre**: seção no dashboard e detalhamento em `/insights` ("Gastos") via `useGetOverviewForecast` (`ForecastResponse`, `{ freeBalance }` sempre para hoje). Refeito no F21. Detalhe: `.specs/features/01-cash-flow-forecast.md`.
- **F2 Alertas**: desde o F21 o back não roda mais o job de alertas de orçamento. `notification-bell.tsx` no Header global (`useGetNotifications` + patch read/read-all). ⚠️ migration back `0004` não aplicada → runtime erra até `db:push`. Detalhe: `.specs/features/02-budget-alerts.md`.

- **F3 Assinaturas**: `insights/subscription-candidates.tsx` (`useGetTransactionsSubscriptions`), exibido em `insights/adjustments-section.tsx`, + CTA recorrente. Detalhe: `.specs/features/03-subscription-detector.md`.
- **F4 Comparativo**: seção removida em 2026-10-26. Comparativo vs média vem de `useGetOverviewInsights` em `insights/spending-by-category-section.tsx` e `insights/adjustments-section.tsx`. Detalhe: `.specs/features/04-comparative-insights.md`.

- **F5 Prévias dashboard**: `dashboard/page.tsx` mostra alertas de `previews.subscriptions`/`comparison` do `useGetOverviewDashboard`, clicáveis → `/insights`. Detalhe: `.specs/features/05-dashboard-previews.md`.

## F7 — Done

- **F7 Overtime**: rota `/overtime` (ver seção acima). Detalhe: `.specs/features/06-overtime.md`.

## F8 / F9 / F10 — Done (handoff `moneyly-back/.specs/front-handoff-f8-f10.md`)

Regen de tipos no commit `5620216` (`Notification.type` virou union com `bill_reminder`/`goal_milestone`; endpoint `from-subscription`).

- **F8 Lembrete de contas**: só render — `notification-bell.tsx` diferencia `bill_reminder` pelo `type` (`CalendarClock`/warn). Detalhe: `.specs/features/07-bill-reminders.md`.
- **F9 Milestone de meta**: render `goal_milestone` (`PartyPopper`/income) + `add-value-to-goal.form.tsx` invalida notifications pós add-amount (notificação é síncrona no back). Detalhe: `.specs/features/08-goal-milestone-alerts.md`.
- **F10 Converter assinatura**: botão em `insights/subscription-candidates.tsx` → `usePostRecurringTransactionsFromSubscription`; toast com `nextExecution`; 409/400 via `getErrorMessage`; invalida recorrentes+assinaturas. Detalhe: `.specs/features/09-subscription-to-recurring.md`.

## Não implementado / parcial

- Roadmap R/F atual (R1–R5, F1–F10) todo Done no front, incluindo os opcionais do handoff F8–F10 (toast de milestone F9; filtro de candidato residual F10 via `FN_UTILS_STRING.normalizeTitle`).
- Anotar pro back: schema da resposta do `add-amount` no openapi não expõe `milestones` (ver "Divergência de contrato" em `features/08-goal-milestone-alerts.md`).
