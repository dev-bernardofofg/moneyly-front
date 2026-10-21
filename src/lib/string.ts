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

  formatNumberToCurrency: (value: string | number) => {
    const num = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(num)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  },

  formatCurrencyToNumber: (value: string) => {
    return Number(value.replace('R$', '').replace(/\./g, '').replace(',', '.'));
  },

  formatCurrencyToCents: (value: string) => {
    return String(Number(value) * 100);
  },

  formatCentsToCurrency: (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  },

  formatCommaToDot: (value: string) => {
    return value.replace(/\./g, '').replace(',', '.');
  },

  formatDotToComma: (value: string) => {
    return value.replace('.', ',');
  },

  formatCurrentStringToNumber: (value: string) => {
    return Number(value.replace(/\./g, '').replace(',', '.'));
  },

  // API manda decimal com ponto ("10.5"); o campo guarda o texto da máscara ("10,50"),
  // que formatCurrentStringToNumber converte de volta.
  formatReaisToMoneyInput: (value: string | number | undefined): string => {
    if (value === undefined || value === null || String(value).trim() === '') return '';
    const n = Number(value);
    if (!Number.isFinite(n)) return '';
    return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
