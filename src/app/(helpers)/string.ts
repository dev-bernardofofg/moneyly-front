import { FN_UTILS_DATE } from './date';

export const FN_UTILS_STRING = {
  avatarUser: (name: string) => {
    return name
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  formatNumberToCurrency: (value: string) => {
    return `R$ ${value.replace('.', ',')}`;
  },

  formatCurrencyToNumber: (value: string) => {
    return Number(value.replace('R$', '').replace('.', '').replace(',', '.'));
  },

  formatCurrencyToCents: (value: string) => {
    return String(Number(value) * 100);
  },

  formatCentsToCurrency: (value: number) => {
    return `R$ ${value / 100}`;
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

  formatReaisToMoneyInputDigits: (value: string | number | undefined): string => {
    if (value === undefined || value === null) return '';
    const raw = String(value).trim();
    if (raw === '') return '';
    const n = Number(raw.replace(/\./g, '').replace(',', '.'));
    if (!Number.isFinite(n)) return '';
    return String(Math.round(n * 100));
  },

  formatEndDayDate: (value: string) => FN_UTILS_DATE.endOfBusinessDayISO(value),
};
