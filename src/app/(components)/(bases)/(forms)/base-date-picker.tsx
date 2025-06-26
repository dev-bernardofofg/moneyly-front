"use client";

import { format, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Control, FieldValues, Path, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BaseButton } from "../base-button";

type BaseDatePickerProps<T extends FieldValues> = {
  control?: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  disableFutureDates?: boolean;
  disablePastDates?: boolean;
  minDate?: Date;
  maxDate?: Date;
  fromYear?: number;
  toYear?: number;
  isDateAvaliable?: (date: Date) => boolean;
  isDateDisabled?: string;
  isDisable?: boolean;
};

export function BaseDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Selecione uma data",
  description,
  disableFutureDates = false,
  disablePastDates = false,
  minDate,
  maxDate,
  fromYear = 1900,
  toYear = new Date().getFullYear(),
  isDateAvaliable,
  isDateDisabled,
  isDisable = false,
}: BaseDatePickerProps<T>) {
  const methods = useFormContext<T>();
  const finalControl = control || methods.control;
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);

  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => toYear - i,
  );

  const currentMonth = calendarDate || new Date();
  const currentYear = currentMonth.getFullYear();
  const currentMonthName = format(currentMonth, "MMMM", { locale: ptBR });

  const handlePreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() - 1);
    setCalendarDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + 1);
    setCalendarDate(newDate);
  };

  return (
    <FormField
      control={finalControl}
      name={name}
      render={({ field }) => (
        <FormItem className="relative w-full">
          {label && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between"
            >
              <FormLabel>{label}</FormLabel>
              <FormMessage />
            </motion.div>
          )}

          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <BaseButton
                  variant="input"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  disabled={isDisable && !isDateDisabled}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {field.value ? (
                    format(parseISO(field.value), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </BaseButton>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex items-center justify-between border-b p-3">
                  <div className="flex items-center gap-2">
                    <Select
                      value={currentYear.toString()}
                      onValueChange={(year) => {
                        const newDate = new Date(currentMonth);
                        newDate.setFullYear(parseInt(year));
                        setCalendarDate(newDate);
                      }}
                    >
                      <SelectTrigger className="h-8 w-[90px]">
                        <SelectValue placeholder="Ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem
                            key={year}
                            value={year.toString()}
                            className="cursor-pointer"
                          >
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="text-sm font-medium capitalize">
                      {currentMonthName}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={handlePreviousMonth}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={handleNextMonth}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>

                <Calendar
                  mode="single"
                  month={calendarDate}
                  onMonthChange={setCalendarDate}
                  selected={field.value ? parseISO(field.value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const offset = date.getTimezoneOffset();
                      const adjustedDate = new Date(
                        date.getTime() + offset * 60 * 1000,
                      );
                      field.onChange(format(adjustedDate, "yyyy-MM-dd"));
                      setCalendarDate(date);
                    } else {
                      field.onChange("");
                      setCalendarDate(undefined);
                    }
                  }}
                  disabled={(date) => {
                    if (disableFutureDates && date > new Date()) return true;
                    if (disablePastDates && date < startOfDay(new Date()))
                      return true;
                    if (minDate && date < minDate) return true;
                    if (maxDate && date > maxDate) return true;
                    if (isDateAvaliable && !isDateAvaliable(date)) return true;
                    return false;
                  }}
                  initialFocus
                  locale={ptBR}
                  showOutsideDays
                  fixedWeeks
                  classNames={{
                    months: "space-y-4",
                    head_row: "flex",
                    head_cell: cn(
                      "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] capitalize",
                    ),
                    row: "flex w-full mt-2",
                    cell: cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                      "[&:has([aria-selected])]:bg-accent",
                    ),
                    day: cn(
                      "h-8 w-8 p-0 font-normal",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                    ),
                    day_selected: cn(
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      "focus:bg-primary focus:text-primary-foreground",
                    ),
                    day_today: "bg-accent/50 text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible",
                    nav: "hidden",
                    caption: "hidden",
                    table: "w-full border-collapse space-y-1",
                  }}
                />
              </PopoverContent>
            </Popover>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}