"use client";
import { Progress } from "./progress";

interface LinearProgressProps {
  value: number;
  maxValue: number;
}

export const LinearProgress = ({ value, maxValue }: LinearProgressProps) => {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="w-full flex items-center justify-center gap-3">
      <Progress value={percentage} className="w-full" />
      <span className="text-sm text-muted-foreground">{percentage.toFixed(2)}%</span>
    </div>
  );
}