import { format, Locale } from 'date-fns';
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';

export const BUSINESS_TZ = 'America/Sao_Paulo';

export const FN_UTILS_DATE = {
  today: (): string => formatInTimeZone(new Date(), BUSINESS_TZ, 'yyyy-MM-dd'),

  endOfBusinessDayISO: (value: string): string => {
    const dayOnly = value.includes('T') ? value.split('T')[0] : value;
    return fromZonedTime(`${dayOnly}T23:59:59.999`, BUSINESS_TZ).toISOString();
  },

  formatInBusinessTZ: (
    value: string | number | Date,
    pattern = 'dd/MM/yyyy',
    locale?: Locale
  ): string => formatInTimeZone(new Date(value), BUSINESS_TZ, pattern, { locale }),

  toBusinessZoned: (value: string | number | Date): Date =>
    toZonedTime(new Date(value), BUSINESS_TZ),

  toBusinessDatetimeLocal: (iso: string): string =>
    formatInTimeZone(new Date(iso), BUSINESS_TZ, "yyyy-MM-dd'T'HH:mm"),

  fromBusinessDatetimeLocal: (datetimeLocal: string): string =>
    fromZonedTime(`${datetimeLocal}:00`, BUSINESS_TZ).toISOString(),
};

export { format };
