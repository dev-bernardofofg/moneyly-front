# F7 (Front) — Registro de Horas Extras (Overtime)

**Status:** Done. Espelha `moneyly-back/.specs/features/06-overtime.md`.

---

## Rota

`/overtime` → `src/app/(routes)/(private)/overtime/page.tsx`

---

## Período

Overtime filtra por **mês civil** (`month`/`year`) derivado de `startTime`, não por `periodId` financeiro.
O front extrai `month`/`year` do `startDate` do período selecionado no `PeriodProvider`:

```ts
const d = new Date(selectedPeriod.startDate);
month = d.getMonth() + 1;
year = d.getFullYear();
```

A transaction gerada internamente pelo back recebe `periodId` financeiro normalmente — transparente pro front.

---

## Entidades consumidas

### `OvertimeRecord`

```ts
{
  id: string;
  companyId: string;
  description: string | null;
  startTime: string; // ISO UTC
  endTime: string; // ISO UTC
  hoursWorked: string; // decimal como string → parseFloat()
  hourlyRateSnapshot: string; // congelado no momento do registro
  amount: string; // hoursWorked × hourlyRateSnapshot, string
  periodId: string | null;
  transactionId: string | null;
  month: number; // 1–12, mês civil de startTime — pendente openapi update
  year: number; // ano de startTime — pendente openapi update
  company: {
    id: string;
    name: string;
  } // eager loaded
}
```

### `OvertimeSummary`

```ts
{
  periodId: string;
  totalHours: number;
  totalAmount: number;
  byCompany: {
    companyId: string;
    companyName: string;
    hours: number;
    amount: number;
  }
  [];
}
```

### `Company`

```ts
{
  id: string;
  name: string;
  hourlyRate: string;
  isActive: boolean;
}
```

---

## Hooks gerados

| Hook                    | Endpoint                | Params                           |
| ----------------------- | ----------------------- | -------------------------------- |
| `useGetOvertime`        | `GET /overtime/`        | `{ month?, year?, companyId? }`  |
| `useGetOvertimeSummary` | `GET /overtime/summary` | `{ month, year }` (obrigatórios) |
| `usePostOvertime`       | `POST /overtime/`       | body: `PostOvertimeBody`         |
| `usePutOvertimeId`      | `PUT /overtime/:id`     | body: `PutOvertimeIdBody`        |
| `useDeleteOvertimeId`   | `DELETE /overtime/:id`  | —                                |
| `useGetCompanies`       | `GET /companies/`       | —                                |
| `usePostCompanies`      | `POST /companies/`      | body: `PostCompaniesBody`        |
| `usePutCompaniesId`     | `PUT /companies/:id`    | body: `PutCompaniesIdBody`       |
| `useDeleteCompaniesId`  | `DELETE /companies/:id` | —                                |

---

## Schemas Zod

`src/app/(resources)/(schemas)/overtime.schema.tsx`

### `UpsertCompanySchema`

```ts
{ name: string (min 1), hourlyRate: string (regex decimal, positivo) }
```

### `UpsertOvertimeSchema`

```ts
{
  companyId: string (uuid),
  categoryId: string (opcional, uuid ou vazio),
  description: string (opcional),
  startTime: string (YYYY-MM-DDTHH:mm),
  endTime: string (YYYY-MM-DDTHH:mm),
}
// superRefine: new Date(endTime) > new Date(startTime)
```

---

## Componentes

### `BaseDateTimePicker`

`src/app/(components)/(bases)/(forms)/base-date-time-picker.tsx`

- Popover com calendário ShadCN (`react-day-picker v9`) + selects de hora (00–23) e minuto (múltiplos de 5)
- Cabeçalho custom (select de ano + nome do mês + prev/next) sobrepõe o nav nativo (oculto via `classNames={{ nav: 'hidden', month_caption: 'hidden' }}`)
- Valor armazenado no RHF como `"YYYY-MM-DDTHH:mm"` (sem segundos, sem Z)
- Display: `"dd/MM/yy · HH:mm"` via `format(parseISO(`${value}:00`))`
- Props: `disableFutureDates`, `disablePastDates`

### `UpsertOvertimeForm`

`src/app/(resources)/(forms)/upsert-overtime.form.tsx`

- Create / Update via `useUpsertDialog`
- Campos: `companyId` (BaseSelect), `startTime` + `endTime` (BaseDateTimePicker, grid 2 cols), preview de horas + valor, `description` (opcional), `categoryId` (opcional)
- Preview live: `calcHours(startTime, endTime)` × `selectedCompany.hourlyRate`
- Conversão: `toDatetimeLocal(iso)` no defaultValues (edit), `toISO(datetimeLocal)` no submit
- `categoryId: data.categoryId || undefined` — string vazio → omitido (back usa fallback "Salário")

### `UpsertCompanyForm`

`src/app/(resources)/(forms)/upsert-company.form.tsx`

- Campos: `name`, `hourlyRate` (string decimal)
- Invalida `getGetCompaniesQueryKey()` em success

### `OvertimeTable`

`src/app/(routes)/(private)/overtime/overtime.table.tsx`

- Colunas: Empresa (`company.name`), Data (`startTime dd/MM/yyyy`), Horário (`HH:mm → HH:mm`), Horas (`hoursWorked`, decimal→vírgula), Valor (`amount`, BRL)
- Ações: editar (BaseDialog + UpsertOvertimeForm), remover (ConfirmActionForm)
- Invalida `getGetOvertimeQueryKey()` + `getGetOvertimeSummaryQueryKey()` em success

### `CompaniesManager` (inline na page)

- Lista empresas com nome + taxa/h
- Ações: editar (BaseDialog + UpsertCompanyForm), remover (ConfirmActionForm → `useDeleteCompaniesId`)
- Botão "Nova empresa"

---

## Layout da página

```
Header
  ├── [desktop] "Empresas" (BaseDialog → CompaniesManager)
  ├── [desktop] "Nova hora extra" (BaseDialog → UpsertOvertimeForm)
  └── [mobile]  FAB → CompaniesManager | UpsertOvertimeForm

PeriodNavigatorWrapper

StaggeredFade grid-cols-2
  ├── BaseStats "Total Horas"  (totalHours, Clock)
  └── BaseStats "Total Valor"  (totalAmount, Briefcase, isMonetary)

OvertimeTable
```

---

## Invariantes / decisões front

- `amount`, `hoursWorked`, `hourlyRateSnapshot` chegam como **string** → sempre `parseFloat()` antes de usar
- `startTime`/`endTime` chegam como ISO UTC → `format(new Date(iso), ...)` para exibição
- Validação `endTime > startTime` feita no Zod (`superRefine`) antes de enviar ao back
- `categoryId` vazio é convertido para `undefined` no submit (back usa "Salário" como fallback)
- `hourlyRate` da empresa é string decimal no DB — `parseFloat(company.hourlyRate)` no preview live
- Summary usa `byCompany[]` mas **não está sendo renderizado** na UI ainda (só `totalHours` + `totalAmount`)
- Soft-delete de empresa no back (`isActive = false`) — front não distingue: `GET /companies/` já filtra ativas

---

## Não feito (v1)

- `byCompany` breakdown no summary não renderizado — oportunidade de gráfico por empresa
- Filtro por `companyId` na listagem não exposto na UI
- Exportar horas como CSV (análogo ao transactions export)
