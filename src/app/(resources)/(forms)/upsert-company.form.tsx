'use client';

import { BaseForm } from '@/app/(components)/(bases)/(forms)/base-form';
import { BaseInput } from '@/app/(components)/(bases)/(forms)/base-input';
import { DialogFormFooter } from '@/app/(components)/(bases)/(forms)/dialog-form-footer';
import { useUpsertDialog } from '@/app/(hooks)/use-upsert-dialog';
import { FN_UTILS_STRING } from '@/app/(helpers)/string';
import { Form } from '@/components/ui/form';
import { Company } from '../(generated)';
import {
  getGetCompaniesQueryKey,
  usePostCompanies,
  usePutCompaniesId,
} from '../(generated)/hooks/companies/companies';
import {
  UpsertCompanyDefaultValues,
  UpsertCompanyFormValues,
  UpsertCompanySchema,
} from '../(schemas)/overtime.schema';

const FIELDS = ['name', 'hourlyRate'] as const;

export const UpsertCompanyForm = ({ company }: { company?: Company }) => {
  const { form, onCreated, onUpdated, onError, DialogCloseHidden } =
    useUpsertDialog<UpsertCompanyFormValues>({
      schema: UpsertCompanySchema,
      defaultValues: company
        ? {
            name: company.name,
            hourlyRate: FN_UTILS_STRING.formatReaisToMoneyInputDigits(company.hourlyRate),
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
