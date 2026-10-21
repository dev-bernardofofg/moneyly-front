const BRL_CURRENCY_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const BRL_DECIMAL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const parseMonetaryValue = (value: number | string): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const cleaned = value.replace(/R\$\s*/gi, '').trim();
  if (cleaned === '') return 0;

  const normalized = cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const FN_UTILS_NUMBERS = {
  formatCurrency: (value: number | string): string =>
    BRL_CURRENCY_FORMATTER.format(parseMonetaryValue(value)),

  formatPercentage: (value: number): string => {
    if (!Number.isFinite(value)) return '0,00%';
    return `${BRL_DECIMAL_FORMATTER.format(value)}%`;
  },

  formatInstallments: (
    executedInstallments?: number,
    totalInstallments?: number | null
  ): string => {
    if (totalInstallments == null) return 'Recorrente';
    return `${executedInstallments ?? 0} de ${totalInstallments} parcelas`;
  },
};
