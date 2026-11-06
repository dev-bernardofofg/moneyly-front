'use client';

import { BaseButton } from '@/components/clickable/base-button';
import { getErrorMessage } from '@/lib/errors';
import {
  getGetCategoriesQueryKey,
  useGetCategories,
  usePostCategoriesCreate,
} from '@/api/generated/hooks/categories/categories';
import type { TransactionCategory } from '@/api/generated/hooks/moneylyAPI.schemas';
import type { CustomAxiosError } from '@/types/error.type';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

const NEW_CATEGORY = '__new__';

interface ImportCategoryPickerProps {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (categoryId: string) => void;
}

export const ImportCategoryPicker = ({
  label,
  value,
  disabled,
  onChange,
}: ImportCategoryPickerProps) => {
  const queryClient = useQueryClient();
  const { data: categories } = useGetCategories();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  const create = usePostCategoriesCreate({
    mutation: {
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
        const id = response.data?.id;
        if (id) onChange(id);
        toast.success(`Categoria "${name.trim()}" criada`);
        setCreating(false);
        setName('');
      },
      onError: (error: unknown) => toast.error(getErrorMessage(error as CustomAxiosError)),
    },
  });

  if (creating) {
    return (
      <div className="flex gap-1">
        <Input
          autoFocus
          aria-label={`Nova categoria para ${label}`}
          placeholder="Nome da categoria"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && name.trim()) {
              event.preventDefault();
              create.mutate({ data: { name: name.trim() } });
            }
          }}
        />
        <BaseButton
          type="button"
          size="sm"
          disabled={!name.trim()}
          isLoading={create.isPending}
          onClick={() => create.mutate({ data: { name: name.trim() } })}
        >
          Criar
        </BaseButton>
        <BaseButton type="button" size="sm" variant="ghost" onClick={() => setCreating(false)}>
          Cancelar
        </BaseButton>
      </div>
    );
  }

  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(next) => (next === NEW_CATEGORY ? setCreating(true) : onChange(next))}
    >
      <SelectTrigger aria-label={`Categoria de ${label}`}>
        <SelectValue placeholder="Categoria" />
      </SelectTrigger>
      <SelectContent>
        {(categories?.data ?? []).map((category: TransactionCategory) => (
          <SelectItem key={category.id} value={category.id ?? ''}>
            {category.name}
          </SelectItem>
        ))}
        <SelectSeparator />
        <SelectItem value={NEW_CATEGORY}>+ Nova categoria</SelectItem>
      </SelectContent>
    </Select>
  );
};
