# 03 — Modelo de UI

Como o domínio do back vira tela. Fonte de tipos: `(resources)/(generated)`. Invariantes: `../../.specs/02-shared-domain.md`.

> **Âncora:** sincronizado em commit `153b8aa`. Releia `src/app/(routes)` / `(contexts)` se HEAD divergiu.

## Rotas (UI)

| Rota | Arquivo | Conteúdo | Endpoints (back) |
|---|---|---|---|
| `/auth` | `(routes)/(public)/auth/page.tsx` | sign-in / sign-up / Google | `POST /auth/sign-in`,`/sign-up`,`/google`,`/refresh` |
| `/dashboard` | `(routes)/(private)/dashboard/page.tsx` | stats, recentes, gráfico mensal | `GET /overview/dashboard`, `/transactions/summary-by-month` |
| `/insights` | `.../insights/page.tsx` | currentPeriod/trend/allTime/topCategories | `GET /overview/insights` (`FinancialInsights`) |
| `/transactions` | `.../transactions/page.tsx` + `transaction.table.tsx` + `export-csv-button.tsx` | lista paginada + CRUD + export CSV | `GET /transactions/`, `POST /transactions/create`, `PUT/DELETE /transactions/{id}`, `GET /transactions/export` |
| `/recurring-transactions` | `.../recurring-transactions/page.tsx` + table + history dialog | CRUD recorrentes + histórico + (de)reativar | `*/recurring-transactions/*` |
| `/categories` | `.../categories/page.tsx` + `category.table.tsx` | globais + custom | `GET /categories/`, `POST /categories/create`, `PUT/DELETE` |
| `/planner` | `.../planner/page.tsx` (+ `add-value-to-goal.form.tsx`) | budgets + goals | `GET/POST /budgets/`, `PUT/DELETE /budgets/{id}`, `*/goals/*` |
| `/profile` | `.../profile/page.tsx` + `profile-config-finance.form.tsx` | perfil, renda, período financeiro | `GET /user/me`, `PUT /user/income-and-period`, `/financial-period`, `/income` |

Constantes de navegação em `(utils)/routes.ts` (`ROUTES`). Guarda: `middleware.ts`.

## Providers (estado de app)

- **AuthProvider** (`(contexts)/auth-provider.tsx`): `user`/`token`; `setAuth({data})` grava cookie + `localStorage.auth_user`; `signOut` limpa e vai p/ `/auth`. Restaura de cookie+localStorage no mount.
- **PeriodProvider** (`(contexts)/period-provider.tsx`) + `(hooks)/use-periods`: período financeiro selecionado → `periodId` nos GETs. Período ≠ mês civil.
- **ThemeProvider**: dark/light (`next-themes`).
- **QueryClient**: `(contexts)/index.tsx` (`queryClient` exportado p/ `invalidateQueries` fora de componente).

## Invariantes no front (espelham `02-shared-domain.md`)

| Invariante | Aplicação no front | Onde |
|---|---|---|
| Dinheiro = string decimal | exibir BRL; parsear input mascarado; nunca somar string | `(helpers)/number.ts`, `(helpers)/string.ts` |
| Datas ISO; negócio em America/Sao_Paulo | usar `FN_UTILS_DATE` (date-fns-tz); não assumir mês civil | `(helpers)/date.ts` |
| Envelope `{data}` / `{success:false,error}` | `customInstance` entrega `.data`; erro → `getErrorMessage` | `(utils)/axios-instance.ts`, `(helpers)/errors.ts` |
| Budget status `safe/attention/warning/exceeded` | cores/alertas só desses 4 | `(helpers)/budget-level.ts` |
| `periodId` opcional | repassar quando filtrar período | `PeriodProvider`/`use-periods` |
| Categoria global não editável | bloquear edit/delete quando `isGlobal` | `category.table.tsx` |
| Auth Bearer + refresh em 401 | interceptor com fila anti-corrida | `axios-instance.ts` |
| Transaction type / Recurring frequency | enums fechados (gerados) | tipos `(generated)` |

## Lacunas conhecidas (corrigir ao tocar)

- **Timezone:** ✅ resolvido (commit pós-`153b8aa`) — `(helpers)/date.ts` `FN_UTILS_DATE` (BUSINESS_TZ=America/Sao_Paulo): `today()`, `endOfBusinessDayISO()`, `formatInBusinessTZ()`, `toBusinessZoned()`. `formatEndDayDate` agora delega (deprecado). Usar `FN_UTILS_DATE` em toda data de negócio nova; não usar `new Date().toISOString()` cru.
- **Dinheiro:** `FN_UTILS_NUMBERS.formatNumberToCurrency` faz `Number().toFixed(2)` — ok p/ exibir; não usar como caminho de cálculo/soma.
- **Tipos de form vs API:** `(resources)/(schemas)` são à mão (form), legítimos; mas o que vai pra API deve casar com o tipo gerado — não derivar tipo de API do schema de form.
