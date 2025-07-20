export const FN_UTILS_NUMBERS = {
  formatCurrencyToNumber: (value: number | string) => {
    return (value as number).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: "currency",
      currency: "BRL",
    });
  },

  formatPercentageFormatted: (value: number) => {
    return `${value.toFixed(2)}%`;
  },
};
