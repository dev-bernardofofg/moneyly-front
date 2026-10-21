'use client';

import { BaseForm } from '@/components/forms/base-form';
import { BaseInput } from '@/components/forms/base-input';
import { DialogFormFooter } from '@/components/forms/dialog-form-footer';
import { useUpsertDialog } from '@/hooks/use-upsert-dialog';
import { FN_UTILS_STRING } from '@/lib/string';
import { Form } from '@/components/ui/form';
import { Company } from '@/api/generated';
import {
  getGetCompaniesQueryKey,
  usePostCompanies,
  usePutCompaniesId,
} from '@/api/generated/hooks/companies/companies';
import {
  UpsertCompanyDefaultValues,
  UpsertCompanyFormValues,
  UpsertCompanySchema,
} from '@/schemas/overtime.schema';

const FIELDS = ['name', 'hourlyRate'] as const;

export const UpsertCompanyForm = ({ company }: { company?: Company }) => {
  const { form, onCreated, onUpdated, onError, DialogCloseHidden } =
    useUpsertDialog<UpsertCompanyFormValues>({
      schema: UpsertCompanySchema,
      defaultValues: company
        ? {
            name: company.name,
            hourlyRate: FN_UTILS_STRING.formatReaisToMoneyInput(company.hourlyRate),
          }
        : UpsertCompanyDefaultValues,
      invalidateKeys: [getGetCompaniesQueryKey()],
      errorFields: [...FIELDS],
      successMessage: {
        create: 'Empresa criada com sucesso',
        update: 'Empresa atualizada com sucesso',
      },
    });

  const { mutate: createCompany, isPending: isCreating } = usePostCompanies({
    mutation: {
      onSuccess: onCreated,
      onError,
    },
  });

  const { mutate: updateCompany, isPending: isUpdating } = usePutCompaniesId({
    mutation: {
      onSuccess: onUpdated,
      onError,
    },
  });

  const handleSubmit = (data: UpsertCompanyFormValues) => {
    const hourlyRate = parseFloat(data.hourlyRate.replace(/\./g, '').replace(',', '.'));

    if (company) {
      updateCompany({ id: company.id, data: { name: data.name, hourlyRate } });
    } else {
      createCompany({ data: { name: data.name, hourlyRate } });
    }
  };

  return (
    <>
      <DialogCloseHidden />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleSubmit)}>
          <BaseInput
            control={form.control}
            name="name"
            label="Nome da empresa"
            placeholder="Ex: Acme Corp"
            autoFocus
          />
          <BaseInput
            control={form.control}
            name="hourlyRate"
            label="Valor por hora"
            type="money"
            placeholder="0,00"
          />
          <DialogFormFooter
            submitLabel={company ? 'Atualizar' : 'Criar'}
            isLoading={isCreating || isUpdating}
          />
        </BaseForm>
      </Form>
    </>
  );
};
