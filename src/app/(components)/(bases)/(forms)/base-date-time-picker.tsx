'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Control, FieldValues, Path, useFormContext } from 'react-hook-form';

type BaseDateTimePickerProps<T extends FieldValues> = {
  control?: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  disableFutureDates?: boolean;
  disablePastDates?: boolean;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

const getDatePart = (val: string) => (val ? val.slice(0, 10) : '');
const getHourPart = (val: string) => (val?.length >= 16 ? val.slice(11, 13) : '08');
const getMinutePart = (val: string) => (val?.length >= 16 ? val.slice(14, 16) : '00');
const combine = (date: string, hour: string, minute: string) =>
  date ? `${date}T${hour}:${minute}` : '';

export function BaseDateTimePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Selecione data e hora',
  description,
  disableFutureDates = false,
  disablePastDates = false,
}: BaseDateTimePickerProps<T>) {
  const methods = useFormContext<T>();
  const finalControl = control || methods.control;
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i + 2);
  const currentMonth = calendarDate ?? new Date();

  return (
    <FormField
      control={finalControl}
      name={name}
      render={({ field, fieldState }) => {
        const hour = getHourPart(field.value);
        const minute = getMinutePart(field.value);
        const datePart = getDatePart(field.value);

        const displayValue = field.value
          ? (() => {
              try {
                return format(parseISO(`${field.value}:00`), 'dd/MM/yy · HH:mm', {
                  locale: ptBR,
                });
              } catch {
                return field.value;
              }
            })()
          : null;

        const trigger = (
          <BaseButton
            variant="input"
            className={cn(
              'w-full justify-start text-left font-normal dark:bg-slate-800 bg-white/95',
              !field.value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0" />
            {displayValue ?? <span>{placeholder}</span>}
          </BaseButton>
        );

        const pickerBody = (
          <>
            <div
              className={cn(
                'flex items-center justify-between border-b border-border p-3',
                isMobile && 'pr-14'
              )}
            >
              <div className="flex items-center gap-2">
                <Select
                  value={currentMonth.getFullYear().toString()}
                  onValueChange={(y) => {
                    const d = new Date(currentMonth);
                    d.setFullYear(parseInt(y));
                    setCalendarDate(d);
                  }}
                >
                  <SelectTrigger className="h-8 w-[90px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm font-medium capitalize">
                  {format(currentMonth, 'MMMM', { locale: ptBR })}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    const d = new Date(currentMonth);
                    d.setMonth(d.getMonth() - 1);
                    setCalendarDate(d);
                  }}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    const d = new Date(currentMonth);
                    d.setMonth(d.getMonth() + 1);
                    setCalendarDate(d);
                  }}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            <Calendar
              mode="single"
              month={calendarDate}
              onMonthChange={setCalendarDate}
              selected={datePart ? parseISO(datePart) : undefined}
              onSelect={(date) => {
                if (date) {
                  const d = format(date, 'yyyy-MM-dd');
                  setCalendarDate(date);
                  field.onChange(combine(d, hour, minute));
                }
              }}
              disabled={(date) => {
                if (disableFutureDates && date > new Date()) return true;
                if (disablePastDates && date < new Date(new Date().setHours(0, 0, 0, 0)))
                  return true;
                return false;
              }}
              initialFocus
              locale={ptBR}
              showOutsideDays
              fixedWeeks
              className="w-full"
              classNames={{
                root: 'w-full',
                months: 'flex w-full flex-col gap-4',
                month: 'flex w-full flex-col',
                month_caption: 'hidden',
                nav: 'hidden',
              }}
            />

            <div className="flex items-center gap-2 border-t border-border p-3">
              <Clock className="size-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">Horário</span>
              <div className="ml-auto flex items-center gap-1.5">
                <Select
                  value={hour}
                  onValueChange={(h) => field.onChange(combine(datePart, h, minute))}
                >
                  <SelectTrigger className="h-8 w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {HOURS.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="font-semibold text-muted-foreground">:</span>
                <Select
                  value={minute}
                  onValueChange={(m) => field.onChange(combine(datePart, hour, m))}
                >
                  <SelectTrigger className="h-8 w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MINUTES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t border-border p-3">
              <Button
                type="button"
                className="w-full"
                size="sm"
                disabled={!field.value}
                onClick={() => setOpen(false)}
              >
                Confirmar
              </Button>
            </div>
          </>
        );

        return (
          <FormItem className="relative w-full">
            {label && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {fieldState.error ? (
                  <FormLabel className="text-destructive">{fieldState.error.message}</FormLabel>
                ) : (
                  <FormLabel>{label}</FormLabel>
                )}
              </motion.div>
            )}

            <FormControl>
              {isMobile ? (
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>{trigger}</SheetTrigger>
                  <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto p-0">
                    <SheetHeader className="sr-only">
                      <SheetTitle>{label ?? placeholder}</SheetTitle>
                    </SheetHeader>
                    {pickerBody}
                  </SheetContent>
                </Sheet>
              ) : (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 max-h-[min(calc(100vh-2rem),36rem)] overflow-y-auto"
                    align="start"
                    sideOffset={4}
                    collisionPadding={8}
                  >
                    {pickerBody}
                  </PopoverContent>
                </Popover>
              )}
            </FormControl>

            {description && <FormDescription>{description}</FormDescription>}
          </FormItem>
        );
      }}
    />
  );
}
