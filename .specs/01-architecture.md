# 01 — Arquitetura

> **Âncora:** sincronizado em commit `153b8aa`. Se HEAD divergiu e mexeu em `src/app/` ou nos configs de geração, releia antes de confiar.

## Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **UI:** TailwindCSS 4 + Shadcn UI (`src/components/ui/`) + lucide-react
- **Estado servidor:** TanStack Query 5 (hooks **gerados** pelo Orval)
- **HTTP:** axios (instância única `src/app/(utils)/axios-instance.ts`)
- **Forms:** react-hook-form + zod (`@hookform/resolvers`)
- **Geração de contrato:** Kubb 4.33 (tipos TS + Zod) + Orval 8.5 (hooks React Query) — `pnpm generate-hooks`
- **Gráficos:** recharts · **Datas:** date-fns + date-fns-tz · **URL state:** nuqs
- **Auth Google:** `@react-oauth/google` · **Toaster:** sonner
- **Package manager:** pnpm · **Dev:** `pnpm dev` porta **5173**

## App Router — route groups

Base: `src/app/`. Pastas `(grupo)` não viram segmento de URL.

| Grupo | Papel |
|---|---|
| `(routes)/(private)/` | Telas autenticadas: `dashboard`, `transactions`, `categories`, `recurring-transactions`, `planner`, `profile`. `layout.tsx` = `PrivateLayout`. |
| `(routes)/(public)/` | `auth` (sign-in/sign-up). `layout.tsx` = `PublicLayout`. |
| `(resources)/(generated)/` | ⚠️ **Gerado por Kubb+Orval** — `types/`, `zod/`, `schemas/`, `hooks/<tag>/`. Nunca editar à mão. |
| `(resources)/(forms)/` | Forms `upsert-*.form.tsx` (RHF + zod) + `confirm-action.tsx`, `transaction.tabs.tsx`. |
| `(resources)/(schemas)/` | Zod **de formulário** escrito à mão (`*.schema.tsx`). NÃO é tipo de API. |
| `(components)/(bases)/(x)/` | Biblioteca de componentes compostos (cards, charts, forms, tables, stats, swipers...). |
| `(contexts)/` | Providers: `auth-provider`, `period-provider`, `theme-provider`, `index.tsx` (raiz). |
| `(helpers)/` | `number.ts` (BRL), `string.ts` (parse moeda), `errors.ts`, `budget-level.ts`. |
| `(hooks)/` + `src/hooks/` | Hooks de app (`use-periods`, `use-pagination`, `use-disclosure`...). |
| `(utils)/` | `axios-instance.ts`, `cookies.ts`, `routes.ts`, `env.ts`. |
| `(layouts)/` | `private-layout.tsx`, `public-layout.tsx`. |

`src/middleware.ts` = guarda de rota (cookie `auth_token`). `src/lib/utils.ts` = `cn()`.

## Fluxo de um request (tela → API)

```
Componente/página
  → hook gerado (Orval): useGetX / usePostXCreate  (src/app/(resources)/(generated)/hooks/<tag>)
  → customInstance (axios-instance.ts)              # injeta Bearer, refresh 401, formata erro
  → API back (NEXT_PUBLIC_API_URL, default :5000)
  ← envelope { data } | { success:false, error }
  → hook devolve response.data (customInstance já desembrulha .data do axios)
  → onSuccess: invalidateQueries(getGetXQueryKey())  # revalida cache
```

- Mutação sempre invalida as queries afetadas via `queryClient.invalidateQueries({ queryKey: getGetXQueryKey() })`.
- Erro de API → `customInstance` rejeita `{ status, message, data }`; tela usa `getErrorMessage` / `setFormFieldErrors`.

## Geração do contrato

```
moneyly-back (código) → openapi.json → [Kubb] tipos+Zod → [Orval] hooks React Query
```

- Configs: `kubb.config.ts` (input `./openapi.json` → `(resources)/(generated)/{types,zod}`), `orval.config.ts` (mode `tags-split`, client react-query, mutator = `customInstance`, `staleTime: 10000`).
- **Hoje os dois configs apontam `./openapi.json` LOCAL** (cópia commitada na raiz do front), não `../moneyly-back/openapi.json`. Ver decisão pendente em `../../.specs/04-sync-protocol.md`.
- Regeneração: `pnpm generate-hooks`.

## Infraestrutura

- **Providers (raiz):** `(contexts)/index.tsx` → `QueryClientProvider` > `NuqsAdapter` > `GoogleOAuthProvider` > `AuthProvider` > `ThemeProvider` > `PeriodProvider`.
- **Auth:** token em cookie `auth_token` + `refresh_token`; `auth_user` em `localStorage`. Refresh automático no interceptor 401 (com fila anti-corrida).
- **Guarda de rota:** `middleware.ts` (Edge) — sem token + rota privada → `/auth`; com token + `/auth` → `/dashboard`.
- **Período financeiro:** `PeriodProvider` + `use-periods` — seleção de período propagada como `periodId` nos GETs.
- **PWA:** metadata + ícones (`scripts/generate-pwa-icons.js`), `use-pwa`.
