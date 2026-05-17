# 04 — Playbook: Consumir Feature do Back

Ordem canônica para o front consumir contrato novo/alterado. Top-down (contrato → tela).
Exemplo de referência: módulo **transactions** (`(routes)/(private)/transactions/`).

## 0. Antes

- Ler `02-conventions.md`. Se mexe em rota/fluxo, ler/atualizar `03-ui-model.md`.
- Conferir feature em `../../.specs/03-feature-roadmap.md` (status Back). Front só avança se Back = Done. Breaking ⚠️ → não mergear até alinhar.
- Spec de UI da feature: `moneyly-front/.specs/features/<n>-<slug>.md` (criar se não existir).

## 1. Obter contrato atualizado

- Garantir `openapi.json` fresh (ver decisão de distribuição em `../../.specs/04-sync-protocol.md`).
- `pnpm generate-hooks` (Kubb + Orval) → regenera `(resources)/(generated)/{types,zod,schemas,hooks}`.
- **Não editar nada em `(generated)`.** Se o tipo está errado, o `openapi.json`/back está errado — corrigir lá.

## 2. Conferir o gerado

- Tipos/enums em `(generated)/types/`, zod em `(generated)/zod/`, hooks em `(generated)/hooks/<tag>/<tag>.ts`.
- Identificar `useGetX`/`usePostXCreate`/`getGetXQueryKey` da feature.

## 3. Schema de formulário (se há input)

- `(resources)/(schemas)/<x>.schema.tsx`: zod de UX (mensagens PT, moeda como string mascarada).
- No submit, mapear para o tipo gerado (ex.: `amount` string → number).

## 4. Form

- `(resources)/(forms)/upsert-<x>.form.tsx`: RHF + `zodResolver`, create/edit por `id`.
- Mutação: hook gerado + `onSuccess` (toast, `invalidateQueries`, reset, fechar) + `onError` (`getErrorMessage`, `setFormFieldErrors`).

## 5. Tela

- `(routes)/(private)/<rota>/page.tsx` + `<rota>.table.tsx` (BaseTable) + `<rota>.utils.ts` se preciso.
- Query gerado com `params` (paginação `use-pagination`, `periodId` do `PeriodProvider`).
- Estados: loading/empty/error. Dinheiro via `FN_UTILS_NUMBERS`; datas em America/Sao_Paulo.

## 6. Navegação

- Adicionar rota em `(utils)/routes.ts` (`ROUTES.*`); link no sidebar/header se for top-level. Rota privada coberta por `middleware.ts`.

## 7. Docs

- Atualizar `05-feature-catalog.md` (tela → arquivos + hooks) e `03-ui-model.md` (rota/invariante).
- Atualizar status Front em `../../.specs/03-feature-roadmap.md`.

## Checklist final

- [ ] Zero tipo de API à mão (tudo de `(generated)`)
- [ ] Hooks regenerados do contrato atual (`pnpm generate-hooks`)
- [ ] Sem axios/fetch cru; só hook + `customInstance`
- [ ] Mutação invalida queries afetadas
- [ ] Dinheiro string-decimal tratado (sem somar string)
- [ ] Datas/período em America/Sao_Paulo (sem assumir mês civil)
- [ ] Envelope respeitado (data/erro)
- [ ] Categoria global não editável; budget status nos 4 enums
- [ ] Specs front + `03-feature-roadmap` atualizados
- [ ] Commit só após confirmação do usuário (sem `Co-Authored-By`)
