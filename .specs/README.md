# 📐 Specs — Moneyly Frontend

Documentação spec-driven para recuperação de contexto, padrões e features.
Mantida manualmente. Atualizar sempre que padrão, rota ou consumo de contrato mudar.

## Índice

| Arquivo                                          | Conteúdo                                                                      |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| [01-architecture.md](01-architecture.md)         | Stack, App Router, route groups, fluxo de request, geração de contrato        |
| [02-conventions.md](02-conventions.md)           | Padrões obrigatórios (hooks gerados, forms, ⛔ anti-padrões)                  |
| [03-ui-model.md](03-ui-model.md)                 | Modelo de UI: rotas, providers, mapeamento domínio→tela, invariantes no front |
| [04-feature-playbook.md](04-feature-playbook.md) | Passo a passo para consumir feature nova do back                              |
| [05-feature-catalog.md](05-feature-catalog.md)   | Catálogo de telas existentes → arquivos + hooks                               |

## Specs compartilhados (Front ↔ Back)

Não existe raiz `moneyly/` com `.specs/` compartilhado — o contrato vive no repo irmão
`moneyly-back` (referências antigas a `../../.specs/*` eram aspiracionais e foram removidas).

- Fonte de verdade do contrato: `moneyly-back/openapi.json` (gitignored — gerar com `pnpm openapi:gen` no back).
- Invariantes de domínio: `../../moneyly-back/.specs/03-domain-model.md`.
- Handoffs back→front (o que mudou no contrato + o que o front constrói): `../../moneyly-back/.specs/front-handoff-*.md`.
- Front **não** escreve tipo de API à mão — gera via Kubb (tipos) + Orval (hooks React Query): `pnpm generate-hooks`. ⚠️ Gotcha de versão do orval — ver "Geração do contrato" em `01-architecture.md`.

## Como usar (para o assistente)

1. Antes de consumir feature nova: ler `02-conventions.md` + `04-feature-playbook.md`.
2. Mexer em tela/fluxo: ler `03-ui-model.md`.
3. Entender tela existente: `05-feature-catalog.md`.
4. Dúvida arquitetural: `01-architecture.md`.

## Regra de manutenção

Mudou padrão de código/forms → atualizar `02`.
Mudou rota/provider/mapeamento → atualizar `03`.
Nova tela → atualizar `05` e seguir `04`.
Mudou contrato → regenerar hooks (fluxo em `01-architecture.md`) + conferir handoff em `moneyly-back/.specs/`.
