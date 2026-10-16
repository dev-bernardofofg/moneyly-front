import type { TransactionImportPreview } from '@/app/(resources)/(generated)/types/TransactionImportPreview';

export type ImportPreviewItem = TransactionImportPreview['items'][number];

export interface ImportRowState {
  selected: boolean;
  categoryId: string;
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

// Já importada nunca entra; possível duplicata e pagamento de fatura (não é renda) começam
// desmarcados para o usuário decidir.
// Nada identificou a compra e o usuário ainda não trocou a categoria sugerida ("Outros").
export const isUncategorized = (item: ImportPreviewItem, row: ImportRowState) =>
  item.status !== 'imported' &&
  item.suggestionSource === 'fallback' &&
  row.categoryId === (item.suggestedCategoryId ?? '');

export const initialRowState = (item: ImportPreviewItem): ImportRowState => ({
  selected: item.status === 'new',
  categoryId: item.suggestedCategoryId ?? '',
});
