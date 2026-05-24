'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { usePeriods } from '@/app/(hooks)/use-periods';
import { Period } from '@/app/(types)/period.type';
import { FN_UTILS_DATE } from '@/app/(helpers)/date';
import { getTransactionsExport } from '@/app/(resources)/(generated)/hooks/transactions/transactions';
import { GetTransactionsExportQueryParamsTypeEnumKey } from '@/app/(resources)/(generated)/types/GetTransactionsExport';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const ExportCsvForm = () => {
  const { periods, selectedPeriodId } = usePeriods();
  const [loading, setLoading] = useState(false);
  const [periodId, setPeriodId] = useState<string>(selectedPeriodId ?? 'all');
  const [type, setType] = useState<GetTransactionsExportQueryParamsTypeEnumKey | 'all'>('all');

  const handleExport = async () => {
    setLoading(true);
    try {
      const csv = await getTransactionsExport({
        periodId: periodId === 'all' ? undefined : periodId,
        type: type === 'all' ? undefined : type,
      });
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Período</Label>
        <Select value={periodId} onValueChange={setPeriodId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os períodos</SelectItem>
            {periods.map((p: Period) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Tipo</Label>
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="income">Entradas</SelectItem>
            <SelectItem value="expense">Saídas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <BaseButton onClick={handleExport} isLoading={loading} className="mt-2">
        <Download className="size-4" />
        Exportar
      </BaseButton>
    </div>
  );
};
