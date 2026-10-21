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

export const FN_UTILS_NUMBERS = {
  // Dinheiro trafega em centavos (1050 = R$ 10,50).
  formatCurrency: (cents: number): string =>
    BRL_CURRENCY_FORMATTER.format(Number.isFinite(cents) ? cents / 100 : 0),

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
