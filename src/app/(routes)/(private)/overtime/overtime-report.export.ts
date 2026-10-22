import { getOvertime } from '@/api/generated/hooks/overtime/overtime';
import type { OvertimeRecord } from '@/api/generated/types/OvertimeRecord';
import { reportFileName } from './overtime-report.helpers';

const PAGE_LIMIT = 100;

interface ExportOvertimePdfParams {
  month: number;
  year: number;
  companyId?: string;
  companyName?: string;
  ownerName?: string;
}

const fetchAllRecords = async ({ month, year, companyId }: ExportOvertimePdfParams) => {
  const records: OvertimeRecord[] = [];
  for (let page = 1; ; page++) {
    const response = await getOvertime({ month, year, companyId, page, limit: PAGE_LIMIT });
    records.push(...response.data);
    if (!response.pagination.hasNext) return records;
  }
};

const download = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const exportOvertimePdf = async (params: ExportOvertimePdfParams) => {
  // react-pdf pesa ~500 KB: só carrega quando alguém exporta.
  const [records, { pdf }, { OvertimeReportDocument }] = await Promise.all([
    fetchAllRecords(params),
    import('@react-pdf/renderer'),
    import('./overtime-report.pdf'),
  ]);

  // Chamado como função: pdf() quer o elemento <Document> de raiz, não um componente.
  const blob = await pdf(
    OvertimeReportDocument({
      records,
      month: params.month,
      year: params.year,
      ownerName: params.ownerName,
      companyName: params.companyName,
      logoSrc: `${window.location.origin}/logo-moneyly.png`,
    })
  ).toBlob();
  download(blob, `${reportFileName(params.month, params.year)}.pdf`);
};
