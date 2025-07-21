export const FN_UTILS_STRING = {
  avatarUser: (name: string) => {
    return name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  },

  formatCurrencyToNumber: (value: string) => {
    return Number(value.replace("R$", "").replace(".", "").replace(",", "."));
  },

  formatCurrencyToCents: (value: string) => {
    return String(Number(value) * 100);
  },

  formatCentsToCurrency: (value: number) => {
    return `R$ ${value / 100}`;
  },
};
