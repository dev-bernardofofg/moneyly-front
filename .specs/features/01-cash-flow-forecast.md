# F1 / F21 (Front) — Saldo Livre e check-in

**Status:** Done. Espelha `moneyly-back/.specs/features/01-cash-flow-forecast.md`.
Contrato: `GET /overview/forecast` → `ForecastResponse` (`{ freeBalance }`, sempre para hoje, sem
`periodId`). `GET /overview/planner` foi removido.

Regra geral: nenhuma fórmula financeira no front. Componentes exibem os valores do contrato.

## UI

### `/dashboard`

- Seção principal "Saldo Livre" (`dashboard/free-balance-section.tsx`): valor, data limite (`until`),
  frescor das contas (`dashboard/freshness.helpers.ts`), próximo pagamento (salário + horas), já
  comprometido depois (`committedAfter`), confiança e link "Ver como é calculado" para `/insights`.
- Botões "Fazer check-in" (vai a `/check-in`) e "Registrar horas" (abre o form de hora extra em dialog, sem
  sair da home). O modo `compact` esconde frescor e botões e é usado na prévia do onboarding.
- Estados de carregamento e erro.

### `/check-in`

Tela de rotina semanal (`check-in/page.tsx`, estado em `check-in.action.tsx`, helpers puros em
`check-in.helpers.ts`).

1. O usuário solta ou escolhe vários `.ofx` e `.pdf`. Cada arquivo faz uma prévia por chamada
   (`usePostTransactionsImportPreview`).
2. Conta conhecida pelo `accountKey` segue sozinha; conta nova é perguntada uma vez e salva na confirmação.
3. Só viram exceção as linhas sem categoria identificada e as `possible_duplicate`
   (`check-in-review.tsx`). O resto entra com um clique em confirmar.
4. Arquivo não reconhecido falha sozinho e os demais continuam. Falha ao confirmar mantém a revisão para
   nova tentativa. Reenviar o mesmo arquivo não duplica, pelo `external_id`.
5. A tela final mostra Saldo Livre antes e depois e o resultado por arquivo.

A lista de contas da tela mostra o frescor e leva a `/accounts` para corrigir o saldo. Sem conta ativa, a
tela pede para cadastrar uma.

### `/insights` ("Gastos")

- Seção "Como o Saldo Livre é calculado" (`insights/free-balance-breakdown-section.tsx`) no topo, com as
  linhas de `freeBalance.components`: saldo das contas, outras entradas previstas, contas recorrentes a
  pagar e faturas a pagar.
- Mensagens determinísticas em `insights/free-balance-messages.ts` (texto fixo + valores do contrato).
  Sem IA.

### Onboarding

- `InitialConfigDialog` é um wizard de 3 etapas: renda e ciclo (obrigatória), primeiras recorrentes
  (opcional, aceita vários itens) e prévia do Saldo Livre. "Configurar depois" disponível na etapa opcional.
- A prévia refaz o forecast ao montar. Orçamento e meta saíram do wizard.

### Navegação

`components/layout/navigation.ts`: principal = Início, Check-in, Transações, Horas Extras. "Mais" = Gastos
(`/insights`), Recorrentes, Contas e cartões, Categorias e Perfil. Não há `/planner`.

## Cache

`freeBalanceQueryKeys()` (`src/api/free-balance-query-keys.ts`) invalida forecast, dashboard e contas.
Usado após mutações que mudam o saldo (transação, recorrência, conta, transferência e hora extra) e ao concluir o onboarding. O check-in invalida também
transações, resumo, faturas e transferências.

## Contrato consumido (gerado)

- `ForecastResponse`: `freeBalance{total,until,confidence,components{accountsBalance,otherIncome,
recurringExpense,cardBills},nextPayment,committedAfter}`.
- `Account`: `dataThrough` e `freshness`.
- Dinheiro em centavos (inteiro); o front só converte na exibição.

## Testes

Vitest + Testing Library: `free-balance-section`, `free-balance-breakdown-section` (inclui mensagens),
`freshness.helpers`, `check-in` e `check-in.helpers`, `navigation`, `initial-config-dialog`.

## Contas e cartões (F12)

- `/accounts`: CRUD de contas e cartões (`upsert-account.form.tsx`); cartão pede fechamento e
  vencimento. Spec do contrato: `moneyly-back/.specs/features/12-accounts-and-cards.md`.
- Transação tem seletor de conta (vazio = conta padrão); `/transactions` filtra por conta e
  mostra a coluna Conta (`useAccounts` em `src/hooks/use-accounts.ts`).
- Compra no cartão aparece no período do vencimento da fatura: o front só exibe, o back calcula.
