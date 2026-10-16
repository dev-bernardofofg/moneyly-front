import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';
import { BaseShiftPicker } from './base-shift-picker';

type Shift = { date: string; start: string; end: string };

const Harness = ({ defaults }: { defaults: Shift }) => {
  const form = useForm<Shift>({ defaultValues: defaults });
  return <BaseShiftPicker control={form.control} dateName="date" startName="start" endName="end" />;
};

const clickChip = (group: string, value: string) =>
  fireEvent.click(
    within(screen.getByRole('group', { name: group })).getByRole('button', { name: value })
  );

afterEach(cleanup);

describe('BaseShiftPicker', () => {
  it('starts at the first missing step and keeps next disabled until it is filled', () => {
    render(<Harness defaults={{ date: '2026-09-10', start: '', end: '' }} />);

    fireEvent.click(screen.getByRole('button', { name: /Dia, início e fim/ }));

    expect(screen.getByText('Etapa 2 de 3')).toBeInTheDocument();
    expect(screen.getByText('Começou às')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Próximo' })).toBeDisabled();
  });

  it('walks through start and end and summarizes an overnight shift', () => {
    render(<Harness defaults={{ date: '2026-09-10', start: '', end: '' }} />);
    fireEvent.click(screen.getByRole('button', { name: /Dia, início e fim/ }));

    clickChip('Hora', '22');
    clickChip('Minuto', '00');
    fireEvent.click(screen.getByRole('button', { name: 'Próximo' }));

    expect(screen.getByText('Terminou às')).toBeInTheDocument();
    clickChip('Hora', '02');
    clickChip('Minuto', '30');
    expect(screen.getByText(/o turno termina no dia seguinte/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Concluir' }));

    expect(
      screen.getByRole('button', { name: /10\/09\/26 · 22:00 → 02:30 \(\+1 dia\)/ })
    ).toBeInTheDocument();
  });

  it('lets the user go back to a previous step', () => {
    render(<Harness defaults={{ date: '2026-09-10', start: '18:00', end: '' }} />);
    fireEvent.click(screen.getByRole('button', { name: /Dia, início e fim/ }));

    expect(screen.getByText('Terminou às')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));

    expect(screen.getByText('Começou às')).toBeInTheDocument();
    expect(
      within(screen.getByRole('group', { name: 'Hora' })).getByRole('button', { name: '18' })
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
