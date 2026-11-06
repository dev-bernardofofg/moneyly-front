'use client';

import { Section } from '@/components/cards/section';
import { BaseButton } from '@/components/clickable/base-button';
import { Header } from '@/components/layout/header';
import { Fade } from '@/components/motions/fade';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Account } from '@/api/generated/types/Account';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { CircleCheck, Landmark } from 'lucide-react';
import Link from 'next/link';
import { type ChangeEvent, type DragEvent, useState } from 'react';
import { describeAccount } from '../dashboard/freshness.helpers';
import { type FreeBalanceChange, useCheckInAction } from './check-in.action';
import {
  type CheckInFile,
  confirmableFiles,
  describeImportResult,
  summarizeFiles,
} from './check-in.helpers';
import { CheckInFileCard } from './check-in-review';

const money = FN_UTILS_NUMBERS.formatCurrency;

const describeProgress = (files: CheckInFile[], importing: boolean, finished: boolean) => {
  if (finished) return 'Check-in concluído.';
  if (importing) return 'Importando arquivos...';
  if (files.some((file) => file.status === 'previewing')) return 'Lendo arquivos...';
  if (files.length === 0) return '';

  const { ready, review, failed } = summarizeFiles(files);
  return `Prontos: ${ready} · Para revisar: ${review} · Com erro: ${failed}`;
};

const NoActiveAccount = () => (
  <Section Icon={Landmark} title="Nenhuma conta ativa">
    <div className="space-y-3 py-2 text-sm text-muted-foreground">
      <p>Cadastre uma conta ou cartão para receber os extratos.</p>
      <Link href={ROUTES.ACCOUNTS} className={buttonVariants({ variant: 'default' })}>
        Cadastrar conta
      </Link>
    </div>
  </Section>
);

interface FinalSummaryProps {
  balance: FreeBalanceChange;
  files: CheckInFile[];
  onRestart: () => void;
}

const FinalSummary = ({ balance, files, onRestart }: FinalSummaryProps) => (
  <Section Icon={CircleCheck} title="Check-in concluído">
    <div className="space-y-4 py-2">
      <dl className="space-y-1 rounded-xl bg-primary/10 p-4">
        {balance.before !== null && (
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-slate-600 dark:text-slate-300">Saldo Livre antes</dt>
            <dd className="font-medium tabular-nums">{money(balance.before)}</dd>
          </div>
        )}
        {balance.after !== null && (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-sm text-slate-600 dark:text-slate-300">Saldo Livre depois</dt>
            <dd className="text-2xl font-bold tabular-nums">{money(balance.after)}</dd>
          </div>
        )}
      </dl>
      {balance.after === null && (
        <p role="alert" className="text-sm text-expense-strong">
          Importação concluída, mas não foi possível atualizar o Saldo Livre.
        </p>
      )}

      <ul className="space-y-1 text-sm">
        {files.map((file) => (
          <li key={file.id}>
            <span className="font-medium">{file.source.name}: </span>
            <span className="text-muted-foreground">
              {file.result ? describeImportResult(file.result) : file.error}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        <Link href={ROUTES.DASHBOARD} className={buttonVariants({ variant: 'default' })}>
          Ir para o início
        </Link>
        <BaseButton type="button" variant="outline" onClick={onRestart}>
          Novo check-in
        </BaseButton>
      </div>
    </div>
  </Section>
);

interface FileDropZoneProps {
  busy: boolean;
  onFiles: (files: File[]) => void;
}

const FileDropZone = ({ busy, onFiles }: FileDropZoneProps) => {
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    // Limpar o value esvazia o FileList; copiar antes permite reenviar o mesmo arquivo.
    const selected = Array.from(event.target.files ?? []);
    event.target.value = '';
    onFiles(selected);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!busy) onFiles(Array.from(event.dataTransfer.files));
  };

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className={cn(
        'rounded-xl border-2 border-dashed transition-colors hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-ring',
        busy && 'opacity-60'
      )}
    >
      <label
        htmlFor="check-in-files"
        className="block cursor-pointer p-8 text-center text-sm font-medium"
      >
        Solte os extratos aqui ou clique para escolher
        <span className="block text-xs font-normal text-muted-foreground">
          Arquivos .ofx ou .pdf. Pode enviar vários de uma vez.
        </span>
      </label>
      <input
        id="check-in-files"
        type="file"
        multiple
        accept=".ofx,.pdf,application/x-ofx,application/pdf"
        disabled={busy}
        onChange={handleInput}
        className="sr-only"
      />
    </div>
  );
};

const AccountsFreshness = ({ accounts }: { accounts: Account[] }) => {
  const [today] = useState(() => new Date());

  return (
    <Section Icon={Landmark} title="Contas">
      <div className="space-y-3 py-2 text-sm">
        <ul className="space-y-1">
          {accounts.map((account) => (
            <li key={account.id}>{describeAccount(account, today)}</li>
          ))}
        </ul>
        <Link
          href={ROUTES.ACCOUNTS}
          className="font-medium text-primary-strong underline-offset-2 hover:underline"
        >
          Corrigir saldo
        </Link>
      </div>
    </Section>
  );
};

const CheckInPage = () => {
  const {
    files,
    busy,
    importing,
    finished,
    balance,
    activeAccounts,
    accountsLoading,
    accountsError,
    accountOptions,
    nameById,
    addFiles,
    chooseAccount,
    chooseCategory,
    chooseMode,
    removeFile,
    confirmAll,
    retryFile,
    restart,
  } = useCheckInAction();

  const flow = (
    <>
      <FileDropZone busy={busy} onFiles={addFiles} />

      {files.length > 0 && (
        <>
          <ul className="space-y-3" aria-label="Arquivos do check-in">
            {files.map((file) => (
              <CheckInFileCard
                key={file.id}
                file={file}
                busy={busy}
                accountOptions={accountOptions}
                accountName={nameById.get(file.preview?.accountId ?? '')}
                onChooseAccount={(accountId) => chooseAccount(file, accountId)}
                onChooseCategory={(title, categoryId) => chooseCategory(file.id, title, categoryId)}
                onChooseMode={(externalId, mode) => chooseMode(file.id, externalId, mode)}
                onRetry={() => retryFile(file)}
                onRemove={() => removeFile(file.id)}
              />
            ))}
          </ul>

          <BaseButton
            type="button"
            className="w-full"
            disabled={busy || confirmableFiles(files).length === 0}
            isLoading={importing}
            onClick={confirmAll}
          >
            Importar
          </BaseButton>
        </>
      )}

      <AccountsFreshness accounts={activeAccounts} />
    </>
  );

  return (
    <Fade>
      <Header title="Check-in" />
      <div className="min-h-0 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl space-y-4 p-4 pb-20 md:pb-4">
          <p aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
            {describeProgress(files, importing, finished)}
          </p>

          {accountsLoading ? (
            <Skeleton className="h-40 w-full" aria-label="Carregando contas" />
          ) : accountsError ? (
            <p role="alert" className="text-sm text-expense-strong">
              Não foi possível carregar as contas.
            </p>
          ) : activeAccounts.length === 0 ? (
            <NoActiveAccount />
          ) : finished && balance ? (
            <FinalSummary balance={balance} files={files} onRestart={restart} />
          ) : (
            flow
          )}
        </div>
      </div>
    </Fade>
  );
};

export default CheckInPage;
