'use client';

import { useGetRecurringTransactions } from '@/api/generated/hooks/recurring-transactions/recurring-transactions';
import { useAccounts } from '@/hooks/use-accounts';
import { ChevronRight, ListChecks, X } from 'lucide-react';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { pendingSetupSteps } from './setup-checklist.helpers';

const DISMISS_KEY = 'moneyly:setup-checklist-dismissed';
const listeners = new Set<() => void>();
let dismissedInMemory = false;

// Conveniência por navegador: some depois de dispensado, mas não precisa sobreviver a tudo.
const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
};

const dismiss = () => {
  try {
    localStorage.setItem(DISMISS_KEY, '1');
  } catch {
    // Storage bloqueado: some só nesta visita.
  }
  dismissedInMemory = true;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const SetupChecklist = () => {
  const dismissed = useSyncExternalStore(
    subscribe,
    () => dismissedInMemory || readDismissed(),
    () => true
  );
  const { accounts, isLoading: loadingAccounts } = useAccounts();
  const { data: recurringData, isLoading: loadingRecurring } = useGetRecurringTransactions({
    page: 1,
    limit: 100,
  });

  if (dismissed || loadingAccounts || loadingRecurring) return null;
  const steps = pendingSetupSteps(accounts, recurringData?.data ?? []);
  if (steps.length === 0) return null;

  return (
    <section
      aria-labelledby="setup-checklist-title"
      className="rounded-lg border border-primary/40 bg-primary/10 p-3"
    >
      <div className="mb-2 flex items-center gap-2">
        <ListChecks className="size-5 shrink-0 text-primary-strong" aria-hidden />
        <h2 id="setup-checklist-title" className="flex-1 text-sm font-semibold">
          Deixe o Moneyly completo
        </h2>
        <button
          type="button"
          onClick={dismiss}
          className="rounded p-1 text-muted-foreground hover:bg-primary/20 hover:text-foreground"
          aria-label="Dispensar sugestões de configuração"
        >
          <X className="size-4" />
        </button>
      </div>
      <ul className="space-y-1">
        {steps.map((step) => (
          <li key={step.key}>
            <Link
              href={step.href}
              className="flex items-center gap-2 rounded-md bg-white/80 px-3 py-2 text-sm hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
            >
              <span className="min-w-0 flex-1">{step.text}</span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
