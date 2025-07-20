"use client";

import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Bell, CheckCircle, Info, XCircle } from "lucide-react";
import { useState } from "react";

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: Date;
  priority: "low" | "medium" | "high";
}

interface AlertsPopoverProps {
  alerts: Alert[];
  trigger: React.ReactNode;
}

export const AlertsPopover = ({
  alerts,
  trigger
}: AlertsPopoverProps) => {
  const [open, setOpen] = useState(false);

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="size-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="size-4 text-yellow-600" />;
      case "error":
        return <XCircle className="size-4 text-red-600" />;
      default:
        return <Info className="size-4 text-blue-600" />;
    }
  };

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-50 dark:bg-green-950/20";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
      case "error":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/20";
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
    }
  };

  const getPriorityBadge = (priority: Alert["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="text-xs">Alta</Badge>;
      case "medium":
        return <Badge variant="secondary" className="text-xs">Média</Badge>;
      case "low":
        return <Badge variant="outline" className="text-xs">Baixa</Badge>;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  // Ordenar alertas por prioridade (alta -> média -> baixa) e depois por timestamp
  const sortedAlerts = [...alerts].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

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
            sortedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 transition-colors ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground">
                          {alert.title}
                        </p>
                        {getPriorityBadge(alert.priority)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(alert.timestamp)}
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