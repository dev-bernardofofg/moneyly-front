# 02 — Convenções de Código (OBRIGATÓRIAS)

SOLID + Clean Code + WCAG. Código/identificadores em inglês; textos de UI e specs em **português**.
**Este arquivo é a fonte única dos padrões. `04` referencia, não repete.**

## ⛔ Proibido (anti-padrões — checar sempre)

- **Escrever tipo de API à mão** (request/response, params, enums de domínio) → usar SEMPRE o gerado em `(resources)/(generated)/{types,zod}`. Se falta tipo, regenerar do `openapi.json`, não digitar.
- **Editar arquivo em `(resources)/(generated)/`** → é sobrescrito por `pnpm generate-hooks`. Mudança real vai no back → regenera.
- **`fetch`/`axios` cru numa tela** → usar hook gerado (`useGetX`/`usePostX...`) + `customInstance`. Nada de instância axios nova.
- **Criar outra instância axios / baseURL hardcoded** → só `src/app/(utils)/axios-instance.ts` (`NEXT_PUBLIC_API_URL`).
- **Mutação sem `invalidateQueries`** das queries afetadas → cache fica velho.
- **Somar/comparar dinheiro como string ou como float do input** → API manda **string decimal**; converter com helper (`FN_UTILS_STRING.formatCurrentStringToNumber`) só na borda; nunca `"1.50" + "2"`.
- **`new Date()` / `.toISOString()` cru para data de negócio** → usar `FN_UTILS_DATE` (`(helpers)/date.ts`, BUSINESS_TZ=America/Sao_Paulo); não assumir mês civil 1–31, usar `periodId`/período do `PeriodProvider`.
- **Assumir mês civil** em filtros/labels de período → período financeiro ≠ mês (ver `../../.specs/02-shared-domain.md`).
- **Ler `response` sem respeitar o envelope** → sucesso vem em `data`; erro em `error`/`details`. `customInstance` já entrega `.data`; não reembrulhar.
- **Schema Zod de formulário usado como tipo de API** → `(resources)/(schemas)` valida **input do form**; ao submeter, mapear para o tipo gerado.
- **Editar/deletar categoria global no UI** (`isGlobal=true`/`userId=null`) → bloquear ação.
- **Mapear cor/alerta de budget fora do enum** `safe|attention|warning|exceeded` → usar tokens centralizados (`(helpers)/budget-level.ts`).
- **Commit sem confirmação do usuário ou com `Co-Authored-By`.**

## Consumo de API (regra de ouro)

- 1 hook gerado por endpoint, namespace por tag: `(resources)/(generated)/hooks/<tag>/<tag>.ts`.
- Query: `useGetX(params, { query: { ...opts } })`. Mutação: `usePostXCreate({ mutation: { onSuccess, onError } })`.
- `onSuccess` → `toast.success(...)` + `queryClient.invalidateQueries({ queryKey: getGetXQueryKey() })` + `form.reset()` + fechar dialog.
- `onError: (e: CustomAxiosError)` → `toast.error(getErrorMessage(e))` + `setFormFieldErrors(e, form.setError, [campos])`.
- Paginação: `use-pagination` + params `page`/`limit`; ler `pagination` do envelope paginado.
- Filtro por período: repassar `periodId` (do `PeriodProvider`) quando o endpoint aceitar.

## Forms

- `useForm<T>({ resolver: zodResolver(Schema), defaultValues })` com `Schema` de `(resources)/(schemas)/*.schema.tsx`.
- Schema de form valida UX (mensagens PT, máscara de moeda em string `"1.234,56"`). No submit, converter para o shape do tipo gerado (ex.: `amount` → number via `FN_UTILS_STRING`).
- Form de upsert reutilizável: 1 arquivo `upsert-<x>.form.tsx`, modo create/edit por presença de `id`.
- Erro de API mapeia para campo via `setFormFieldErrors`.

## Dinheiro / datas

- API ⇄ front: dinheiro é **string decimal** (`"1234.50"`, `"0"`). Exibir BRL com `FN_UTILS_NUMBERS`; parsear input mascarado com `FN_UTILS_STRING`.
- Datas no transporte = ISO string. Exibição/lógica de período em **America/Sao_Paulo** (`date-fns-tz`). `date-fns-tz` está instalado — usar de fato; não tratar data de negócio como UTC local.
- Nunca `toFixed` em soma de valores vindos como string sem converter antes.

## Componentes

- Telas em `(routes)/(private|public)/<rota>/page.tsx`. Tabela colocalizada: `<rota>.table.tsx` (+ `<rota>.utils.ts`) usando `BaseTable` de `(components)/(bases)/(tables)`.
- Componentes compostos reutilizáveis em `(components)/(bases)/(<categoria>)/`. Primitivos shadcn em `src/components/ui/`.
- Rotas nomeadas em `(utils)/routes.ts` (`ROUTES.*`) — não hardcodar string de path.
- A skill `gft` é de outro projeto (TanStack Router/Table); **não** é o gerador do moneyly-front. Padrão aqui = `page.tsx` + `<feature>.table.tsx` colocalizados + hooks Orval.

## Idioma & commits

- UI/erros/specs em português. Identificadores em inglês.
- Conventional Commits em inglês, 1 por feature, corpo proporcional. **Nunca commitar sem confirmação explícita. Sem `Co-Authored-By`.**
- `git user.name`: `dev-bernardofofg` / email `dev.bernardofofg@gmail.com` (verificar antes de commitar).
