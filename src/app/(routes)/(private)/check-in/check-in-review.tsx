'use client';

import { BaseButton } from '@/components/clickable/base-button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FN_UTILS_DATE } from '@/lib/date';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import { cn } from '@/lib/utils';
import {
  type CheckInFile,
  type CheckInStatus,
  describeImportResult,
  describePreview,
  hasMissingCategory,
} from './check-in.helpers';
import { ImportCategoryPicker } from './import-category-picker';
import { type ImportRowState } from './import-statement.helpers';

const STATUS_LABEL: Record<CheckInStatus, string> = {
  previewing: 'Lendo...',
  needsAccount: 'Escolha a conta',
  ready: 'Pronto',
  review: 'Revisar',
  failed: 'Erro',
  confirming: 'Importando...',
  done: 'Importado',
  confirmFailed: 'Não importado',
};

const REMOVABLE: CheckInStatus[] = ['needsAccount', 'ready', 'review', 'failed', 'confirmFailed'];

const money = FN_UTILS_NUMBERS.formatCurrency;

interface CheckInReviewProps {
  file: CheckInFile;
  disabled: boolean;
  onChooseCategory: (title: string, categoryId: string) => void;
  onChooseMode: (externalId: string, mode: ImportRowState['mode']) => void;
}

export const CheckInReview = ({
  file,
  disabled,
  onChooseCategory,
  onChooseMode,
}: CheckInReviewProps) => {
  const items = (file.preview?.items ?? []).filter((item) =>
    file.exceptionIds.includes(item.externalId)
  );

  return (
    <ul className="divide-y rounded-lg border" aria-label={`Exceções de ${file.source.name}`}>
      {items.map((item) => {
        const row = file.rows[item.externalId]!;
        const isDuplicate = item.status === 'possible_duplicate';
        return (
          <li key={item.externalId} className="grid gap-3 p-3 sm:grid-cols-[1fr_14rem]">
            <div className="min-w-0 space-y-1 text-sm">
              <p className="flex flex-wrap items-center gap-2">
                <span className="tabular-nums text-muted-foreground">
                  {FN_UTILS_DATE.formatInBusinessTZ(item.date, 'dd/MM')}
                </span>
                <span className="truncate font-medium">{item.title}</span>
              </p>
              <p
                className={cn(
                  'font-semibold tabular-nums',
                  item.type === 'expense' ? 'text-expense' : 'text-income'
                )}
              >
                {item.type === 'expense' ? '−' : '+'} {money(item.amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                {isDuplicate
                  ? 'Parece um lançamento que já está no app.'
                  : 'Sem categoria definida. Se não escolher, fica em Outros.'}
              </p>
            </div>

            <div className="space-y-2">
              {isDuplicate && (
                <fieldset className="space-y-1 text-sm" disabled={disabled}>
                  <legend className="sr-only">Como tratar {item.title}</legend>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`${file.id}-${item.externalId}`}
                      checked={row.mode === 'link'}
                      onChange={() => onChooseMode(item.externalId, 'link')}
                    />
                    Vincular ao lançamento
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`${file.id}-${item.externalId}`}
                      checked={row.mode === 'create'}
                      onChange={() => onChooseMode(item.externalId, 'create')}
                    />
                    Criar novo lançamento
                  </label>
                </fieldset>
              )}
              {row.mode === 'create' && (
                <ImportCategoryPicker
                  label={item.title}
                  value={row.categoryId}
                  disabled={disabled}
                  onChange={(categoryId) => onChooseCategory(item.title, categoryId)}
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const BillSummary = ({ file }: { file: CheckInFile }) => {
  const { bill, items } = file.preview!;
  if (!bill) return null;

  const rowsTotal = items
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0);

  return (
    <div className="rounded-md border p-3 text-sm">
      <p>
        Fatura com vencimento em{' '}
        <span className="font-medium">
          {FN_UTILS_DATE.formatInBusinessTZ(bill.dueDate, 'dd/MM/yyyy')}
        </span>
        {bill.total != null && (
          <>
            {' · total '}
            <span className="font-medium">{money(bill.total)}</span>
          </>
        )}
        . Todas as linhas contam nessa fatura, inclusive parcelas de compras antigas.
      </p>
      {items.length > 0 && bill.total != null && bill.total !== rowsTotal && (
        <p role="alert" className="mt-1 text-expense">
          A soma das compras lidas ({money(rowsTotal)}) não bate com o total da fatura. Confira
          antes de importar.
        </p>
      )}
    </div>
  );
};

interface CheckInFileCardProps extends Omit<CheckInReviewProps, 'disabled'> {
  busy: boolean;
  accountOptions: { label: string; value: string }[];
  accountName?: string;
  onChooseAccount: (accountId: string) => void;
  onRetry: () => void;
  onRemove: () => void;
}

export const CheckInFileCard = ({
  file,
  busy,
  accountOptions,
  accountName,
  onChooseAccount,
  onChooseCategory,
  onChooseMode,
  onRetry,
  onRemove,
}: CheckInFileCardProps) => {
  const { preview, status, error, result } = file;
  const name = file.source.name;
  const missingCategory = hasMissingCategory(file);
  const showRows = status !== 'needsAccount' && status !== 'previewing' && preview !== null;

  return (
    <li aria-label={`Arquivo ${name}`} className="space-y-3 rounded-xl border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{name}</p>
        <Badge variant={error ? 'destructive' : 'outline'}>{STATUS_LABEL[status]}</Badge>
        {REMOVABLE.includes(status) && (
          <BaseButton type="button" size="sm" variant="ghost" disabled={busy} onClick={onRemove}>
            Remover
          </BaseButton>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-expense">
          {error}
        </p>
      )}

      {status === 'needsAccount' && (
        <div className="space-y-1">
          <Select value="" disabled={busy} onValueChange={onChooseAccount}>
            <SelectTrigger aria-label={`Conta de ${name}`}>
              <SelectValue placeholder="Escolha a conta" />
            </SelectTrigger>
            <SelectContent>
              {accountOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Conta nova neste arquivo. Depois de importar, o Moneyly a reconhece sozinho.
          </p>
        </div>
      )}

      {preview?.bill && status !== 'done' && <BillSummary file={file} />}

      {showRows && (
        <p className="text-sm text-muted-foreground">
          {[accountName, describePreview(preview.items)].filter(Boolean).join(' · ')}
        </p>
      )}

      {result && <p className="text-sm text-muted-foreground">{describeImportResult(result)}</p>}

      {file.exceptionIds.length > 0 && status !== 'done' && status !== 'needsAccount' && (
        <CheckInReview
          file={file}
          disabled={busy}
          onChooseCategory={onChooseCategory}
          onChooseMode={onChooseMode}
        />
      )}

      {missingCategory && status !== 'done' && (
        <p role="alert" className="text-sm text-expense">
          Escolha a categoria de todas as linhas para importar este arquivo.
        </p>
      )}

      {status === 'confirmFailed' && (
        <BaseButton
          type="button"
          size="sm"
          variant="outline"
          disabled={busy || missingCategory}
          onClick={onRetry}
        >
          Tentar novamente
        </BaseButton>
      )}
    </li>
  );
};
