"use client";

import { AlertsPlannerResponse } from "@/app/(types)/overview";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Bell, CheckCircle, Info, XCircle } from "lucide-react";
import { useState } from "react";


interface AlertsPopoverProps {
  alerts: AlertsPlannerResponse[];
  trigger: React.ReactNode;
}

export const AlertsPopover = ({
  alerts,
  trigger
}: AlertsPopoverProps) => {
  const [open, setOpen] = useState(false);

  const getAlertIcon = (type: AlertsPlannerResponse["type"]) => {
    switch (type) {
      case "info":
        return <CheckCircle className="size-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="size-4 text-yellow-600" />;
      case "error":
        return <XCircle className="size-4 text-red-600" />;
      default:
        return <Info className="size-4 text-blue-600" />;
    }
  };

  const getAlertColor = (type: AlertsPlannerResponse["type"]) => {
    switch (type) {
      case "info":
        return "border-l-green-500 bg-green-50 dark:bg-green-950/20";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
      case "error":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/20";
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
    }
  };

  const getPriorityBadge = (priority: AlertsPlannerResponse["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="text-xs text-red-600">Alta</Badge>;
      case "medium":
        return <Badge variant="secondary" className="text-xs text-yellow-600">Média</Badge>;
      case "low":
        return <Badge variant="secondary" className="text-xs text-green-600">Baixa</Badge>;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          {trigger}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-hidden" align="end">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm">Alertas</h4>
          <span className="text-xs text-muted-foreground">
            {alerts.length} alerta{alerts.length !== 1 ? 's' : ''}
          </span>
        </div>

        <Separator className="mb-3" />

        <div className="max-h-64 overflow-y-auto space-y-2">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum alerta</p>
              <p className="text-xs mt-1">Tudo em ordem!</p>
            </div>
          ) : (
            alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 transition-colors ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground">
                          {alert.goal}
                        </p>
                        {getPriorityBadge(alert.priority)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 