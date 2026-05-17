"use client";

import { Section } from "@/app/(components)/(bases)/(cards)/section";
import { FN_UTILS_NUMBERS } from "@/app/(helpers)/number";
import { useGetOverviewInsightsComparison } from "@/app/(resources)/(generated)/hooks/overview/overview";
import type { ComparativeInsights } from "@/app/(resources)/(generated)/types/ComparativeInsights";
import { ArrowDownRight, ArrowUpRight, Minus, Scale } from "lucide-react";

type Signal = ComparativeInsights["totals"]["signal"];

// up = despesa subiu = ruim (vermelho); down = caiu = bom (verde); stable = neutro.
const signalUi = (signal: Signal) => {
  switch (signal) {
    case "up":
      return { Icon: ArrowUpRight, cls: "text-expense" };
    case "down":
      return { Icon: ArrowDownRight, cls: "text-income" };
    default:
      return { Icon: Minus, cls: "text-muted-foreground" };
  }
};

const pct = (v: number | null) =>
  v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

export const ComparisonSection = () => {
  const { data, isLoading } = useGetOverviewInsightsComparison();
  const cmp = data?.data;

  const totals = cmp?.totals;
  const byCategory = cmp?.byCategory ?? [];
  const highlights = cmp?.highlights ?? [];
  const t = totals && signalUi(totals.signal);

  return (
    <Section
      Icon={Scale}
      title={`Comparativo vs média${
        cmp?.basis ? ` (${cmp.basis.periodsCompared} períodos)` : ""
      }`}
    >
      {isLoading ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Carregando...
        </p>
      ) : !cmp || byCategory.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Sem histórico suficiente para comparar.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
            <div>
              <p className="text-sm text-muted-foreground">Despesa do período</p>
              <p className="text-lg font-bold">
                {FN_UTILS_NUMBERS.formatCurrency(totals?.currentExpense ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground">
                média {FN_UTILS_NUMBERS.formatCurrency(totals?.averageExpense ?? 0)}
              </p>
            </div>
            {t && (
              <div className={`flex items-center gap-1 font-semibold ${t.cls}`}>
                <t.Icon className="size-5" />
                {pct(totals?.deltaPct ?? null)}
              </div>
            )}
          </div>

          {highlights.length > 0 && (
            <ul className="space-y-1">
              {highlights.map((h, i) => (
                <li
                  key={i}
                  className="rounded-md border-l-2 border-l-primary bg-primary/5 px-3 py-2 text-sm"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}

          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {byCategory.map((c) => {
              const ui = signalUi(c.signal);
              return (
                <li
                  key={c.categoryId}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                      {c.categoryName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <span className="text-sm">
                      {FN_UTILS_NUMBERS.formatCurrency(c.currentExpense)}
                    </span>
                    <span
                      className={`flex items-center gap-0.5 text-sm font-semibold ${ui.cls}`}
                    >
                      <ui.Icon className="size-4" />
                      {pct(c.deltaPct)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Section>
  );
};
