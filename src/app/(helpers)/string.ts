export const FN_UTILS_STRING = {
  avatarUser: (name: string) => {
    return name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  },

  formatNumberToCurrency: (value: string) => {
    return `R$ ${value.replace(".", ",")}`;
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

  formatCurrentStringToNumber: (value: string) => {
    return Number(value.replace(".", "").replace(",", "."));
  },

  formatEndDayDate: (value: string) => {
    const date = new Date(value);

    // Define o final do dia em UTC
    const endOfDayDate = new Date(date);
    endOfDayDate.setUTCHours(23, 59, 59, 999);

    return endOfDayDate.toISOString();
  },
};
