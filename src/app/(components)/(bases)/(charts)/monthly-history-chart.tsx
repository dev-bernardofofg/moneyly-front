"use client";

import { EvilBarChart } from "@/components/evilcharts/charts/bar-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";
import { CategoryChartItem } from "@/app/(resources)/(generated)/types/CategoryChartItem";
import { FN_UTILS_NUMBERS } from "@/app/(helpers)/number";
import { BarChart3 } from "lucide-react";

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

  if (!isLoading && sorted.length === 0) {
    return (
      <div className="flex size-full min-h-[180px] flex-col items-center justify-center px-4 text-center">
        <BarChart3 className="mb-2 size-12 text-muted-foreground/50" aria-hidden />
        <p className="text-sm text-muted-foreground">Sem dados de histórico para este período.</p>
      </div>
    );
  }

  return (
    <EvilBarChart
      data={sorted}
      chartConfig={chartConfig}
      xDataKey="name"
      barVariant="gradient"
      showAverageLine
      showHoverBounds
      isLoading={isLoading}
      tooltipValueFormatter={FN_UTILS_NUMBERS.formatNumberToCurrency}
      yAxisProps={{
        tickFormatter: (v: number | string) => FN_UTILS_NUMBERS.formatNumberToCurrency(v),
        width: 96,
      }}
      className="size-full"
    />
  );
}
