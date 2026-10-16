'use client';

import { useAccounts } from '@/app/(hooks)/use-accounts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ALL = 'all';

interface AccountFilterProps {
  value?: string;
  onChange: (accountId: string | undefined) => void;
  className?: string;
}

export const AccountFilter = ({ value, onChange, className }: AccountFilterProps) => {
  const { options } = useAccounts();

  return (
    <Select
      value={value ?? ALL}
      onValueChange={(next) => onChange(next === ALL ? undefined : next)}
    >
      <SelectTrigger className={cn('w-44', className)} aria-label="Filtrar por conta">
        <SelectValue placeholder="Conta" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>Todas as contas</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
