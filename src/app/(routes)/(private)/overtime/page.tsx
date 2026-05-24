'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { BaseStats } from '@/app/(components)/(bases)/(stats)/base-stats';
import { PeriodNavigatorWrapper } from '@/app/(components)/(bases)/(layout)/period-navigator-wrapper';
import { Header } from '@/app/(components)/(layout)/header';
import { Fade } from '@/app/(components)/(motions)/fade';
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade';
import { UpsertCompanyForm } from '@/app/(resources)/(forms)/upsert-company.form';
import { UpsertOvertimeForm } from '@/app/(resources)/(forms)/upsert-overtime.form';
import { useGetCompanies } from '@/app/(resources)/(generated)/hooks/companies/companies';
import { queryClient } from '@/app/(contexts)';
import { getErrorMessage } from '@/app/(helpers)/errors';
import { CustomAxiosError } from '@/app/(types)/error.type';
import {
  getGetCompaniesQueryKey,
  useDeleteCompaniesId,
} from '@/app/(resources)/(generated)/hooks/companies/companies';
import { Company } from '@/app/(resources)/(generated)';
import { Briefcase, Building2, Clock, PencilIcon, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmActionForm } from '../../../(resources)/(forms)/confirm-action';
import { OvertimeTable } from './overtime.table';
import { useOvertimeAction } from './overtime.action';

const CompaniesManager = () => {
  const { data: companiesData, isLoading } = useGetCompanies();
  const companies = companiesData?.data ?? [];

  const { mutate: remove } = useDeleteCompaniesId({
    mutation: {
      onSuccess: () => {
        toast.success('Empresa removida');
        queryClient.invalidateQueries({ queryKey: getGetCompaniesQueryKey() });
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {companies.length} empresa{companies.length !== 1 ? 's' : ''} cadastrada
          {companies.length !== 1 ? 's' : ''}
        </span>
        <BaseDialog
          title="Nova empresa"
          description="Cadastre uma nova empresa para registrar horas extras"
          trigger={
            <BaseButton clickAction="create" className="text-xs h-8 px-3">
              Nova empresa
            </BaseButton>
          }
        >
          <UpsertCompanyForm />
        </BaseDialog>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground text-center py-4">Carregando...</div>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center text-muted-foreground">
          <Building2 className="size-10 opacity-40" />
          <span className="text-sm">Nenhuma empresa cadastrada</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {companies.map((company: Company) => (
            <div
              key={company.id}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{company.name}</span>
                <span className="text-xs text-muted-foreground">
                  R$ {parseFloat(company.hourlyRate).toFixed(2).replace('.', ',')}/h
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BaseDialog
                  title="Editar empresa"
                  description="Editar dados da empresa"
                  trigger={
                    <BaseButton className="w-fit h-8 px-2">
                      <PencilIcon className="size-3.5" />
                    </BaseButton>
                  }
                >
                  <UpsertCompanyForm company={company} />
                </BaseDialog>
                <ConfirmActionForm
                  onConfirm={() => remove({ id: company.id })}
                  title="Remover empresa"
                  description={`Remover a empresa "${company.name}"? Registros existentes serão mantidos.`}
                  trigger={
                    <BaseButton variant="destructive" className="w-fit h-8 px-2">
                      <Trash2 className="size-3.5" />
                    </BaseButton>
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OvertimePage = () => {
  const { records, summary, isLoading } = useOvertimeAction();

  return (
    <Fade>
      <Header
        title="Horas Extras"
        actions={[
          <BaseDialog
            key="manage-companies"
            title="Gerenciar empresas"
            description="Cadastre e gerencie as empresas para registro de horas extras"
            trigger={
              <BaseButton variant="outline">
                <Building2 className="size-4 mr-1" />
                Empresas
              </BaseButton>
            }
          >
            <CompaniesManager />
          </BaseDialog>,
          <BaseDialog
            key="new-overtime"
            title="Nova hora extra"
            description="Registre uma nova hora extra"
            trigger={<BaseButton clickAction="create">Nova hora extra</BaseButton>}
          >
            <UpsertOvertimeForm />
          </BaseDialog>,
        ]}
        fabActions={[
          {
            icon: Building2,
            label: 'Empresas',
            dialogTitle: 'Gerenciar empresas',
            dialogDescription: 'Cadastre e gerencie as empresas para registro de horas extras',
            children: <CompaniesManager />,
          },
          {
            icon: Plus,
            label: 'Nova hora extra',
            dialogTitle: 'Nova hora extra',
            dialogDescription: 'Registre uma nova hora extra',
            children: <UpsertOvertimeForm />,
          },
        ]}
      />
      <StaggeredFade
        variant="page"
        className="grid grid-rows-[auto_auto_1fr]"
        itemClassNames={[undefined, undefined, 'overflow-y-hidden size-full']}
      >
        <PeriodNavigatorWrapper />
        <StaggeredFade className="grid grid-cols-2 gap-2">
          <BaseStats
            name="Total Horas"
            value={summary ? `${summary.totalHours.toFixed(2).replace('.', ',')} h` : '0,00 h'}
            Icon={Clock}
            variant="secondary"
            loading={isLoading}
          />
          <BaseStats
            name="Total Valor"
            value={summary?.totalAmount ?? 0}
            Icon={Briefcase}
            isMonetary
            loading={isLoading}
          />
        </StaggeredFade>
        <OvertimeTable records={records} isLoading={isLoading} />
      </StaggeredFade>
    </Fade>
  );
};

export default OvertimePage;
