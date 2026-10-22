import type { OvertimeRecord } from '@/api/generated/types/OvertimeRecord';
import { FN_UTILS_DATE } from '@/lib/date';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import {
  formatHoursLong,
  overtimeReportTotals,
  reportPeriodLabel,
} from './overtime-report.helpers';

// Cores da marca (globals.css: --primary hsl(127 44% 68%)) em hex: o PDF não lê CSS.
const BRAND = '#8AD192';
const BRAND_DARK = '#2B6E33';
const BRAND_SOFT = '#EEF8F0';
const INK = '#1F2937';
const MUTED = '#6B7280';
const LINE = '#E5E7EB';

const money = FN_UTILS_NUMBERS.formatCurrency;

const styles = StyleSheet.create({
  page: { paddingTop: 0, paddingBottom: 48, fontFamily: 'Helvetica', fontSize: 9, color: INK },
  // Fundo escuro: texto branco sobre o verde claro da marca não tem contraste.
  header: {
    backgroundColor: BRAND_DARK,
    borderBottomWidth: 4,
    borderBottomColor: BRAND,
    paddingHorizontal: 36,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 30, height: 30, marginRight: 10 },
  brandName: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#FFFFFF' },
  headerRight: { alignItems: 'flex-end' },
  headerTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#FFFFFF' },
  headerSub: { fontSize: 9, color: BRAND_SOFT, marginTop: 2 },
  body: { paddingHorizontal: 36, paddingTop: 24 },
  owner: { fontSize: 10, color: MUTED, marginBottom: 14 },
  cards: { flexDirection: 'row', marginBottom: 20 },
  card: {
    flex: 1,
    backgroundColor: BRAND_SOFT,
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
  },
  cardLast: { marginRight: 0 },
  cardLabel: { fontSize: 8, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.6 },
  cardValue: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: BRAND_DARK, marginTop: 4 },
  cardHint: { fontSize: 8, color: MUTED, marginTop: 2 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: BRAND_DARK,
    marginBottom: 6,
    marginTop: 4,
  },
  table: { borderRadius: 6, borderWidth: 1, borderColor: LINE, marginBottom: 18 },
  row: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 8 },
  rowAlt: { backgroundColor: '#F9FAFB' },
  headRow: { backgroundColor: BRAND_DARK },
  headCell: { color: '#FFFFFF', fontFamily: 'Helvetica-Bold', fontSize: 8 },
  totalRow: { backgroundColor: BRAND_SOFT, borderTopWidth: 1, borderTopColor: BRAND },
  totalCell: { fontFamily: 'Helvetica-Bold', color: BRAND_DARK },
  date: { width: '13%' },
  company: { width: '22%' },
  time: { width: '15%' },
  description: { width: '22%', color: MUTED },
  hours: { width: '13%', textAlign: 'right' },
  amount: { width: '15%', textAlign: 'right' },
  companyName: { width: '46%' },
  companyCount: { width: '16%', textAlign: 'right' },
  companyHours: { width: '19%', textAlign: 'right' },
  companyAmount: { width: '19%', textAlign: 'right' },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: MUTED,
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 6,
  },
});

interface OvertimeReportProps {
  records: OvertimeRecord[];
  month: number;
  year: number;
  ownerName?: string;
  companyName?: string;
  logoSrc: string;
}

export const OvertimeReportDocument = ({
  records,
  month,
  year,
  ownerName,
  companyName,
  logoSrc,
}: OvertimeReportProps) => {
  const totals = overtimeReportTotals(records);
  const period = reportPeriodLabel(month, year);
  const sorted = [...records].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <Document title={`Horas extras · ${period}`} author="Moneyly">
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.brand}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- Image do react-pdf não aceita alt */}
            <Image src={logoSrc} style={styles.logo} />
            <Text style={styles.brandName}>Moneyly</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>Relatório de horas extras</Text>
            <Text style={styles.headerSub}>
              {period}
              {companyName ? ` · ${companyName}` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          {ownerName && <Text style={styles.owner}>{ownerName}</Text>}

          <View style={styles.cards}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total de horas</Text>
              <Text style={styles.cardValue}>{formatHoursLong(totals.hours)}</Text>
              <Text style={styles.cardHint}>
                {totals.hours.toFixed(2).replace('.', ',')} h decimais
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Valor total do mês</Text>
              <Text style={styles.cardValue}>{money(totals.amount)}</Text>
              <Text style={styles.cardHint}>{period}</Text>
            </View>
            <View style={[styles.card, styles.cardLast]}>
              <Text style={styles.cardLabel}>Registros</Text>
              <Text style={styles.cardValue}>{records.length}</Text>
              <Text style={styles.cardHint}>
                {totals.byCompany.length} {totals.byCompany.length === 1 ? 'empresa' : 'empresas'}
              </Text>
            </View>
          </View>

          {totals.byCompany.length > 1 && (
            <>
              <Text style={styles.sectionTitle}>Por empresa</Text>
              <View style={styles.table}>
                <View style={[styles.row, styles.headRow]}>
                  <Text style={[styles.companyName, styles.headCell]}>Empresa</Text>
                  <Text style={[styles.companyCount, styles.headCell]}>Registros</Text>
                  <Text style={[styles.companyHours, styles.headCell]}>Horas</Text>
                  <Text style={[styles.companyAmount, styles.headCell]}>Valor</Text>
                </View>
                {totals.byCompany.map((company, index) => (
                  <View
                    key={company.name}
                    style={[styles.row, ...(index % 2 ? [styles.rowAlt] : [])]}
                  >
                    <Text style={styles.companyName}>{company.name}</Text>
                    <Text style={styles.companyCount}>{company.count}</Text>
                    <Text style={styles.companyHours}>{formatHoursLong(company.hours)}</Text>
                    <Text style={styles.companyAmount}>{money(company.amount)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Text style={styles.sectionTitle}>Registros</Text>
          <View style={styles.table}>
            <View style={[styles.row, styles.headRow]} fixed>
              <Text style={[styles.date, styles.headCell]}>Data</Text>
              <Text style={[styles.company, styles.headCell]}>Empresa</Text>
              <Text style={[styles.time, styles.headCell]}>Horário</Text>
              <Text style={[styles.description, styles.headCell]}>Descrição</Text>
              <Text style={[styles.hours, styles.headCell]}>Horas</Text>
              <Text style={[styles.amount, styles.headCell]}>Valor</Text>
            </View>
            {sorted.map((record, index) => (
              <View
                key={record.id}
                style={[styles.row, ...(index % 2 ? [styles.rowAlt] : [])]}
                wrap={false}
              >
                <Text style={styles.date}>
                  {FN_UTILS_DATE.formatInBusinessTZ(record.startTime, 'dd/MM/yyyy')}
                </Text>
                <Text style={styles.company}>{record.company.name}</Text>
                <Text style={styles.time}>
                  {FN_UTILS_DATE.formatInBusinessTZ(record.startTime, 'HH:mm')}–
                  {FN_UTILS_DATE.formatInBusinessTZ(record.endTime, 'HH:mm')}
                </Text>
                <Text style={styles.description}>{record.description ?? '—'}</Text>
                <Text style={styles.hours}>{formatHoursLong(Number(record.hoursWorked))}</Text>
                <Text style={styles.amount}>{money(record.amount)}</Text>
              </View>
            ))}
            <View style={[styles.row, styles.totalRow]} wrap={false}>
              <Text style={[styles.date, styles.totalCell]}>Total</Text>
              <Text style={styles.company} />
              <Text style={styles.time} />
              <Text style={styles.description} />
              <Text style={[styles.hours, styles.totalCell]}>{formatHoursLong(totals.hours)}</Text>
              <Text style={[styles.amount, styles.totalCell]}>{money(totals.amount)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            Gerado pelo Moneyly em{' '}
            {FN_UTILS_DATE.formatInBusinessTZ(new Date().toISOString(), "dd/MM/yyyy 'às' HH:mm")}
          </Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
