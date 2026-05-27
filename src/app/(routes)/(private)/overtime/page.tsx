'use client';

const fmtHours = (n: number) => {
  const h = Math.floor(n);
  const min = Math.round((n - h) * 60);
  return min > 0 ? `${h}h ${min}min` : `${h}h`;
};

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
import { FN_UTILS_DATE } from '@/app/(helpers)/date';
import { CustomAxiosError } from '@/app/(types)/error.type';
import {
  getGetCompaniesQueryKey,
  useDeleteCompaniesId,
} from '@/app/(resources)/(generated)/hooks/companies/companies';
import { Company } from '@/app/(resources)/(generated)';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Briefcase, Building2, Clock, Download, PencilIcon, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const { data: companiesData } = useGetCompanies();
  const companies = companiesData?.data ?? [];

  const { records, summary, isLoading, pagination, paginationParams, setPaginationParams } =
    useOvertimeAction(companyFilter === 'all' ? undefined : companyFilter);

  const handleExportCsv = () => {
    if (!records.length) {
      toast.error('Nenhum registro para exportar');
      return;
    }

    const header = ['Empresa', 'Data', 'Início', 'Fim', 'Horas', 'Valor (R$)'];
    const rows = records.map((r) => {
      const date = new Date(r.startTime);
      const pad = (n: number) => String(n).padStart(2, '0');
      const fmt = (iso: string) => {
        const d = new Date(iso);
        return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };
      return [
        r.company.name,
        `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`,
        fmt(r.startTime),
        fmt(r.endTime),
        parseFloat(r.hoursWorked).toFixed(2).replace('.', ','),
        parseFloat(r.amount).toFixed(2).replace('.', ','),
      ];
    });

    const csv = [header, ...rows].map((row) => row.join(';')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `horas-extras-${FN_UTILS_DATE.today()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success('CSV exportado com sucesso');
  };

  const byCompany = summary?.byCompany ?? [];

  return (
    <Fade>
      <Header
        title="Horas Extras"
        actions={[
          <BaseButton key="export-csv" variant="outline" onClick={handleExportCsv}>
            <Download className="size-4 mr-1" />
            Exportar CSV
          </BaseButton>,
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
            icon: Download,
            label: 'Exportar CSV',
            dialogTitle: 'Exportar CSV',
            dialogDescription: 'Exportar horas extras do período atual',
            children: (
              <div className="flex flex-col gap-3 pt-2">
                <p className="text-sm text-muted-foreground">
                  Exporta os registros do período atual em formato CSV.
                </p>
                <BaseButton onClick={handleExportCsv}>
                  <Download className="size-4" />
                  Exportar
                </BaseButton>
              </div>
            ),
          },
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
        className="grid grid-rows-[auto_auto_auto_1fr]"
        itemClassNames={[undefined, undefined, undefined, 'overflow-y-hidden size-full']}
      >
        <PeriodNavigatorWrapper />

        <StaggeredFade className="grid grid-cols-2 gap-2">
          <BaseStats
            name="Total Horas"
            value={summary ? fmtHours(summary.totalHours) : '0h'}
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

        {byCompany.length > 1 && (
          <div className="flex flex-col gap-1.5 rounded-md border border-border p-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Por empresa
            </span>
            {byCompany.map((item) => (
              <div key={item.companyId} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.companyName}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{fmtHours(item.hours)}</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(item.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 overflow-y-hidden size-full">
          {companies.length > 1 && (
            <div className="flex items-center gap-2 px-0.5">
              <span className="text-sm text-muted-foreground shrink-0">Empresa</span>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="h-8 w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {companies.map((c: Company) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <OvertimeTable
            records={records}
            isLoading={isLoading}
            tableOptions={{
              pagination: {
                ...paginationParams,
                total: pagination?.total ?? 0,
                totalPages: pagination?.totalPages ?? 0,
              },
            }}
            onPaginationChange={setPaginationParams}
          />
        </div>
      </StaggeredFade>
    </Fade>
  );
};

export default OvertimePage;
