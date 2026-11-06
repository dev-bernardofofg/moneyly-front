import { getGetOverviewForecastQueryKey } from '@/api/generated/hooks/overview/overview';
import { Dialog } from '@/components/ui/dialog';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { UpsertOvertimeForm } from './upsert-overtime.form';

const captured = vi.hoisted(() => ({ invalidateKeys: [] as readonly (readonly unknown[])[] }));

vi.mock('@/hooks/use-upsert-dialog', async () => {
  const actual = await vi.importActual<typeof import('@/hooks/use-upsert-dialog')>(
    '@/hooks/use-upsert-dialog'
  );
  return {
    useUpsertDialog: (options: Parameters<typeof actual.useUpsertDialog>[0]) => {
      captured.invalidateKeys = options.invalidateKeys;
      return actual.useUpsertDialog(options);
    },
  };
});
vi.mock('@/api/generated/hooks/companies/companies', () => ({
  useGetCompanies: () => ({ data: { data: [] }, isLoading: false }),
}));
vi.mock('@/api/generated/hooks/categories/categories', () => ({
  useGetCategories: () => ({ data: { data: [] }, isLoading: false }),
}));
vi.mock('@/api/generated/hooks/overtime/overtime', () => ({
  getGetOvertimeQueryKey: () => ['/overtime'],
  getGetOvertimeSummaryQueryKey: () => ['/overtime/summary'],
  usePostOvertime: () => ({ isPending: false, mutate: vi.fn() }),
  usePutOvertimeId: () => ({ isPending: false, mutate: vi.fn() }),
}));
vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

afterEach(cleanup);

describe('UpsertOvertimeForm', () => {
  it('invalidates the forecast so the next payment reflects the saved hours', () => {
    render(
      <Dialog>
        <UpsertOvertimeForm />
      </Dialog>
    );

    expect(captured.invalidateKeys).toContainEqual(getGetOverviewForecastQueryKey());
  });
});
