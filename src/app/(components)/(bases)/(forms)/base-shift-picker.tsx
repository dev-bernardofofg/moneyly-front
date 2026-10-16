'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Moon } from 'lucide-react';
import { useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

const STEPS = [
  { key: 'date', title: 'Dia do turno' },
  { key: 'start', title: 'Começou às' },
  { key: 'end', title: 'Terminou às' },
] as const;

interface BaseShiftPickerProps<T extends FieldValues> {
  control: Control<T>;
  dateName: Path<T>;
  startName: Path<T>;
  endName: Path<T>;
  label?: string;
}

const ClockPicker = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [hour = '', minute = ''] = value ? value.split(':') : [];
  const chip = (selected: boolean) =>
    cn(
      'h-9 rounded-md border text-sm tabular-nums transition-colors',
      selected
        ? 'border-primary bg-primary text-primary-foreground'
        : 'border-border hover:bg-muted'
    );

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Hora</p>
        <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Hora">
          {HOURS.map((h) => (
            <button
              key={h}
              type="button"
              aria-pressed={h === hour}
              className={chip(h === hour)}
              onClick={() => onChange(`${h}:${minute || '00'}`)}
            >
              {h}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Minuto</p>
        <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Minuto">
          {MINUTES.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={m === minute}
              disabled={!hour}
              className={cn(chip(m === minute), !hour && 'opacity-40')}
              onClick={() => onChange(`${hour}:${m}`)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Turno em etapas (dia → início → fim). Cada etapa cabe numa tela baixa e o rodapé com
 * Voltar/Próximo fica fixo, então o botão de concluir nunca some (antes, dois calendários
 * completos em gavetas de 85% da altura escondiam o "Confirmar" em celulares baixos).
 */
export function BaseShiftPicker<T extends FieldValues>({
  control,
  dateName,
  startName,
  endName,
  label = 'Turno',
}: BaseShiftPickerProps<T>) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const date = useController({ control, name: dateName });
  const start = useController({ control, name: startName });
  const end = useController({ control, name: endName });

  const dateValue: string = date.field.value ?? '';
  const startValue: string = start.field.value ?? '';
  const endValue: string = end.field.value ?? '';
  const overnight = Boolean(startValue && endValue && endValue < startValue);
  const error = date.fieldState.error ?? start.fieldState.error ?? end.fieldState.error;

  const summary =
    dateValue && startValue && endValue
      ? `${format(parseISO(dateValue), 'dd/MM/yy', { locale: ptBR })} · ${startValue} → ${endValue}${overnight ? ' (+1 dia)' : ''}`
      : null;

  const canAdvance = [Boolean(dateValue), Boolean(startValue), Boolean(endValue)][step];
  const isLast = step === STEPS.length - 1;

  const openPicker = (next: boolean) => {
    // Reabrir começa pela primeira etapa que falta, ou pelo dia se já está tudo preenchido.
    if (next) setStep(!dateValue ? 0 : !startValue ? 1 : !endValue ? 2 : 0);
    setOpen(next);
  };

  const trigger = (
    <BaseButton
      variant="input"
      className={cn(
        'w-full justify-start text-left font-normal dark:bg-slate-800 bg-white/95',
        !summary && 'text-muted-foreground'
      )}
    >
      <CalendarIcon className="mr-2 size-4 shrink-0" />
      {summary ?? <span>Dia, início e fim</span>}
    </BaseButton>
  );

  const body = (
    <div className="flex max-h-[inherit] flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border p-3 pr-12">
        <div>
          <p className="text-xs text-muted-foreground">
            Etapa {step + 1} de {STEPS.length}
          </p>
          <p className="font-semibold">{STEPS[step]!.title}</p>
        </div>
        <ol className="flex gap-1" aria-hidden>
          {STEPS.map((s, index) => (
            <li
              key={s.key}
              className={cn('h-1.5 w-6 rounded-full', index <= step ? 'bg-primary' : 'bg-muted')}
            />
          ))}
        </ol>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {step === 0 && (
          <Calendar
            mode="single"
            selected={dateValue ? parseISO(dateValue) : undefined}
            defaultMonth={dateValue ? parseISO(dateValue) : undefined}
            onSelect={(day) => {
              if (!day) return;
              date.field.onChange(format(day, 'yyyy-MM-dd'));
              setStep(1);
            }}
            disabled={(day) => day > new Date()}
            locale={ptBR}
            className="mx-auto"
          />
        )}
        {step === 1 && <ClockPicker value={startValue} onChange={start.field.onChange} />}
        {step === 2 && (
          <div className="space-y-3">
            <ClockPicker value={endValue} onChange={end.field.onChange} />
            {overnight && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Moon className="size-3.5" aria-hidden />
                Fim antes do início: o turno termina no dia seguinte.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-border p-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={step === 0}
          onClick={() => setStep((current) => current - 1)}
        >
          Voltar
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!canAdvance}
          onClick={() => (isLast ? setOpen(false) : setStep((current) => current + 1))}
        >
          {isLast ? 'Concluir' : 'Próximo'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="relative flex w-full flex-col gap-2">
      {/* Três campos do form num controle só: rótulo/erro manual em vez de FormLabel (exige um FormField). */}
      <span className={cn('text-sm font-medium', error && 'text-destructive')}>
        {error?.message ?? label}
      </span>
      {isMobile ? (
        <Sheet open={open} onOpenChange={openPicker}>
          <SheetTrigger asChild>{trigger}</SheetTrigger>
          {/* dvh: a barra do navegador móvel não come o rodapé. */}
          <SheetContent side="bottom" className="max-h-[85dvh] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>{label}</SheetTitle>
            </SheetHeader>
            {body}
          </SheetContent>
        </Sheet>
      ) : (
        <Popover open={open} onOpenChange={openPicker}>
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
          <PopoverContent
            className="w-[22rem] max-h-[min(calc(100dvh-2rem),32rem)] p-0"
            align="start"
            sideOffset={4}
            collisionPadding={8}
          >
            {body}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
