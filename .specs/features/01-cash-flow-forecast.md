# F1 (Front) — Saldo Livre e projeção

**Status:** Done. Espelha `moneyly-back/.specs/features/01-cash-flow-forecast.md`.
Contratos: `GET /overview/forecast?periodId=<uuid?>` → `ForecastResponse` e
`GET /overview/planner?periodId=<uuid?>` → `PlannerOverview`.

Regra geral: nenhuma fórmula financeira no front. Componentes exibem os valores do contrato.

## UI

### `/dashboard`

- Seção principal "Saldo Livre" (`dashboard/free-balance-section.tsx`), antes dos indicadores.
- Exibe valor disponível, dias restantes, confiança, renda fixa/variável, contas recorrentes e
  reservas de orçamento/metas. Estados de carregamento e erro.

### `/insights`

- Seção "Como o Saldo Livre é calculado" (`insights/free-balance-breakdown-section.tsx`) no topo.
- Linhas de `freeBalance.components` com sinal (+/−) até o total; saldo realizado negativo aparece
  como subtração. Período encerrado rotula o total como "Saldo Livre ao fim do período".
- Lista de `projected.occurrences` (data, título, valor) ou mensagem quando vazia.
- Mensagens determinísticas em `insights/free-balance-messages.ts` (texto fixo + valores do
  contrato): contas futuras, reservas, horas extras, horas extras pendentes, causa de saldo
  negativo, período encerrado. Sem IA.

### `/planner`

- Seção "Impacto no Saldo Livre" (`planner/free-balance-impact-section.tsx`) com
  `freeBalanceImpact.total`, `budgetReserve` e `goalReserve`. Estados de carregamento, erro e vazio.
- `usePlannerAction` envia o `periodId` selecionado.

### Onboarding

- `InitialConfigDialog` é um wizard de 5 etapas: renda e ciclo (obrigatória), contas recorrentes,
  primeiro orçamento, meta (opcionais, aceitam vários itens) e prévia do Saldo Livre.
- Reusa os forms existentes via `onSaved` do `useUpsertDialog` (não fecha o dialog do wizard).
- "Configurar depois" disponível nas etapas opcionais. A prévia refaz o forecast ao montar.

## Cache

`freeBalanceQueryKeys()` (`src/api/free-balance-query-keys.ts`) invalida planner, forecast e
dashboard. Usado após mutações de orçamento, meta, contribuição em meta e recorrência, e ao
concluir o onboarding.

## Contrato consumido (gerado)

- `ForecastResponse`: `period`, `realized`, `projected`, `projectedEndBalance`,
  `freeBalance{total,daysRemaining,confidence,income,commitments,reserves,components}` e `asOf`.
- `PlannerOverview`: `stats`, `currentPeriod{id,startDate,endDate,description}`,
  `freeBalanceImpact{budgetReserve,goalReserve,total}`, `alerts`.
- Dinheiro = `number`.

## Testes

Vitest + Testing Library: `free-balance-section`, `free-balance-breakdown-section` (inclui
mensagens), `free-balance-impact-section`, `initial-config-dialog`.

## Contas e cartões (F12)

- `/accounts`: CRUD de contas e cartões (`upsert-account.form.tsx`); cartão pede fechamento e
  vencimento. Spec do contrato: `moneyly-back/.specs/features/12-accounts-and-cards.md`.
- Transação tem seletor de conta (vazio = conta padrão); `/transactions` filtra por conta e
  mostra a coluna Conta (`useAccounts` em `src/hooks/use-accounts.ts`).
- Importar extrato exige escolher a conta ou o cartão do arquivo.
- Compra no cartão aparece no período do vencimento da fatura: o front só exibe, o back calcula.
