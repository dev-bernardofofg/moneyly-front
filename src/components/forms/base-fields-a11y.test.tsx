import { cleanup, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';
import { Form } from '@/components/ui/form';
import { BaseDatePicker } from './base-date-picker';
import { BaseInput } from './base-input';
import { BaseSelect } from './base-select';

afterEach(cleanup);

const Harness = () => {
  const form = useForm({ defaultValues: { amount: '', kind: '', date: '' } });
  return (
    <Form {...form}>
      <form>
        <BaseInput control={form.control} name="amount" label="Valor" type="money" />
        <BaseSelect
          control={form.control}
          name="kind"
          label="Tipo"
          options={[{ label: 'Despesa', value: 'expense' }]}
        />
        <BaseDatePicker control={form.control} name="date" label="Data" />
      </form>
    </Form>
  );
};

describe('form fields', () => {
  it('names each focusable control by its label', () => {
    render(<Harness />);

    expect(screen.getByLabelText('Valor')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText('Tipo')).toHaveAttribute('role', 'combobox');
    expect(screen.getByLabelText('Data').tagName).toBe('BUTTON');
  });
});
