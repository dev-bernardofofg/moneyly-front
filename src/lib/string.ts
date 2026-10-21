import { FN_UTILS_DATE } from '@/lib/date';

export const FN_UTILS_STRING = {
  avatarUser: (name: string) => {
    return name
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  // Campo de dinheiro guarda o texto da máscara ("1.234,56"); a API trabalha em centavos.
  formatMoneyInputToCents: (value: string) => Number(value.replace(/\D/g, '') || 0),

  formatCentsToMoneyInput: (cents: number | null | undefined): string => {
    if (cents === undefined || cents === null || !Number.isFinite(cents)) return '';
    return (cents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },

  formatEndDayDate: (value: string) => FN_UTILS_DATE.endOfBusinessDayISO(value),

  normalizeTitle: (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[\d/\-.]+\s*$/g, '')
      .trim();
  },
};
