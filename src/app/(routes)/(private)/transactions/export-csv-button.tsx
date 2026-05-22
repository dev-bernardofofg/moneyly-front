'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { getTransactionsExport } from '@/app/(resources)/(generated)/hooks/transactions/transactions';
import { FN_UTILS_DATE } from '@/app/(helpers)/date';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * R2 — Export CSV. `GET /transactions/export` retorna `text/csv` (string).
 * Sem params = exporta tudo; back aceita `startDate`/`endDate` opcionais.
 */
export const ExportCsvButton = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const csv = await getTransactionsExport();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transacoes-${FN_UTILS_DATE.today()}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('CSV exportado com sucesso');
    } catch {
      toast.error('Falha ao exportar CSV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseButton variant="outline" onClick={handleExport} isLoading={loading}>
      <Download className="mr-1 size-4" />
      Exportar CSV
    </BaseButton>
  );
};
