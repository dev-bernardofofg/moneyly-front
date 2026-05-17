import { FN_UTILS_DATE } from "./date";

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

  // Converte formato brasileiro (250,00) para formato americano (250.00)
  formatCommaToDot: (value: string) => {
    // Remove pontos de milhares e troca vírgula por ponto
    return value.replace(/\./g, "").replace(",", ".");
  },

  // Converte formato americano (250.00) para formato brasileiro (250,00)
  formatDotToComma: (value: string) => {
    return value.replace(".", ",");
  },

  // Converte formato brasileiro para número
  formatCurrentStringToNumber: (value: string) => {
    return Number(value.replace(/\./g, "").replace(",", "."));
  },

  /**
   * Valor em reais (ex.: da API `"500"` ou `500.5`) → sequência só de dígitos que o
   * BaseInput `type="money"` interpreta (últimos 2 = centavos). Ex.: 500 → `"50000"` → exibe `500,00`.
   */
  formatReaisToMoneyInputDigits: (value: string | number | undefined): string => {
    if (value === undefined || value === null) return "";
    const raw = String(value).trim();
    if (raw === "") return "";
    const n = Number(raw.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(n)) return "";
    return String(Math.round(n * 100));
  },

  /** @deprecated use FN_UTILS_DATE.endOfBusinessDayISO (fuso America/Sao_Paulo). */
  formatEndDayDate: (value: string) => FN_UTILS_DATE.endOfBusinessDayISO(value),
};
