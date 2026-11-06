# 03 — Modelo de UI

Como o domínio do back vira tela. Fonte de tipos: `src/api/generated`. Invariantes: `../../moneyly-back/.specs/03-domain-model.md`.

> **Âncora:** sincronizado em commit `6a6edc3`. Releia `src/app/(routes)` / `src/contexts` se HEAD divergiu.

## Rotas (UI)

| Rota                      | Arquivo                                                                                       | Conteúdo                                                                                                                                          | Endpoints (back)                                                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `/auth`                   | `(routes)/(public)/auth/page.tsx`                                                             | sign-in / sign-up / Google                                                                                                                        | `POST /auth/sign-in`,`/sign-up`,`/google`,`/refresh`                                                                               |
| `/dashboard`              | `(routes)/(private)/dashboard/page.tsx`                                                       | Saldo Livre com frescor das contas e botões "Fazer check-in" e "Registrar horas", faturas, contas, stats, recentes, gráfico mensal                | `GET /overview/forecast`, `GET /accounts`, `GET /overview/card-bills`, `GET /overview/dashboard`, `/transactions/summary-by-month` |
| `/check-in`               | `.../check-in/page.tsx` + `check-in.action.tsx`, `check-in.helpers.ts`, `check-in-review.tsx` | rotina semanal: envia extratos e faturas, revisa só as exceções, confirma e mostra o Saldo Livre antes e depois                                   | `POST /transactions/import/preview`, `POST /transactions/import`, `GET /accounts`, `GET /overview/forecast`                        |
| `/insights` ("Gastos")    | `.../insights/page.tsx` (+ seções em `insights/`, `subscription-candidates.tsx`)              | como o Saldo Livre é calculado + gastos por período + comparativo vs média + F3 assinaturas + F10 converter em recorrente                         | `GET /overview/insights`, `/overview/forecast`, `/transactions/subscriptions`, `POST /recurring-transactions/from-subscription`    |
| _(global)_                | `src/components/layout/header.tsx` → `notification-bell.tsx`                                  | sininho notificações (F8 bill_reminder, F21 check_in_reminder; budget_alert e goal_milestone só aparecem se já existirem) em todas telas privadas | `GET /notifications`, `PATCH /notifications/:id/read`, `/read-all`                                                                 |
| `/transactions`           | `.../transactions/page.tsx` + `transaction.table.tsx` + `export-csv-button.tsx`               | lista paginada + CRUD + export CSV                                                                                                                | `GET /transactions/`, `POST /transactions/create`, `PUT/DELETE /transactions/{id}`, `GET /transactions/export`                     |
| `/recurring-transactions` | `.../recurring-transactions/page.tsx` + table                                                 | CRUD recorrentes + (de)reativar; são só previsão, não geram transação                                                                             | `*/recurring-transactions/*`                                                                                                       |
| `/categories`             | `.../categories/page.tsx` + `category.table.tsx`                                              | globais + custom                                                                                                                                  | `GET /categories/`, `POST /categories/create`, `PUT/DELETE`                                                                        |
| `/overtime`               | `.../overtime/page.tsx` + `overtime.table.tsx`                                                | F7 horas extras + empresas (mês civil, não `periodId`); não geram transação                                                                       | `GET/POST /overtime/`, `/overtime/summary`, `PUT/DELETE /overtime/{id}`, `*/companies/*`                                           |
| `/accounts`               | `.../accounts/page.tsx` + `account-period-summary.tsx`, `transfers-section.tsx`               | contas e cartões, saldo inicial ("Corrigir saldo"), frescor, transferências                                                                       | `*/accounts/*`, `*/transfers/*`                                                                                                    |
| `/profile`                | `.../profile/page.tsx` + `profile-config-finance.form.tsx`                                    | perfil, período financeiro                                                                                                                        | `GET /user/me`, `PUT /user/income-and-period`, `/financial-period`                                                                 |

Constantes de rota em `src/lib/routes.ts` (`ROUTES`). Guarda: `middleware.ts`.

Navegação em `src/components/layout/navigation.ts`: principal = Início, Check-in, Transações, Horas Extras;
"Mais" = Gastos (`/insights`), Recorrentes, Contas e cartões, Categorias e Perfil. A rota `/planner` e o
histórico de recorrentes foram removidos no F21. Orçamentos e metas continuam no back e o front não os usa.

## Providers (estado de app)

- **AuthProvider** (`src/contexts/auth-provider.tsx`): `user`/`token`; `setAuth({data})` grava cookie + `localStorage.auth_user`; `signOut` limpa e vai p/ `/auth`. Restaura de cookie+localStorage no mount.
- **PeriodProvider** (`src/contexts/period-provider.tsx`) + `src/hooks/use-periods`: período financeiro selecionado → `periodId` nos GETs. Período ≠ mês civil.
- **ThemeProvider**: dark/light (`next-themes`).
- **QueryClient**: `src/contexts/index.tsx` (`queryClient` exportado p/ `invalidateQueries` fora de componente).

## Invariantes no front (espelham `02-shared-domain.md`)

| Invariante                                  | Aplicação no front                                               | Onde                                             |
| ------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| Dinheiro = inteiro em centavos              | converter só na exibição e no input; nunca somar valor formatado | `src/lib/number.ts`, `src/lib/string.ts`         |
| Datas ISO; negócio em America/Sao_Paulo     | usar `FN_UTILS_DATE` (date-fns-tz); não assumir mês civil        | `src/lib/date.ts`                                |
| Envelope `{data}` / `{success:false,error}` | `customInstance` entrega `.data`; erro → `getErrorMessage`       | `src/lib/axios-instance.ts`, `src/lib/errors.ts` |
| `periodId` opcional                         | repassar quando filtrar período                                  | `PeriodProvider`/`use-periods`                   |
| Categoria global não editável               | bloquear edit/delete quando `isGlobal`                           | `category.table.tsx`                             |
| Auth Bearer + refresh em 401                | interceptor com fila anti-corrida                                | `axios-instance.ts`                              |
| Transaction type / Recurring frequency      | enums fechados (gerados)                                         | tipos `(generated)`                              |

## Lacunas conhecidas (corrigir ao tocar)

- **Timezone:** ✅ resolvido (commit pós-`153b8aa`) — `src/lib/date.ts` `FN_UTILS_DATE` (BUSINESS_TZ=America/Sao_Paulo): `today()`, `endOfBusinessDayISO()`, `formatInBusinessTZ()`, `toBusinessZoned()`. `formatEndDayDate` agora delega (deprecado). Usar `FN_UTILS_DATE` em toda data de negócio nova; não usar `new Date().toISOString()` cru.
- **Dinheiro:** valores trafegam em centavos (`.specs/02-shared-domain.md` na raiz do workspace). Formatar só na borda, com `FN_UTILS_NUMBERS.formatCurrency(cents)`; não usar o valor formatado como caminho de cálculo ou soma.
- **Tipos de form vs API:** `src/schemas` são à mão (form), legítimos; mas o que vai pra API deve casar com o tipo gerado — não derivar tipo de API do schema de form.
