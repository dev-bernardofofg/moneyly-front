import { format } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

/**
 * Timezone de negócio do Moneyly. Período financeiro ≠ mês civil — toda data de
 * negócio (criação, fim de dia, "hoje") é resolvida em America/Sao_Paulo.
 * Ver ../../../.specs/02-shared-domain.md.
 */
export const BUSINESS_TZ = "America/Sao_Paulo";

export const FN_UTILS_DATE = {
  /** "yyyy-MM-dd" de hoje no fuso de negócio (default seguro p/ inputs de data). */
  today: (): string => formatInTimeZone(new Date(), BUSINESS_TZ, "yyyy-MM-dd"),

  /**
   * Recebe "yyyy-MM-dd" (input nativo) → ISO UTC do FIM daquele dia em
   * America/Sao_Paulo. Ex.: "2026-05-17" → 2026-05-18T02:59:59.999Z.
   */
  endOfBusinessDayISO: (value: string): string => {
    const dayOnly = value.includes("T") ? value.split("T")[0] : value;
    return fromZonedTime(`${dayOnly}T23:59:59.999`, BUSINESS_TZ).toISOString();
  },

  /** ISO/Date do back → string formatada no fuso de negócio. */
  formatInBusinessTZ: (
    value: string | number | Date,
    pattern = "dd/MM/yyyy",
  ): string => formatInTimeZone(new Date(value), BUSINESS_TZ, pattern),

  /** Date "parede de relógio" no fuso de negócio (p/ date-pickers). */
  toBusinessZoned: (value: string | number | Date): Date =>
    toZonedTime(new Date(value), BUSINESS_TZ),
};

/** @internal reexport p/ casos pontuais; preferir FN_UTILS_DATE. */
export { format };
