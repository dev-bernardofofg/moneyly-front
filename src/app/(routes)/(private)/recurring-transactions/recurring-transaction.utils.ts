const DAY_OF_WEEK_LABELS: Record<number, string> = {
  0: "Dom",
  1: "Seg",
  2: "Ter",
  3: "Qua",
  4: "Qui",
  5: "Sex",
  6: "Sáb",
};

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Diária",
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual",
};

export function formatFrequency(
  frequency: string,
  dayOfWeek?: number | null,
  dayOfMonth?: number | null,
): string {
  const base = FREQUENCY_LABELS[frequency] ?? frequency;
  if (frequency === "weekly" && dayOfWeek != null) {
    return `${base} (${DAY_OF_WEEK_LABELS[dayOfWeek] ?? dayOfWeek})`;
  }
  if (frequency === "monthly" && dayOfMonth != null) {
    return `${base} (dia ${dayOfMonth})`;
  }
  return base;
}
