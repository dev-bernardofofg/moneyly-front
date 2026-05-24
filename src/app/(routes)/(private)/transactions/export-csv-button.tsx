'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { Download } from 'lucide-react';
import { ExportCsvForm } from './export-csv-form';

export const ExportCsvButton = () => (
  <BaseDialog
    title="Exportar transações"
    description="Escolha o período e o tipo de transação para exportar."
    trigger={
      <BaseButton variant="outline">
        <Download className="mr-1 size-4" />
        Exportar CSV
      </BaseButton>
    }
  >
    <ExportCsvForm />
  </BaseDialog>
);
