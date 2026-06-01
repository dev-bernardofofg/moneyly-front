'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { BaseForm } from '@/app/(components)/(bases)/(forms)/base-form';
import { BaseInput } from '@/app/(components)/(bases)/(forms)/base-input';
import { BaseSelect } from '@/app/(components)/(bases)/(forms)/base-select';
import { useAuth } from '@/app/(contexts)/auth-provider';
import { FN_UTILS_STRING } from '@/app/(helpers)/string';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  getGetUserFinancialPeriodsQueryKey,
  getGetUserMeQueryKey,
  usePutUserIncomeAndPeriod,
} from '../../../(resources)/(generated)/hooks/user/user';
import {
  ProfileConfigFinanceFormValues,
  profileConfigFinanceFormSchema,
} from './profile-config-finance.schema';

export const ProfileConfigFinanceForm = ({
  defaultValues,
}: {
  defaultValues: ProfileConfigFinanceFormValues;
}) => {
  const { updateUser, user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<ProfileConfigFinanceFormValues>({
    resolver: zodResolver(profileConfigFinanceFormSchema),
    defaultValues: {
      financialDayStart: defaultValues.financialDayStart!,
      financialDayEnd: defaultValues.financialDayEnd!,
      monthlyIncome: FN_UTILS_STRING.formatReaisToMoneyInputDigits(defaultValues.monthlyIncome),
    },
  });

  const { mutate: updateProfile } = usePutUserIncomeAndPeriod({
    mutation: {
      onSuccess: (_, variables) => {
        toast.success('Configurações atualizadas com sucesso');
        const next = variables.data;
        if (user) {
          updateUser({
            ...user,
            financialDayEnd: Number(next.financialDayEnd),
            financialDayStart: Number(next.financialDayStart),
            monthlyIncome: Number(next.monthlyIncome).toString(),
          });
        }
        form.reset(form.getValues());
        queryClient.invalidateQueries({ queryKey: getGetUserMeQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetUserFinancialPeriodsQueryKey() });
      },
      onError: () => {
        toast.error('Erro ao atualizar configurações');
      },
    },
  });

  const onSubmit = (data: ProfileConfigFinanceFormValues) => {
    if (!form.formState.isDirty) {
      toast.info('Nenhuma alteração foi feita');
      return;
    }
    updateProfile({
      data: {
        monthlyIncome: FN_UTILS_STRING.formatCurrentStringToNumber(data.monthlyIncome),
        financialDayStart: Number(data.financialDayStart),
        financialDayEnd: Number(data.financialDayEnd),
      },
    });
  };

  return (
    <Form {...form}>
      <BaseForm
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-0 grid grid-cols-3 gap-3 w-full"
      >
        <BaseInput
          control={form.control}
          label="Renda Mensal"
          name="monthlyIncome"
          placeholder="R$ 0,00"
          type="money"
        />
        <BaseSelect
          control={form.control}
          label="Dia de início"
          name="financialDayStart"
          type="full-date"
        />

        <BaseSelect
          control={form.control}
          label="Dia de fim"
          name="financialDayEnd"
          type="full-date"
        />

        <BaseButton type="submit" className="w-fit" disabled={!form.formState.isDirty}>
          Salvar
        </BaseButton>
      </BaseForm>
    </Form>
  );
};
