'use client';

import { BaseButton } from '@/components/clickable/base-button';
import { InitialConfigForm } from '@/forms/initial-config.form';
import { UpsertBudgetForm } from '@/forms/upsert-budget.form';
import { UpsertGoalForm } from '@/forms/upsert-goal.form';
import { UpsertTransactionRecurringForm } from '@/forms/upsert-transaction-recurring.form';
import { freeBalanceQueryKeys } from '@/api/free-balance-query-keys';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { OnboardingPreview } from '@/components/dialogs/onboarding-preview';

interface InitialConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type OptionalStepKey = 'recurring' | 'budget' | 'goal';

const STEPS = [
  {
    key: 'income',
    title: 'Renda e ciclo de pagamento',
    description: 'Quanto você recebe e em que dias seu período financeiro começa e termina.',
  },
  {
    key: 'recurring',
    title: 'Primeiras contas recorrentes',
    description: 'Aluguel, assinaturas e outras contas que se repetem entram na projeção.',
  },
  {
    key: 'budget',
    title: 'Primeiro orçamento',
    description: 'O que sobra de um orçamento fica reservado no Saldo Livre.',
  },
  {
    key: 'goal',
    title: 'Meta financeira (opcional)',
    description: 'Uma parte do valor da meta é reservada a cada período.',
  },
  {
    key: 'preview',
    title: 'Seu primeiro Saldo Livre',
    description: 'Veja quanto está livre para gastar até receber novamente.',
  },
] as const;

const savedLabel: Record<OptionalStepKey, (count: number) => string> = {
  recurring: (n) => `${n} ${n === 1 ? 'conta adicionada' : 'contas adicionadas'}.`,
  budget: (n) => `${n} ${n === 1 ? 'orçamento criado' : 'orçamentos criados'}.`,
  goal: (n) => `${n} ${n === 1 ? 'meta criada' : 'metas criadas'}.`,
};

export const InitialConfigDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: InitialConfigDialogProps) => {
  const queryClient = useQueryClient();
  const [stepIndex, setStepIndex] = useState(0);
  const [saved, setSaved] = useState<Record<OptionalStepKey, number>>({
    recurring: 0,
    budget: 0,
    goal: 0,
  });

  const step = STEPS[stepIndex]!;
  const isOptional = step.key === 'recurring' || step.key === 'budget' || step.key === 'goal';
  const savedCount = isOptional ? saved[step.key] : 0;

  const next = () => setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));

  const markSaved = (key: OptionalStepKey) => () =>
    setSaved((current) => ({ ...current, [key]: current[key] + 1 }));

  const finish = () => {
    freeBalanceQueryKeys().forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Configuração inicial</DialogTitle>
      <DialogDescription className="sr-only">{step.description}</DialogDescription>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 [&>button.absolute]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Etapa {stepIndex + 1} de {STEPS.length}
            </p>
            <Progress
              value={((stepIndex + 1) / STEPS.length) * 100}
              aria-label={`Etapa ${stepIndex + 1} de ${STEPS.length}`}
            />
            <CardTitle className="text-lg font-bold">{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {step.key === 'income' && <InitialConfigForm onSuccess={next} />}
            {step.key === 'recurring' && (
              <UpsertTransactionRecurringForm onSaved={markSaved('recurring')} />
            )}
            {step.key === 'budget' && <UpsertBudgetForm onSaved={markSaved('budget')} />}
            {step.key === 'goal' && <UpsertGoalForm onSaved={markSaved('goal')} />}
            {step.key === 'preview' && <OnboardingPreview />}

            {isOptional && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {savedCount > 0
                    ? `${savedLabel[step.key](savedCount)} Adicione outro ou continue.`
                    : ''}
                </p>
                <div className="flex gap-2">
                  <BaseButton type="button" variant="ghost" onClick={finish}>
                    Configurar depois
                  </BaseButton>
                  <BaseButton type="button" variant="outline" onClick={next}>
                    {savedCount > 0 ? 'Continuar' : 'Pular'}
                  </BaseButton>
                </div>
              </div>
            )}

            {step.key === 'preview' && (
              <BaseButton type="button" className="w-full" onClick={finish}>
                Ir para o dashboard
              </BaseButton>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
