import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InitialConfigDialog } from '@/components/dialogs/initial-config-dialog';

const savedButton = (label: string, onSaved?: () => void) => (
  <button type="button" onClick={onSaved}>
    {label}
  </button>
);

vi.mock('@/forms/initial-config.form', () => ({
  InitialConfigForm: ({ onSuccess }: { onSuccess: () => void }) =>
    savedButton('Salvar renda', onSuccess),
}));
vi.mock('@/forms/upsert-transaction-recurring.form', () => ({
  UpsertTransactionRecurringForm: ({ onSaved }: { onSaved?: () => void }) =>
    savedButton('Salvar conta', onSaved),
}));
vi.mock('@/forms/upsert-budget.form', () => ({
  UpsertBudgetForm: ({ onSaved }: { onSaved?: () => void }) =>
    savedButton('Salvar orçamento', onSaved),
}));
vi.mock('@/forms/upsert-goal.form', () => ({
  UpsertGoalForm: ({ onSaved }: { onSaved?: () => void }) => savedButton('Salvar meta', onSaved),
}));
vi.mock('@/components/dialogs/onboarding-preview', () => ({
  OnboardingPreview: () => <p>Prévia do Saldo Livre</p>,
}));

const renderDialog = () => {
  const onOpenChange = vi.fn();
  const onSuccess = vi.fn();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  );
  render(<InitialConfigDialog open onOpenChange={onOpenChange} onSuccess={onSuccess} />, {
    wrapper,
  });
  return { onOpenChange, onSuccess };
};

const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }));

afterEach(cleanup);

describe('InitialConfigDialog', () => {
  it('requires income before showing optional steps', () => {
    renderDialog();

    expect(screen.getByText('Etapa 1 de 5')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pular' })).not.toBeInTheDocument();

    click('Salvar renda');

    expect(screen.getByText('Etapa 2 de 5')).toBeInTheDocument();
    expect(screen.getByText('Primeiras contas recorrentes')).toBeInTheDocument();
  });

  it('lets the user skip every optional step and reach the preview', () => {
    renderDialog();
    click('Salvar renda');

    click('Pular');
    click('Pular');
    click('Pular');

    expect(screen.getByText('Etapa 5 de 5')).toBeInTheDocument();
    expect(screen.getByText('Prévia do Saldo Livre')).toBeInTheDocument();
  });

  it('keeps the step open to add more items and counts what was saved', () => {
    renderDialog();
    click('Salvar renda');

    click('Salvar conta');
    click('Salvar conta');

    expect(screen.getByText(/2 contas adicionadas/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument();
  });

  it('finishes from the preview', () => {
    const { onOpenChange, onSuccess } = renderDialog();
    click('Salvar renda');
    click('Pular');
    click('Pular');
    click('Pular');

    click('Ir para o dashboard');

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onSuccess).toHaveBeenCalled();
  });

  it('lets the user configure the rest later', () => {
    const { onOpenChange, onSuccess } = renderDialog();
    click('Salvar renda');

    click('Configurar depois');

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onSuccess).toHaveBeenCalled();
  });
});
