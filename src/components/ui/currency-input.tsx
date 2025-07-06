import { cn } from "@/lib/utils";
import * as React from "react";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  className?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = 0, onChange, placeholder = "0,00", ...props }, ref) => {
    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    };

    const parseCurrency = (value: string): number => {
      // Remove all non-numeric characters except comma and dot
      const cleanValue = value.replace(/[^\d,.-]/g, '');

      // Handle Brazilian currency format (R$ 1.234,56)
      const normalizedValue = cleanValue
        .replace(/\./g, '') // Remove thousands separator
        .replace(',', '.'); // Replace decimal separator

      const parsed = parseFloat(normalizedValue);
      return isNaN(parsed) ? 0 : parsed;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const numericValue = parseCurrency(rawValue);
      onChange?.(numericValue);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const numericValue = parseCurrency(e.target.value);
      // Format the display value
      e.target.value = formatCurrency(numericValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Show raw numeric value when focused
      const numericValue = parseCurrency(e.target.value);
      e.target.value = numericValue.toString();
    };

    return (
      <input
        type="text"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        value={formatCurrency(value)}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
