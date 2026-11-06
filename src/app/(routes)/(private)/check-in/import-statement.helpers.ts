import type { TransactionImportPreview } from '@/api/generated/types/TransactionImportPreview';

export type ImportPreviewItem = TransactionImportPreview['items'][number];

export interface ImportRowState {
  selected: boolean;
  categoryId: string;
  // create = nova transação; transfer = junta com a outra ponta; link = confirma o lançamento
  // que já está no app. Os dois últimos não levam categoria.
  mode: 'create' | 'transfer' | 'link';
}

// base64url sem padding: é o formato que o back exige (o sanitizer global remove "=").
export const toBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Nada identificou a compra e o usuário ainda não trocou a categoria sugerida ("Outros").
export const isUncategorized = (item: ImportPreviewItem, row: ImportRowState) =>
  item.status !== 'imported' &&
  row.mode === 'create' &&
  item.suggestionSource === 'fallback' &&
  row.categoryId === (item.suggestedCategoryId ?? '');

// Já importada nunca entra; pagamento de fatura (não é renda) começa desmarcado. Linha que já
// está no app vem marcada para confirmar, não para duplicar.
export const initialRowState = (item: ImportPreviewItem): ImportRowState => ({
  selected: ['new', 'transfer', 'possible_duplicate'].includes(item.status),
  categoryId: item.suggestedCategoryId ?? '',
  mode:
    item.status === 'transfer'
      ? 'transfer'
      : item.status === 'possible_duplicate' && item.duplicateOf
        ? 'link'
        : 'create',
});
