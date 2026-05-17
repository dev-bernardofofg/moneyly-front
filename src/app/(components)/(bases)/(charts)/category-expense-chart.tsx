"use client";

import { EvilBarChart } from "@/components/evilcharts/charts/bar-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";
import { ChartCategory } from "@/app/(resources)/(generated)/types/ChartCategory";
import { PeriodChartItem } from "@/app/(resources)/(generated)/types/PeriodChartItem";
import { FN_UTILS_NUMBERS } from "@/app/(helpers)/number";

type DataPoint = { category: string; amount: number };

const chartConfig = {
  amount: {
    label: "Gasto",
    colors: {
      light: ["#f43f5e", "#fb923c"],
      dark: ["#f43f5e", "#c026d3"],
    },
  },
} satisfies ChartConfig;

function buildData(data: PeriodChartItem[], categories: ChartCategory[]): DataPoint[] {
  return categories
    .map((cat) => ({
      category: cat.name,
      amount: data.reduce((sum, item) => sum + (Number(item[cat.name]) || 0), 0),
    }))
    .sort((a, b) => a.category.localeCompare(b.category, "pt-BR"));
}

type Props = {
  data: PeriodChartItem[];
  categories: ChartCategory[];
  isLoading?: boolean;
};

export function CategoryExpenseChart({ data, categories, isLoading }: Props) {
  const chartData = buildData(data, categories);

  return (
    <EvilBarChart
      data={chartData}
      chartConfig={chartConfig}
      xDataKey="category"
      barVariant="gradient"
      hideLegend
      isLoading={isLoading}
      yAxisProps={{
        tickFormatter: (v: number) => FN_UTILS_NUMBERS.formatCurrency(v),
        width: 72,
      }}
      className="h-64 w-full"
    />
  );
}
