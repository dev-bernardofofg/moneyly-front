# 📐 Specs — Moneyly Frontend

Documentação spec-driven para recuperação de contexto, padrões e features.
Mantida manualmente. Atualizar sempre que padrão, rota ou consumo de contrato mudar.

## Índice

| Arquivo | Conteúdo |
|---|---|
| [01-architecture.md](01-architecture.md) | Stack, App Router, route groups, fluxo de request, geração de contrato |
| [02-conventions.md](02-conventions.md) | Padrões obrigatórios (hooks gerados, forms, ⛔ anti-padrões) |
| [03-ui-model.md](03-ui-model.md) | Modelo de UI: rotas, providers, mapeamento domínio→tela, invariantes no front |
| [04-feature-playbook.md](04-feature-playbook.md) | Passo a passo para consumir feature nova do back |
| [05-feature-catalog.md](05-feature-catalog.md) | Catálogo de telas existentes → arquivos + hooks |

## Specs compartilhados (Front ↔ Back)

Contrato entre `moneyly-back` e `moneyly-front` fica em `../../.specs/` (raiz `moneyly/`).
- Fonte de verdade do contrato: `moneyly-back/openapi.json`.
- Front **não** escreve tipo de API à mão — gera via Kubb (tipos+Zod) + Orval (hooks React Query): `pnpm generate-hooks`.
- Mudou endpoint/payload → atualizar `../../.specs/01-api-contract.md` e regenerar. Mudou invariante de domínio → `../../.specs/02-shared-domain.md`.

## Como usar (para o assistente)

1. Antes de consumir feature nova: ler `02-conventions.md` + `04-feature-playbook.md`.
2. Mexer em tela/fluxo: ler `03-ui-model.md`.
3. Entender tela existente: `05-feature-catalog.md`.
4. Dúvida arquitetural: `01-architecture.md`.

## Regra de manutenção

Mudou padrão de código/forms → atualizar `02`.
Mudou rota/provider/mapeamento → atualizar `03`.
Nova tela → atualizar `05` e seguir `04`.
Mudou contrato → regenerar hooks + sincronizar `../../.specs/`.
