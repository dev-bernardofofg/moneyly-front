"use client";

import { EvilBarChart } from "@/components/evilcharts/charts/bar-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";
import { CategoryChartItem } from "@/app/(resources)/(generated)/types/CategoryChartItem";
import { FN_UTILS_NUMBERS } from "@/app/(helpers)/number";

const chartConfig = {
  income: {
    label: "Receita",
    colors: {
      light: ["#89D192", "#b8eabe"],
      dark: ["#89D192", "#5aba69"],
    },
  },
  expense: {
    label: "Despesa",
    colors: {
      light: ["#ef4444", "#f87171"],
      dark: ["#dc2626", "#ef4444"],
    },
  },
} satisfies ChartConfig;

type Props = {
  data: CategoryChartItem[];
  isLoading?: boolean;
};

export function MonthlyHistoryChart({ data, isLoading }: Props) {
  const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return (
    <EvilBarChart
      data={sorted}
      chartConfig={chartConfig}
      xDataKey="name"
      barVariant="gradient"
      isLoading={isLoading}
      tooltipValueFormatter={FN_UTILS_NUMBERS.formatNumberToCurrency}
      yAxisProps={{
        tickFormatter: (v: number | string) => FN_UTILS_NUMBERS.formatNumberToCurrency(v),
        width: 72,
      }}
      className="h-64 w-full"
    />
  );
}
