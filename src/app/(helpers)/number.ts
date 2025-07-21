export const FN_UTILS_NUMBERS = {
  formatCurrencyToNumber: (value: number | string) => {
    return (value as number).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: "currency",
      currency: "BRL",
    });
  },

  formatNumberToCurrency: (value: number | string) => {
    if (value === 0 || value === "0") {
      return "R$ 0,00";
    }
    return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
  },

  formatPercentageFormatted: (value: number) => {
    return `${value.toFixed(2)}%`;
  },
};
